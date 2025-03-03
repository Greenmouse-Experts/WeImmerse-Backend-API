import { Request, Response } from 'express';
import WithdrawalAccount from '../models/withdrawalaccount';

interface AuthRequest extends Request {
  user?: any;
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
  const { accountNumber } = req.body;

  try {
    // Check if account exists
    const accountExists = await WithdrawalAccount.findOne({
      where: { userId },
    });

    if (accountExists) {
      return res
        .status(409)
        .json({ status: false, message: 'Withdrawal account exists.' });
    }

    // Verify account with paystack

    const account = await WithdrawalAccount.create({ ...req.body, userId });
    res.status(201).json({
      status: true,
      message: 'Withdrawal account created successfully.',
      data: account,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: 'Error creating withdrawal account',
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
