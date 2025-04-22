// services/student-analytics.service.ts
import { literal, fn, col, Op, Sequelize } from 'sequelize';
import Course from '../models/course';
import CourseEnrollment from '../models/courseenrollment';
import CourseProgress from '../models/courseprogress';
import LessonQuiz from '../models/lessonquiz';
import Notification from '../models/notification'; // Assuming you have a Notification model
import User from '../models/user';
import Transaction, { PaymentStatus, ProductType } from '../models/transaction';
import { YearlyAnalysis } from './analysis.service';
import { parseFormattedAmount } from '../utils/helpers';

interface StudentAnalytics {
  courseStats: {
    ongoing: number;
    all: number;
    completed: number;
  };
  continueCourses: {
    id: string;
    title: string;
    chapter: string;
    tutor: string;
  }[];
  // upcomingAssessments: {
  //   id: string;
  //   title: string;
  //   dueDate?: Date;
  // }[];
  // studyHours: {
  //   study: number;
  //   exams: number;
  // };
  // pointProgress: {
  //   points: number;
  //   message: string;
  //   trend: 'up' | 'down' | 'neutral';
  // };
  notifications: {
    id: string;
    message: string;
    date: string;
    read: boolean;
  }[];
}

interface PurchaseSummary {
  course: number;
  digital_asset: number;
  physical_asset: number;
}

interface MonthlyPurchase {
  month: string; // Format: 'Jan', 'Feb', etc.
  monthNumber: string; // Format: '01', '02', etc.
  purchaseCount: number;
}

interface TopItem {
  id: string;
  name: string;
  revenue: number;
  image?: string;
  assetUpload?: string;
  assetThumbnail?: string;
}

class StudentAnalyticsService {
  async getStudentAnalytics(studentId: string): Promise<StudentAnalytics> {
    // Run all queries in parallel for better performance
    const [courseStats, continueCourses, notifications] = await Promise.all([
      this.getCourseStats(studentId),
      this.getContinueCourses(studentId),
      this.getNotifications(studentId),
    ]);

    return {
      courseStats,
      continueCourses,
      notifications,
    };
  }

  private async getCourseStats(studentId: string) {
    const [all, ongoing, completed] = await Promise.all([
      // All enrolled courses
      CourseEnrollment.count({
        where: { userId: studentId },
      }),
      // Ongoing courses (progress < 100%)
      CourseProgress.count({
        where: { studentId: studentId, progressPercentage: { [Op.lt]: 100 } },
      }),
      // Completed courses (progress = 100%)
      CourseProgress.count({
        where: {
          studentId: studentId,
          progressPercentage: 100,
        },
      }),
    ]);

    return {
      ongoing,
      all,
      completed,
    };
  }

  private async getContinueCourses(studentId: string) {
    const courses = JSON.parse(
      JSON.stringify(
        await CourseEnrollment.findAll({
          include: [
            {
              model: Course,
              as: 'course',

              include: [
                {
                  model: CourseProgress,
                  as: 'progress',
                  attributes: ['completedLessons'],
                },
                {
                  model: User,
                  as: 'creator',
                },
              ],
            },
            {
              model: User,
              as: 'user',
              attributes: ['name'],
            },
          ],
          where: {
            userId: studentId,
            // '$course.$progress.progressPercentage$': { [Op.lt]: 100 },
          },
          order: [['createdAt', 'DESC']],
          // order: [['course.progress.lastAccessed', 'DESC']],
          limit: 3,
        })
      )
    );

    return courses?.map((enrollment: any) => ({
      id: enrollment?.course?.id,
      title: enrollment?.course?.title! || 'Untitled Course',
      chapter: `Chapter ${
        enrollment?.course?.progress?.completedLessons! || 0 + 1
      }`,
      tutor: enrollment?.course?.creator?.name! || 'Unknown Tutor',
      creator_details: enrollment?.course?.creator!,
      ...enrollment?.course,
    }));
    // return [];
  }

