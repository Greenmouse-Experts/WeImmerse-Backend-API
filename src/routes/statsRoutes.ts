import { Router } from 'express';
import * as courseStatsController from '../controllers/courseStatsController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get(
  '/creator/landing',
  authMiddleware,
  courseStatsController.getCourseStatistics
);

// router.get(
//   '/courses/:courseId/enrollments',
//   authMiddleware,
//   courseStatsController.getCourseEnrollments
// );

// router.get(
//   '/courses/:courseId/transactions',
//   authMiddleware,
//   courseStatsController.getCourseTransactions
// );

export default router;
