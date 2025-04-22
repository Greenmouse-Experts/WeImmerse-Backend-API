import { Op, Sequelize } from 'sequelize';
import Course, { CourseStatus } from '../models/course';
import CourseEnrollment from '../models/courseenrollment';
import Transaction, { PaymentType } from '../models/transaction';
import { PaymentStatus, ProductType } from '../models/transaction';

class UserStatsService {
  /**
   * Get total number of courses with filtering options
   * @param creatorId - Optional filter by creator
   * @param status - Optional filter by status
   */
  static async getTotalCourses(
    creatorId?: string | null,
    status?: CourseStatus
  ) {
    const where: any = {};
    if (creatorId) where.creatorId = creatorId;
    if (status) where.status = status;

    return await Course.count({ where });
  }

  /**
   * Get all courses with optional filtering
   * @param creatorId - Optional filter by creator
   * @param status - Optional filter by status
   * @param limit - Optional limit for pagination
   * @param offset - Optional offset for pagination
   */
  static async getAllCourses(
    creatorId?: string,
    status?: CourseStatus,
    limit?: number,
    offset?: number
  ) {
    const where: any = {};
    if (creatorId) where.creatorId = creatorId;
    if (status) where.status = status;

    const options: any = { where };
    if (limit) options.limit = limit;
    if (offset) options.offset = offset;

    return await Course.findAll(options);
  }

  /**
   * Get ongoing (live) courses
   * @param creatorId - Optional filter by creator
   * @param limit - Optional limit for pagination
   * @param offset - Optional offset for pagination
   */
  static async getOngoingCourses(
    userId?: string | null,
    limit?: number,
    offset?: number
  ) {
    const where: any = {};
    if (userId) where.userId = userId;

    const options: any = { where };
    if (limit) options.limit = limit;
    if (offset) options.offset = offset;

    return await CourseEnrollment.findAll(options);
  }

  /**
   * Get total number of enrollments
   * @param courseId - Optional filter by course
   * @param userId - Optional filter by user
   */
  static async getTotalEnrollments(courseId?: string | null, userId?: string) {
    const where: any = {};
    if (courseId) where.courseId = courseId;
    if (userId) where.userId = userId;

    return await CourseEnrollment.count({ where });
  }

  /**
   * Get creator-specific total enrollments
   * @param courseId - Optional filter by course
   * @param userId - Creator ID to filter by
   */
  static async getCreatorTotalEnrollments(
    courseId?: string | null,
    userId?: string
  ) {
    const where: any = {};
    if (userId) where.userId = userId;

    return await CourseEnrollment.count({
      where,
    });
  }

  /**
   * Get total asset transactions with filtering options
   * @param userId - Optional filter by user
   * @param status - Optional filter by payment status
   */
  static async getAssetTransactions(userId?: string, status?: PaymentStatus) {
    const where: any = {
      [Op.or]: [
        { paymentType: PaymentType.DIGITAL_ASSET },
        { paymentType: PaymentType.PHYSICAL_ASSET },
      ],
      userId,
      status,
    };

    return await Transaction.count({ where });
  }

  /**
   * Get total revenue with filtering options
   * @param productId - Optional filter by product
   * @param userId - Optional filter by user
   * @param status - Optional filter by payment status
   * @param paymentType - Optional filter by payment type
   */
  static async getTotalRevenue(
    productId?: string | null,
    userId?: string,
    status?: PaymentStatus,
    paymentType?: ProductType
  ) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (paymentType) where.paymentType = paymentType;

    const result = (await Transaction.findOne({
      where,
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalRevenue'],
      ],
      raw: true,
    })) as any;

    return parseFloat(result?.totalRevenue || '0');
  }

  /**
   * Get total spend by a user
   * @param userId - User ID to filter by
   * @param status - Optional filter by payment status (defaults to completed)
   */
  static async getTotalSpend(
    userId: string,
    status: PaymentStatus = PaymentStatus.COMPLETED
  ) {
    const where: any = {
      userId,
      status,
    };

    const result = (await Transaction.findOne({
      where,
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalSpend'],
      ],
      raw: true,
    })) as any;

    return parseFloat(result?.totalSpend || '0');
  }

  /**
   * Get purchased assets by a user
   * @param userId - User ID to filter by
   * @param status - Optional filter by payment status (defaults to completed)
   * @param limit - Optional limit for pagination
   * @param offset - Optional offset for pagination
   */
  static async getPurchasedAssets(
    userId: string,
    status: PaymentStatus = PaymentStatus.COMPLETED,
    limit?: number,
    offset?: number
  ) {
    const where: any = {
      userId,
      status,
      paymentType: {
        [Op.in]: [
          ProductType.DIGITAL_ASSET,
          ProductType.PHYSICAL_ASSET,
          ProductType.COURSE,
        ],
      },
    };

    const options: any = { where };
    if (limit) options.limit = limit;
    if (offset) options.offset = offset;

    return await Transaction.findAll(options);
  }

  /**
   * Get statistics for a user
   */
  static async getStatistics(userId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;

    const [totalCourses, ongoingCourses, totalTransactions, totalSpends] =
      await Promise.all([
        this.getTotalCourses(null, CourseStatus.LIVE),
        this.getOngoingCourses(userId),
        this.getAssetTransactions(userId, PaymentStatus.COMPLETED),
        this.getTotalSpend(userId!, PaymentStatus.COMPLETED),
      ]);

    return {
      totalCourses,
      ongoingCourses: ongoingCourses.length,
      totalTransactions,
      totalSpends,
    };
  }

  /**
   * Get comprehensive user statistics
   */
  static async getUserStatistics(userId: string) {
    const [purchasedAssets, totalSpend, enrolledCourses] = await Promise.all([
      this.getPurchasedAssets(userId),
      this.getTotalSpend(userId),
      this.getTotalEnrollments(null, userId),
    ]);

    return {
      purchasedAssets: purchasedAssets.length,
      totalSpend,
      enrolledCourses,
    };
  }

  // Helper methods for backward compatibility
  static async getTotalCreatorTransactions(userId?: string) {
    // return this.getTotalTransactions(userId, PaymentStatus.COMPLETED);
  }

  static async getCourseRevenue(
    courseId?: string | null,
    userId?: string,
    status?: PaymentStatus | null
  ) {
    return this.getTotalRevenue(
      courseId,
      userId,
      status || undefined,
      ProductType.COURSE
    );
  }
}

export default UserStatsService;
