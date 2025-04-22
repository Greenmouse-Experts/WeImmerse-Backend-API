import { Op } from 'sequelize';
import { YearlyAnalysis } from './analysis.service';
import Transaction from '../models/transaction';
import { parseFormattedAmount } from '../utils/helpers';

interface TopItem {
  id: string;
  name: string;
  revenue: number;
  image?: string;
  assetUpload?: string;
  assetThumbnail?: string;
}

class InstitutionAnalysis {
  private async getMonthlyPurchasesByProductType(
    userId: string,
    year: number = new Date().getFullYear()
  ): Promise<YearlyAnalysis> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    // Build the where clause conditionally
    const where: any = {
      status: 'success',
      createdAt: { [Op.between]: [startDate, endDate] },
      userId,
    };

    // if (userId) {
    //   where.metadata = { [Op.like]: `%${userId}%` };
    // }

    // Get all successful transactions for the year
    const transactions = await Transaction.findAll({
      where,
    });

    // Initialize results with proper numeric values
    const result: YearlyAnalysis = {
      totalRevenue: 0,
      courses: { revenue: 0, count: 0, topItems: [] },
      digitalAssets: { revenue: 0, count: 0, topItems: [] },
      physicalAssets: { revenue: 0, count: 0, topItems: [] },
      monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        coursesRevenue: 0,
        digitalRevenue: 0,
        physicalRevenue: 0,
        totalRevenue: 0,
        transactions: 0,
      })),
    };

    // Track top items with proper numeric values
    const courseRevenueMap = new Map<string, number>();
    const digitalAssetRevenueMap = new Map<string, number>();
    const physicalAssetRevenueMap = new Map<string, number>();

    // Process each transaction with proper number handling
    for (const tx of transactions) {
      const amount = Number(tx.amount);
      const month = tx.createdAt.getMonth();

      // Update monthly trends by product type
      tx.metadata?.items.forEach((details: any) => {
        switch (details.productType) {
          case 'course':
            result.monthlyTrends[month].coursesRevenue += parseFormattedAmount(
              details?.price
            );
            result.courses.revenue += parseFormattedAmount(details?.price);
            result.courses.count += 1;
            if (tx.productId) {
              const current = courseRevenueMap.get(tx.productId) || 0;
              courseRevenueMap.set(
                tx.productId,
                current + parseFormattedAmount(details?.price)
              );
            }
            break;

          case 'digital_asset':
            result.monthlyTrends[month].digitalRevenue += parseFormattedAmount(
              details?.price
            );
            result.digitalAssets.revenue += parseFormattedAmount(
              details?.price
            );
            result.digitalAssets.count += 1;
            if (tx.productId) {
              const current = digitalAssetRevenueMap.get(tx.productId) || 0;
              digitalAssetRevenueMap.set(
                tx.productId,
                current + parseFormattedAmount(details?.price)
              );
            }
            break;

          case 'physical_asset':
            result.monthlyTrends[month].physicalRevenue += parseFormattedAmount(
              details?.price
            );
            result.physicalAssets.revenue += parseFormattedAmount(
              details?.price
            );
            result.physicalAssets.count += 1;
            if (tx.productId) {
              const current = physicalAssetRevenueMap.get(tx.productId) || 0;
              physicalAssetRevenueMap.set(
                tx.productId,
                current + parseFormattedAmount(details?.price)
              );
            }
            break;
        }
      });

      // Update total monthly values
      result.monthlyTrends[month].totalRevenue += amount;
      result.monthlyTrends[month].transactions += 1;
      result.totalRevenue += amount;
    }

    return this.formatResults(result);
  }

  private formatResults(result: YearlyAnalysis): YearlyAnalysis {
    return {
      totalRevenue: parseFloat(result.totalRevenue.toFixed(2)),
      courses: {
        revenue: parseFloat(result.courses.revenue.toFixed(2)),
        count: result.courses.count,
        topItems: this.sortAndLimit(result.courses.topItems),
      },
      digitalAssets: {
        revenue: parseFloat(result.digitalAssets.revenue.toFixed(2)),
        count: result.digitalAssets.count,
        topItems: this.sortAndLimit(result.digitalAssets.topItems),
      },
      physicalAssets: {
        revenue: parseFloat(result.physicalAssets.revenue.toFixed(2)),
        count: result.physicalAssets.count,
        topItems: this.sortAndLimit(result.physicalAssets.topItems),
      },

      monthlyTrends: result.monthlyTrends.map((month) => ({
        ...month,
        coursesRevenue: parseFloat(month.coursesRevenue.toFixed(2)),
        digitalRevenue: parseFloat(month.digitalRevenue.toFixed(2)),
        physicalRevenue: parseFloat(month.physicalRevenue.toFixed(2)),
        totalRevenue: parseFloat(month.totalRevenue.toFixed(2)),
      })),
    };
  }

  private sortAndLimit(items: TopItem[]): TopItem[] {
    return items
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        revenue: parseFloat(item.revenue.toFixed(2)),
      }));
  }

  async compiledForInstitution(userId: string) {
    const [
      newAddedStudents,
      recentNotifications,
      purchaseAnalysis,
      expensesAnalysis,
    ] = await Promise.all([
      [],
      [],
      await this.getMonthlyPurchasesByProductType(userId),
      [],
    ]);

    return {
      newAddedStudents,
      recentNotifications,
      purchaseAnalysis,
      expensesAnalysis,
    };
  }
}

export default new InstitutionAnalysis();
