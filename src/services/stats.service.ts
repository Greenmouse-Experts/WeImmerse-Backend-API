import { Op, Sequelize } from 'sequelize';
import Course from '../models/course';
import CourseEnrollment from '../models/courseenrollment';
import Transaction from '../models/transaction';
import { PaymentStatus, ProductType } from '../models/transaction';

class StatsService {
  /**
   * Get total number of courses
   * @param creatorId - Optional filter by creator
   * @param status - Optional filter by status
   */
  static async getTotalCourses(creatorId?: string, status?: string) {
    const where: any = {};
    if (creatorId) where.creatorId = creatorId;
    if (status) where.status = status;

    return await Course.count({ where });
  }

  /**
   * Get total number of enrollments
   * @param courseId - Optional filter by course
   * @param userId - Optional filter by user
   */
  static async getCreatorTotalEnrollments(
    courseId?: string | null,
    userId?: string
  ) {
    const where: any = {};
    if (courseId) where.courseId = courseId;

    return await CourseEnrollment.count({
      where,
      include: [{ model: Course, where: { creatorId: userId }, as: 'course' }],
    });
  }

  /**
   * Get total number of course transactions
   * @param courseId - Optional filter by course
   * @param userId - Optional filter by user
   * @param status - Optional filter by payment status
   */
  static async getTotalCreatorTransactions(
    courseId?: string | null,
    userId?: string,
    status?: PaymentStatus | null
  ) {
    const where: any = {
      paymentType: ProductType.COURSE,
    };

    if (courseId) where.productId = courseId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    return await Transaction.count({ where });
  }

  /**
   * Get total revenue from course transactions
   * @param courseId - Optional filter by course
   * @param userId - Optional filter by user
   * @param status - Optional filter by payment status
   */
  static async getCourseRevenue(
    courseId?: string | null,
    userId?: string,
    status?: PaymentStatus | null
  ) {
    const where: any = {
      paymentType: ProductType.COURSE,
    };

    if (courseId) where.productId = courseId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

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
   * Get comprehensive course statistics
   */
  static async getCourseStatistics(creatorId?: string) {
    const where: any = {};
    if (creatorId) where.creatorId = creatorId;

    const [totalCourses, totalEnrollments, totalTransactions, totalRevenue] =
      await Promise.all([
        this.getTotalCourses(creatorId),
        this.getCreatorTotalEnrollments(null, creatorId),
        this.getTotalCreatorTransactions(null, creatorId, null),
        this.getCourseRevenue(null, creatorId, null),
      ]);

    return {
      totalCourses,
      totalEnrollments,
      totalTransactions,
      totalRevenue,
    };
  }
}

export default StatsService;
