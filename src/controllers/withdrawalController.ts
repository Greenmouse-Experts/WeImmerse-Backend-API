import { Request, Response } from 'express';
import WithdrawalAccount from '../models/withdrawalaccount';
import { PaystackService } from '../services/paystack.service';
import Wallet from '../models/wallet';
import WalletService from '../services/wallet.service';
import WithdrawalService from '../services/withdrawal.service';
import sequelizeService from '../services/sequelize.service';
import User from '../models/user';
import {
  formatMoney,
  getPaginationFields,
  getTotalPages,
} from '../utils/helpers';
import { Transaction } from 'sequelize';
import WithdrawalRequest from '../models/withdrawalrequest';
import { emailTemplates } from '../utils/messages';
import { sendMail } from '../services/mail.service';
import logger from '../middlewares/logger';
import WithdrawalHistory from '../models/withdrawalhistory';

interface AuthRequest extends Request {
  user?: any;
  admin?: any;
}

/**
 * Create withdrawal account
 * @param req
 * @param res
 * @returns
 */
export const createWithdrawalAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  // Retrieve the authenticated user's ID
  const userId = (req as AuthRequest).user?.id;
  const { accountNumber, bankCode } = req.body;

  const transaction = await sequelizeService.connection?.transaction();

  try {
    // Check if account exists
    const accountExists = await WithdrawalAccount.findOne({
      where: { userId },
      transaction,
    });

    if (accountExists) {
      return res
        .status(409)
        .json({ status: false, message: 'Withdrawal account exists.' });
    }

    // Verify account with paystack
    const verifiedAccount = await PaystackService.verifyBankAccount(
      accountNumber,
      bankCode
    );

    const account = JSON.parse(
      JSON.stringify(
        await WithdrawalAccount.create(
          {
            ...req.body,
            userId,
            accountName: verifiedAccount.account_name,
          },
          { transaction }
        )
      )
    );

    // Create a wallet for user if not existent
    await WalletService.createWallet(userId);

    transaction?.commit();

    res.status(201).json({
      status: true,
      message: 'Withdrawal account created successfully.',
      data: { ...account, verifiedAccount },
    });
  } catch (error: any) {
    res.status(error?.response?.status || 500).json({
      status: false,
      message: error.message,
      error,
    });
  }
};

/**
 * Get withdrawal accounts
 * @param req
 * @param res
 */
export const getWithdrawalAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await WithdrawalAccount.findAll();
    res.status(200).json({ status: true, data: accounts });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error fetching withdrawal accounts',
      error,
    });
  }
};

/**
 * Get withdrawal account details
 * @param req
 * @param res
 * @returns
 */
export const getWithdrawalAccountById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const account = await WithdrawalAccount.findByPk(req.params.id);
    if (!account)
      return res
        .status(404)
        .json({ status: false, message: 'Account not found' });
    res.status(200).json({ status: true, data: account });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error fetching withdrawal account',
      error,
    });
  }
};

/**
 * Update withdrawal account
 * @param req
 * @param res
 * @returns
 */
export const updateWithdrawalAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const account = await WithdrawalAccount.findByPk(req.params.id);
    if (!account)
      return res
        .status(404)
        .json({ status: true, message: 'Account not found' });
    await account.update(req.body);
    res.status(200).json({
      status: true,
      message: 'Withdrawal account updated successfully.',
      account,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error updating withdrawal account',
      error,
    });
  }
};

/**
 * Delete withdrawal account
 * @param req
 * @param res
 * @returns
 */
export const deleteWithdrawalAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const account = await WithdrawalAccount.findByPk(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    await account.destroy();
    res.status(200).send({
      status: true,
      message: 'Withdrawal account deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error deleting withdrawal account',
      error,
    });
  }
};

