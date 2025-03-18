import { Transaction } from 'sequelize';
import Wallet from '../models/wallet';
import { Sequelize, Op } from 'sequelize';
import sequelizeService from './sequelize.service';

class WalletService {
  /**
   * Create a wallet for a user
   * @param userId - The user's ID
   * @returns The created wallet
   */
  static async createWallet(userId: string) {
    try {
      const walletExists = await Wallet.findOne({ where: { userId } });

      if (walletExists) {
        return;
      }

      const wallet = await Wallet.create({ userId });
      return wallet;
    } catch (error: any) {
      throw new Error(`Wallet creation failed: ${error.message}`);
    }
  }

  /**
   * Top up a user's wallet balance
   * @param userId - The user's ID
   * @param amount - The amount to top up
   * @returns The updated wallet
   */
  static async topUpWallet(
    userId: string,
    amount: number,
    currency: string,
    t?: any
  ) {
    if (amount <= 0) {
      throw new Error('Top-up amount must be greater than zero.');
    }

    const wallet = await Wallet.findOne({
      where: { userId, currency },
      transaction: t,
    });

    if (!wallet) {
      throw new Error('Wallet not found.');
    }

    wallet.previousBalance = wallet.balance;
    wallet.balance = Number(wallet.balance) + Number(amount);

    await wallet.save({ transaction: t });
    return wallet;
  }

  /**
   * Deduct funds from a user's wallet
   * @param userId - The user's ID
   * @param amount - The amount to deduct
   * @returns The updated wallet
   */
  static async deductWallet(userId: string, amount: number, currency: string) {
    if (amount <= 0) {
      throw new Error('Deduction amount must be greater than zero.');
    }

    await sequelizeService.connection?.transaction(async (t) => {
      const wallet = await Wallet.findOne({
        where: { userId, currency },
        transaction: t,
      });

      if (!wallet) {
        throw new Error('Wallet not found.');
      }

      if (wallet.balance < amount) {
        throw new Error('Insufficient wallet balance.');
      }

      wallet.previousBalance = wallet.balance;
      wallet.balance = wallet.balance - amount;

      await wallet.save({ transaction: t });
      return wallet;
    });
  }

  /**
   * Get current balance
   * @param userId
   * @param currency
   * @returns
   */
  static async getCurrentBalance(
    userId: string,
    currency: string
  ): Promise<any> {
    try {
      const wallet = await Wallet.findOne({ where: { userId, currency } });
      if (!wallet) throw new Error('Wallet not found');

      return wallet;
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }
}

export default WalletService;
