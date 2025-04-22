import { Request, Response } from 'express';
import StatsService from '../services/stats.service';
import AdminStatsService from '../services/admin-stats.service';
import logger from '../middlewares/logger';
import { PaymentStatus } from '../models/transaction';
import UserStatsService from '../services/user-stats.service';

export const getCreatorStatistics = async (req: Request, res: Response) => {
  try {
    const creatorId = (req.user as any)?.id; // Assuming authenticated user is the creator
    const stats = await StatsService.getCourseStatistics(creatorId);

    res.status(200).json({
      status: true,
      message: 'Course statistics retrieved successfully',
      data: stats,
    });
  } catch (error: any) {
    logger.error('Error fetching course statistics:', error);
    res.status(500).json({
      status: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const year = req.query.year
      ? parseInt(req.query.year as string)
      : new Date().getFullYear();
    const stats = await AdminStatsService.getAdminStats(year);
    res.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
};

export const getUserStatistics = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;

    const stats = await UserStatsService.getStatistics(userId);
    res.json(stats);
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
};

// export const getCourseEnrollments = async (req: Request, res: Response) => {
//   try {
//     const { courseId } = req.params;
//     const totalEnrollments = await CourseStatsService.getTotalEnrollments(
//       courseId
//     );

//     res.status(200).json({
//       status: true,
//       message: 'Course enrollments retrieved successfully',
//       data: { totalEnrollments },
//     });
//   } catch (error: any) {
//     logger.error('Error fetching course enrollments:', error);
//     res.status(500).json({
//       status: false,
//       message: error.message || 'Internal server error',
//     });
//   }
// };

// export const getCourseTransactions = async (req: Request, res: Response) => {
//   try {
//     const { courseId } = req.params;
//     const { status } = req.query;

//     const totalTransactions =
//       await CourseStatsService.getTotalCourseTransactions(
//         courseId,
//         undefined,
//         status as PaymentStatus
//       );

//     res.status(200).json({
//       status: true,
//       message: 'Course transactions retrieved successfully',
//       data: { totalTransactions },
//     });
//   } catch (error: any) {
//     logger.error('Error fetching course transactions:', error);
//     res.status(500).json({
//       status: false,
//       message: error.message || 'Internal server error',
//     });
//   }
// };