// Request
export const requestWithdrawal = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = (req as AuthRequest).user!;
    const { id: userId, name, email } = user;

    const { amount, currency, paymentProvider } = req.body;

    // Check if withdrawal threshold is reached
    if (amount < process?.env?.WITHDRAWAL_THRESHOLD_NGN!) {
      throw new Error(
        `Withdrawal threshold amount of ${formatMoney(
          +process?.env?.WITHDRAWAL_THRESHOLD_NGN!,
          currency
        )} not reached.`
      );
    }

    // Get wallet
    const wallet = await Wallet.findOne({
      where: { userId, currency },
    });
    if (!wallet) throw new Error('Wallet not found');
    if (wallet.balance < amount) throw new Error('Insufficient balance');

    // Get withdrawal account details
    const withdrawalAccount = await WithdrawalAccount.findOne({
      where: { userId },
      include: [{ model: User, as: 'user' }],
    });

    let recipientCode = '';
    // If recipientCode is not provided, create a new recipient in Paystack
    if (paymentProvider.toLowerCase() === 'paystack') {
      if (!withdrawalAccount) {
        throw new Error(
          'Bank details are required to create a Paystack recipient'
        );
      }
      recipientCode = await PaystackService.createTransferRecipient(
        name,
        email,
        withdrawalAccount.accountNumber,
        withdrawalAccount.bankCode
      );
    }

    const result = await WithdrawalService.requestWithdrawal(
      userId,
      amount,
      currency,
      paymentProvider,
      recipientCode
    );

    if (!result.success) return res.status(400).json({ error: result.message });

    // Deduct fund from wallet
    await WalletService.deductWallet(userId, amount, currency);

    // Send email to admin
    const message = emailTemplates.withdrawalRequestEmail(
      user,
      result.withdrawalRequest!
    );

    try {
      await sendMail(
        process.env.ADMIN_EMAIL!,
        `${process.env.APP_NAME} - Withdrawal Request Notification`,
        message
      );
    } catch (emailError) {
      logger.error('Error sending email:', emailError); // Log error for internal use
    }

    res.json({
      status: true,
      message: 'Withdrawal request created successfully.',
      data: result.withdrawalRequest,
    });
  } catch (error: any) {
    console.log(error);

    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * Fetch withdrawal requests
 * @param req
 * @param res
 * @returns
 */
export const fetchWithdrawalRequests = async (
  req: Request,
  res: Response
): Promise<any> => {
  // const transaction = await sequelizeService.connection!.transaction();

  const whereCondition = {};

  const { page, limit, offset } = getPaginationFields(
    req.query.page as string,
    req.query.limit as string
  );

  const { rows: withdrawalRequest, count: totalItems } =
    await WithdrawalRequest.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'user',
        },
        // Adjust alias to match your associations
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

  // Calculate pagination metadata
  const totalPages = getTotalPages(totalItems, limit);

  // Respond with the paginated jobs and metadata
  return res.status(200).json({
    message: 'Withdrawal requests retrieved successfully.',
    data: withdrawalRequest,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    },
  });
};

// Approve
export const approveWithdrawal = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id: adminId } = (req as AuthRequest).admin!;
  const { requestId, approve } = req.body;
  const transaction = await sequelizeService.connection!.transaction();

  const result = await WithdrawalService.approveWithdrawal(
    adminId,
    requestId,
    approve,
    transaction
  );

  if (!result.success)
    return res.status(400).json({ status: false, message: result.message });

  // Send email to notify
  const message = emailTemplates.withdrawalRequestVettingEmail(
    (result.data?.withdrawalRequest as any)['user'],
    result.data?.withdrawalRequest!
  );

  try {
    await sendMail(
      (result.data?.withdrawalRequest as any)['user'].email,
      `${process.env.APP_NAME} - Withdrawal Request Notification`,
      message
    );
  } catch (emailError) {
    logger.error('Error sending email:', emailError); // Log error for internal use
  }

  await transaction.commit();

  res.json(result);
};

/**
 * Finalize withdrawal
 * @param req
 * @param res
 * @returns
 */
export const finalizeWithdrawal = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id: adminId } = (req as AuthRequest).admin!;
  const { withdrawalHistoryId, otp } = req.body;
  const transaction = await sequelizeService.connection!.transaction();

  try {
    const result = await WithdrawalService.finalizeWithdrawal(
      adminId,
      withdrawalHistoryId,
      otp,
      transaction
    );

    // Send email to user concerned - creator or instructor
    const withdrawalHistory = result.data as WithdrawalHistory & {
      user: User & { wallet: Wallet };
    };
    // Send email to notify
    const message = emailTemplates.withdrawalSuccessEmail(withdrawalHistory);

    try {
      await sendMail(
        withdrawalHistory.user.email,
        `${process.env.APP_NAME} - Your Wallet Has Been Credited!`,
        message
      );
    } catch (emailError) {
      logger.error('Error sending email:', emailError); // Log error for internal use
    }

    if (!result.success)
      return res.status(400).json({ status: false, message: result.message });

    await transaction.commit();

    res.json(result);
  } catch (error: any) {
    await transaction.rollback();
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
