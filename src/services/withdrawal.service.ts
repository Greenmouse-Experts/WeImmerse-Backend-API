import WithdrawalRequest, {
  WithdrawalStatus,
} from '../models/withdrawalrequest';
import WithdrawalHistory from '../models/withdrawalhistory';
import User from '../models/user';
import Admin from '../models/admin';
import WithdrawalAccount from '../models/withdrawalaccount';
import { finalizeTransfer, initiateTransfer } from './paystack.service';

class WithdrawalService {
  static async requestWithdrawal(
    userId: string,
    amount: number,
    currency: string,
    paymentProvider: string,
    recipientCode: string
  ) {
    try {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) throw new Error('User not found');

      const withdrawalRequest = await WithdrawalRequest.create({
        userId: userId,
        amount,
        currency,
        paymentProvider,
        recipientCode,
        status: WithdrawalStatus.PENDING,
      });

      return { success: true, withdrawalRequest };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Approve withdrawal
   * @param adminId
   * @param requestId
   * @param approve
   * @param transaction
   * @returns
   */
  static async approveWithdrawal(
    adminId: string,
    requestId: string,
    approve = true,
    transaction: any
  ) {
    try {
      const admin = await Admin.findByPk(adminId);
      if (!admin) throw new Error('Admin not found');

      const withdrawalRequest = await WithdrawalRequest.findByPk(requestId);
      if (!withdrawalRequest) throw new Error('Withdrawal request not found');
      if (withdrawalRequest.status !== WithdrawalStatus.PENDING) {
        throw new Error('Withdrawal request already processed');
      }

      let status = approve
        ? WithdrawalStatus.APPROVED
        : WithdrawalStatus.REJECTED;
      await withdrawalRequest.update(
        {
          status,
          adminReviewedBy: adminId,
          adminReviewedAt: new Date(),
        },
        { transaction }
      );

      let message = '';
      let withdrawalHistory = {};
      if (approve) {
        // Retrieve the withdrawal account record
        const withdrawalAccount = await WithdrawalAccount.findOne({
          where: { userId: withdrawalRequest.userId },
        });
        if (!withdrawalAccount) throw new Error('Withdrawal account not found');

        const transferResponse = await initiateTransfer(
          withdrawalRequest.amount,
          withdrawalRequest.recipientCode,
          'Withdrawal payout'
        );

        message = transferResponse.message;

        withdrawalHistory = await WithdrawalHistory.create(
          {
            userId: withdrawalRequest.userId,
            amount: withdrawalRequest.amount,
            currency: withdrawalRequest.currency,
            paymentProvider: withdrawalRequest.paymentProvider,
            payoutReference: transferResponse.data.transfer_code,
            status: WithdrawalStatus.PENDING,
            transactionDate: new Date(),
          },
          { transaction }
        );
      }

      await transaction.commit();
      return {
        success: true,
        message,
        data: withdrawalHistory,
      };
    } catch (error: any) {
      await transaction.rollback();
      return { success: false, message: error.message };
    }
  }

  /**
   * Finalize withdrawal
   * @param adminId
   * @param withdrawalHistoryId
   * @param otp
   * @param transaction
   * @returns
   */
  static async finalizeWithdrawal(
    adminId: string,
    withdrawalHistoryId: string,
    otp: string,
    transaction: any
  ) {
    try {
      const admin = await Admin.findByPk(adminId);
      if (!admin) throw new Error('Admin not found');

      // Get withdrawal history details
      const withdrawalHistory = await WithdrawalHistory.findOne({
        where: { id: withdrawalHistoryId },
        transaction,
      });
      if (!withdrawalHistory) {
        throw new Error('Withdrawal history not found.');
      }

      // Finalize transfer with otp
      const paymentVerification = await finalizeTransfer(
        withdrawalHistory.payoutReference,
        otp
      );

      if (!paymentVerification.status) {
        throw new Error('Payment verification failed');
      }

      return { success: true, message: paymentVerification.message };
    } catch (error: any) {
      await transaction.rollback();
      return { success: false, message: error.message };
    }
  }
}

export default WithdrawalService;