  private async getUpcomingAssessments(studentId: string) {
    // Get quizzes from courses the student is enrolled in
    const quizzes = await LessonQuiz.findAll({
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title'],
          include: [
            {
              model: CourseEnrollment,
              as: 'enrollments',
              where: { userId: studentId },
              // attributes: [],
            },
          ],
        },
      ],
      where: {},
      // where: {
      //   dueDate: { [Op.gte]: new Date() },
      // },
      // order: [['dueDate', 'ASC']],
      limit: 5,
    });

    return quizzes.map((quiz: any) => ({
      id: quiz.id,
      title: quiz.course?.title || 'Untitled Course',
      // dueDate: quiz.dueDate,
    }));
  }

  private async getStudyHours(studentId: string) {
    // This would depend on your study tracking implementation
    // Mock data based on screenshot
    return {
      study: 100,
      exams: 75,
    };
  }

  private async getPointProgress(studentId: string): Promise<any> {
    // This would depend on your points system implementation
    // Mock data based on screenshot
    return {
      points: 8.966,
      message: 'You are doing well, Keep it up',
      trend: 'up',
    };
  }

  private async getNotifications(studentId: string) {
    const notifications = await Notification.findAll({
      where: { userId: studentId },
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    return notifications.map((notification: any) => ({
      id: notification.id,
      message: notification.message,
      date: this.formatDate(notification.createdAt),
      read: notification.read,
    }));
  }

  private formatDate(date: Date): string {
    return date
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      })
      .replace(/\//g, '-');
  }

  // private async getMonthlyPurchasesByProductType(userId: string) {
  //   const transactions = await Transaction.findAll({
  //     attributes: [
  //       [
  //         Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')),
  //         'month',
  //       ],
  //       'paymentType',
  //       [Sequelize.fn('COUNT', Sequelize.col('id')), 'purchaseCount'],
  //     ],
  //     where: {
  //       userId,
  //       paymentType: {
  //         [Op.in]: [
  //           ProductType.COURSE,
  //           ProductType.DIGITAL_ASSET,
  //           ProductType.PHYSICAL_ASSET,
  //         ],
  //       },
  //       status: PaymentStatus.COMPLETED,
  //     },
  //     group: ['month', 'paymentType'],
  //     order: [['month', 'ASC']],
  //     raw: true,
  //   });

  //   return transactions;
  // }

  // private async getMonthlyPurchasesByProductType(userId: string) {
  //   const transactions = await Transaction.findAll({
  //     attributes: [
  //       [
  //         Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'),
  //         'month',
  //       ],
  //       'paymentType',
  //       [Sequelize.fn('COUNT', Sequelize.col('id')), 'purchaseCount'],
  //     ],
  //     where: {
  //       userId,
  //       paymentType: {
  //         [Op.in]: [
  //           ProductType.COURSE,
  //           ProductType.DIGITAL_ASSET,
  //           ProductType.PHYSICAL_ASSET,
  //         ],
  //       },
  //       status: PaymentStatus.COMPLETED,
  //     },
  //     group: [
  //       Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'),
  //       'paymentType',
  //     ],
  //     order: [
  //       [
  //         Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'),
  //         'ASC',
  //       ],
  //     ],
  //     raw: true,
  //   });

  //   return transactions;
  // }

  // private async getMonthlyPurchasesByProductType(
  //   userId: string,
  //   year: number = new Date().getFullYear()
  // ): Promise<{ [productType: string]: MonthlyPurchase[] }> {
  //   // Month names in order
  //   const monthNames = [
  //     'Jan',
  //     'Feb',
  //     'Mar',
  //     'Apr',
  //     'May',
  //     'Jun',
  //     'Jul',
  //     'Aug',
  //     'Sep',
  //     'Oct',
  //     'Nov',
  //     'Dec',
  //   ];

  //   // 1. Get the actual data from database
  //   const dbResults = await Transaction.findAll({
  //     attributes: [
  //       [fn('DATE_FORMAT', col('createdAt'), '%m'), 'monthNumber'], // Get month as '01', '02', etc.
  //       'paymentType',
  //       [fn('COUNT', col('id')), 'purchaseCount'],
  //     ],
  //     where: {
  //       userId,
  //       paymentType: {
  //         [Op.in]: [
  //           ProductType.COURSE,
  //           ProductType.DIGITAL_ASSET,
  //           ProductType.PHYSICAL_ASSET,
  //         ],
  //       },
  //       status: PaymentStatus.COMPLETED,
  //       createdAt: {
  //         [Op.between]: [
  //           new Date(`${year}-01-01`),
  //           new Date(`${year}-12-31 23:59:59`),
  //         ],
  //       },
  //     },
  //     group: ['paymentType', literal('DATE_FORMAT(createdAt, "%m")')],
  //     order: [
  //       ['paymentType', 'ASC'],
  //       [literal('monthNumber'), 'ASC'],
  //     ],
  //     raw: true,
  //   });

  //   // 2. Create complete month structure
  //   const allMonths = monthNames.map((month, index) => ({
  //     month,
  //     monthNumber: (index + 1).toString().padStart(2, '0'),
  //     purchaseCount: 0,
  //   }));

  //   // 3. Initialize result structure
  //   const result: { [key: string]: MonthlyPurchase[] } = {
  //     [ProductType.COURSE]: JSON.parse(JSON.stringify(allMonths)),
  //     [ProductType.DIGITAL_ASSET]: JSON.parse(JSON.stringify(allMonths)),
  //     [ProductType.PHYSICAL_ASSET]: JSON.parse(JSON.stringify(allMonths)),
  //   };

  //   // 4. Merge database results
  //   dbResults.forEach((row) => {
  //     const productType = row.paymentType as keyof typeof result;
  //     const monthIndex = parseInt(row.monthNumber, 10) - 1;

  //     if (monthIndex >= 0 && monthIndex < 12 && result[productType]) {
  //       result[productType][monthIndex].purchaseCount = parseInt(
  //         row.purchaseCount,
  //         10
  //       );
  //     }
  //   });

  //   return result;
  // }
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

  private async getLatestTransactions(userId: string) {
    const transactions = await Transaction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    return transactions;
  }

  private async getTotalPurchasesByProductType(
    userId: string
  ): Promise<PurchaseSummary> {
    const results = (await Transaction.findAll({
      attributes: ['paymentType', [fn('COUNT', col('id')), 'total']],
      where: {
        userId,
        status: PaymentStatus.COMPLETED,
        paymentType: {
          [Op.in]: [
            ProductType.COURSE,
            ProductType.DIGITAL_ASSET,
            ProductType.PHYSICAL_ASSET,
          ],
        },
      },
      group: ['paymentType'],
      raw: true,
    })) as any;

    // Initialize summary with all possible product types
    const summary: PurchaseSummary = {
      course: 0,
      digital_asset: 0,
      physical_asset: 0,
    };

    // Type the row parameter properly
    results.forEach(
      (row: { paymentType: keyof PurchaseSummary; total: string }) => {
        summary[row.paymentType] = parseInt(row.total, 10);
      }
    );

    return summary;
  }

  async compiledForUser(userId: string) {
    const [
      ongoingCourses,
      latestCourses,
      monthlyPurchases,
      latestTrx,
      totalPurchasesByType,
    ] = await Promise.all([
      await this.getContinueCourses(userId),
      await this.getNotifications(userId),
      await this.getMonthlyPurchasesByProductType(userId),
      await this.getLatestTransactions(userId),
      await this.getTotalPurchasesByProductType(userId),
    ]);

    return {
      ongoingCourses,
      latestCourses,
      monthlyPurchases,
      latestTrx,
      totalPurchasesByType,
    };
  }
}

export default new StudentAnalyticsService();
