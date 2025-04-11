// services/analysis.service.ts
import { Op } from 'sequelize';
import Transaction from '../models/transaction';
import Course from '../models/course';
import DigitalAsset from '../models/digitalasset';
import PhysicalAsset from '../models/physicalasset';

interface YearlyAnalysis {
  totalRevenue: number;
  courses: {
    revenue: number;
    count: number;
    topCourses: { id: string; name: string; revenue: number }[];
  };
  digitalAssets: {
    revenue: number;
    count: number;
    topAssets: { id: string; name: string; revenue: number }[];
  };
  physicalAssets: {
    revenue: number;
    count: number;
    topAssets: { id: string; name: string; revenue: number }[];
  };
  monthlyTrends: {
    month: number;
    coursesRevenue: number;
    digitalRevenue: number;
    physicalRevenue: number;
    totalRevenue: number;
    transactions: number;
  }[];
}

class AnalysisService {
  async getYearlyAnalysis(
    year: number,
    userId?: string
  ): Promise<YearlyAnalysis> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    // Get all successful transactions for the year
    const transactions = await Transaction.findAll({
      where: {
        metadata: { [Op.like]: `%${userId}%` },
        status: 'success',
        createdAt: { [Op.between]: [startDate, endDate] },
      },
    });

    // Initialize results with proper numeric values
    const result: YearlyAnalysis = {
      totalRevenue: 0,
      courses: { revenue: 0, count: 0, topCourses: [] },
      digitalAssets: { revenue: 0, count: 0, topAssets: [] },
      physicalAssets: { revenue: 0, count: 0, topAssets: [] },
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
      const amount = Number(tx.amount); // Ensure we're working with numbers
      const month = tx.createdAt.getMonth();

      // Update monthly trends by product type
      switch (tx.paymentType) {
        case 'course':
          result.monthlyTrends[month].coursesRevenue += amount;
          result.courses.revenue += amount;
          result.courses.count += 1;
          if (tx.productId) {
            const current = courseRevenueMap.get(tx.productId) || 0;
            courseRevenueMap.set(tx.productId, current + amount);
          }
          break;

        case 'digital_asset':
          result.monthlyTrends[month].digitalRevenue += amount;
          result.digitalAssets.revenue += amount;
          result.digitalAssets.count += 1;
          if (tx.productId) {
            const current = digitalAssetRevenueMap.get(tx.productId) || 0;
            digitalAssetRevenueMap.set(tx.productId, current + amount);
          }
          break;

        case 'physical_asset':
          result.monthlyTrends[month].physicalRevenue += amount;
          result.physicalAssets.revenue += amount;
          result.physicalAssets.count += 1;
          if (tx.productId) {
            const current = physicalAssetRevenueMap.get(tx.productId) || 0;
            physicalAssetRevenueMap.set(tx.productId, current + amount);
          }
          break;
      }

      // Update total monthly values
      result.monthlyTrends[month].totalRevenue += amount;
      result.monthlyTrends[month].transactions += 1;
      result.totalRevenue += amount;
    }

    // Get names for top items
    result.courses.topCourses = await this.getTopItems(
      courseRevenueMap,
      Course,
      'title'
    );
    result.digitalAssets.topAssets = await this.getTopItems(
      digitalAssetRevenueMap,
      DigitalAsset,
      'assetName'
    );
    result.physicalAssets.topAssets = await this.getTopItems(
      physicalAssetRevenueMap,
      PhysicalAsset,
      'assetName'
    );

    // Sort and limit top items
    result.courses.topCourses = this.sortAndLimit(
      result.courses.topCourses
    ) as any;
    result.digitalAssets.topAssets = this.sortAndLimit(
      result.digitalAssets.topAssets
    ) as any;
    result.physicalAssets.topAssets = this.sortAndLimit(
      result.physicalAssets.topAssets
    ) as any;

    // Format all numbers to 2 decimal places
    return this.formatNumbers(result);
  }

  async getTopItems(
    revenueMap: Map<string, number>,
    model: any,
    nameField: string
  ): Promise<{ id: string; name: string; revenue: number }[]> {
    if (revenueMap.size === 0) return [];

    const items = await model.findAll({
      where: { id: Array.from(revenueMap.keys()) },
      attributes: ['id', nameField],
    });

    return items.map((item: any) => ({
      id: item.id,
      name: item[nameField] || 'Untitled',
      revenue: revenueMap.get(item.id) || 0,
    }));
  }

  sortAndLimit(items: { revenue: number }[]) {
    return items
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        revenue: parseFloat(item.revenue.toFixed(2)),
      }));
  }

  formatNumbers(result: YearlyAnalysis): YearlyAnalysis {
    return {
      ...result,
      totalRevenue: parseFloat(result.totalRevenue.toFixed(2)),
      courses: {
        ...result.courses,
        revenue: parseFloat(result.courses.revenue.toFixed(2)),
        topCourses: result.courses.topCourses.map((c) => ({
          ...c,
          revenue: parseFloat(c.revenue.toFixed(2)),
        })),
      },
      digitalAssets: {
        ...result.digitalAssets,
        revenue: parseFloat(result.digitalAssets.revenue.toFixed(2)),
        topAssets: result.digitalAssets.topAssets.map((a) => ({
          ...a,
          revenue: parseFloat(a.revenue.toFixed(2)),
        })),
      },
      physicalAssets: {
        ...result.physicalAssets,
        revenue: parseFloat(result.physicalAssets.revenue.toFixed(2)),
        topAssets: result.physicalAssets.topAssets.map((a) => ({
          ...a,
          revenue: parseFloat(a.revenue.toFixed(2)),
        })),
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
}

export default new AnalysisService();
