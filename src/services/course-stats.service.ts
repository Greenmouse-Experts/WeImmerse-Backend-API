import { Op, Sequelize } from 'sequelize';
import Course from '../models/course';
import CourseEnrollment from '../models/courseenrollment';
import Transaction from '../models/transaction';
import { PaymentStatus, ProductType } from '../models/transaction';

class CourseStatsService {
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
  static async getTotalEnrollments(courseId?: string, userId?: string) {
    const where: any = {};
    if (courseId) where.courseId = courseId;
    if (userId) where.userId = userId;

    return await CourseEnrollment.count({ where });
  }

  /**
   * Get total number of course transactions
   * @param courseId - Optional filter by course
   * @param userId - Optional filter by user
   * @param status - Optional filter by payment status
   */
  static async getTotalCourseTransactions(
    courseId?: string,
    userId?: string,
    status?: PaymentStatus
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
    courseId?: string,
    userId?: string,
    status?: PaymentStatus
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
        this.getTotalEnrollments(),
        this.getTotalCourseTransactions(),
        this.getCourseRevenue(),
      ]);

    return {
      totalCourses,
      totalEnrollments,
      totalTransactions,
      totalRevenue,
    };
  }
}

export default CourseStatsService;
