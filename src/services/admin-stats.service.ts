// services/admin-stats.service.ts
import { Op, Sequelize } from 'sequelize';
import Transaction from '../models/transaction';
import User from '../models/user';
import Subscription from '../models/subscription';

interface AdminStats {
  totalUsers: number;
  totalIncome: number;
  totalActiveUsers: number;
  totalSubscriptions: number;
  monthlyTrends: {
    month: number;
    newUsers: number;
    income: number;
    newSubscriptions: number;
  }[];
}

class AdminStatsService {
  async getAdminStats(year: number): Promise<AdminStats> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    // Get all data in parallel
    const [
      totalUsers,
      totalIncome,
      totalActiveUsers,
      totalSubscriptions,
      monthlyTrends,
    ] = await Promise.all([
      this.getTotalUsers(),
      this.getTotalIncome(),
      this.getTotalActiveUsers(),
      this.getTotalSubscriptions(),
      this.getMonthlyTrends(startDate, endDate),
    ]);

    return {
      totalUsers,
      totalIncome,
      totalActiveUsers,
      totalSubscriptions,
      monthlyTrends,
    };
  }

  private async getTotalUsers(): Promise<number> {
    return User.count();
  }

  private async getTotalIncome(): Promise<number> {
    const result = (await Transaction.findOne({
      where: { status: 'success' },
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('amount')), 'totalAmount'],
      ],
      raw: true,
    })) as any;

    return parseFloat(result?.totalAmount || '0');
  }

  private async getTotalActiveUsers(): Promise<number> {
    // Active users are those who logged in within the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return User.count({
      where: {
        lastLogin: { [Op.gte]: thirtyDaysAgo },
      },
    });
  }

  private async getTotalSubscriptions(): Promise<number> {
    return Subscription.count({
      where: {
        status: 'active',
      },
    });
  }

  private async getMonthlyTrends(
    startDate: Date,
    endDate: Date
  ): Promise<AdminStats['monthlyTrends']> {
    // Initialize monthly trends array
    const monthlyTrends = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      newUsers: 0,
      income: 0,
      newSubscriptions: 0,
    }));

    // Get monthly user counts
    const monthlyUsers = await User.findAll({
      attributes: [
        [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      group: ['month'],
      raw: true,
    });

    // Get monthly income
    const monthlyIncome = await Transaction.findAll({
      attributes: [
        [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'],
      ],
      where: {
        status: 'success',
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      group: ['month'],
      raw: true,
    });

    // Get monthly subscription counts
    const monthlySubscriptions = await Subscription.findAll({
      attributes: [
        [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      where: {
        status: 'active',
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      group: ['month'],
      raw: true,
    });

    // Populate monthly trends
    monthlyUsers.forEach(({ month, count }: any) => {
      const index = month - 1;
      if (index >= 0 && index < 12) {
        monthlyTrends[index].newUsers = parseInt(count) || 0;
      }
    });

    monthlyIncome.forEach(({ month, amount }: any) => {
      const index = month - 1;
      if (index >= 0 && index < 12) {
        monthlyTrends[index].income = parseFloat(amount) || 0;
      }
    });

    monthlySubscriptions.forEach(({ month, count }: any) => {
      const index = month - 1;
      if (index >= 0 && index < 12) {
        monthlyTrends[index].newSubscriptions = parseInt(count) || 0;
      }
    });

    return monthlyTrends;
  }
}

export default new AdminStatsService();
