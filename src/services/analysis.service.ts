// services/analysis.service.ts
import { Op } from 'sequelize';
import Transaction from '../models/transaction';
import Course from '../models/course';
import DigitalAsset from '../models/digitalasset';
import PhysicalAsset from '../models/physicalasset';
import Subscription from '../models/subscription';
import SubscriptionPlan from '../models/subscriptionplan';

export interface YearlyAnalysis {
  totalRevenue: number;
  courses: ProductAnalysis;
  digitalAssets: ProductAnalysis;
  physicalAssets: ProductAnalysis;
  monthlyTrends: MonthlyTrend[];
}

interface ProductAnalysis {
  revenue: number;
  count: number;
  topItems: TopItem[];
}

interface TopItem {
  id: string;
  name: string;
  revenue: number;
  image?: string;
  assetUpload?: string;
  assetThumbnail?: string;
}

interface MonthlyTrend {
  month: number;
  coursesRevenue: number;
  digitalRevenue: number;
  physicalRevenue: number;
  totalRevenue: number;
  transactions: number;
}

class AnalysisService {
  async getYearlyAnalysis(
    year: number,
    userId?: string
  ): Promise<YearlyAnalysis> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    // Build the where clause conditionally
    const where: any = {
      status: 'success',
      createdAt: { [Op.between]: [startDate, endDate] },
    };

    if (userId) {
      where.metadata = { [Op.like]: `%${userId}%` };
    }

    // Get all successful transactions for the year
    const transactions = await Transaction.findAll({
      where,
      include: [
        {
          model: Subscription,
          as: 'subscription',
          required: false,
          include: [{ model: SubscriptionPlan, as: 'plan' }],
        },
      ],
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
    const subscriptionRevenueMap = new Map<string, number>();

    // Process each transaction with proper number handling
    for (const tx of transactions) {
      const amount = Number(tx.amount);
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

    // Get names and additional fields for top items
    result.courses.topItems = await this.getTopItems(courseRevenueMap, Course, [
      'title',
      'image',
    ]);
    result.digitalAssets.topItems = await this.getTopItems(
      digitalAssetRevenueMap,
      DigitalAsset,
      ['assetName', 'assetUpload', 'assetThumbnail']
    );
    result.physicalAssets.topItems = await this.getTopItems(
      physicalAssetRevenueMap,
      PhysicalAsset,
      ['assetName', 'assetUpload', 'assetThumbnail']
    );

    // Format all numbers
    return this.formatResults(result);
  }

  private async getTopItems(
    revenueMap: Map<string, number>,
    model: any,
    fields: string[]
  ): Promise<TopItem[]> {
    if (revenueMap.size === 0) return [];

    const items = await model.findAll({
      where: { id: Array.from(revenueMap.keys()) },
      attributes: ['id', ...fields],
    });

    return items.map((item: any) => ({
      id: item.id,
      name: item[fields[0]] || 'Untitled',
      revenue: revenueMap.get(item.id) || 0,
      ...(fields.includes('image') && { image: item.image }),
      ...(fields.includes('assetUpload') && { assetUpload: item.assetUpload }),
      ...(fields.includes('assetThumbnail') && {
        assetThumbnail: item.assetThumbnail,
      }),
    }));
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
}

export default new AnalysisService();
