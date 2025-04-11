import { Request, Response } from 'express';
import CourseStatsService from '../services/course-stats.service';
import logger from '../middlewares/logger';
import { PaymentStatus } from '../models/transaction';

export const getCourseStatistics = async (req: Request, res: Response) => {
  try {
    const creatorId = (req.user as any)?.id; // Assuming authenticated user is the creator
    const stats = await CourseStatsService.getCourseStatistics(creatorId);

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
