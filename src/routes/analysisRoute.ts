// routes/purchaseAnalysis.routes.ts
import express from 'express';
import {
  getAdminYearlyAnalysis,
  getInstitutionAnalytics,
  getRecentSignups,
  getStudentAnalysis,
  getUserAnalysis,
  getUsersByCountry,
  getUserStats,
  getYearlyAnalysis,
} from '../controllers/analysisController';
import { Sequelize } from 'sequelize'; // Assuming you have a database connection setup
import authMiddleware from '../middlewares/authMiddleware';
import authorizeCreatorOrInstitution from '../middlewares/authorizeCreatorOrInstitution';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';
import authorizeInstitution from '../middlewares/authorizeInstitution';

const router = express.Router();

// Get yearly analysis for all creators
router.get(
  '/creator/yearly/landing',
  authMiddleware,
  authorizeCreatorOrInstitution,
  getYearlyAnalysis
);

// Get yearly analysis for all creators
router.get(
  '/admin/yearly/landing',
  adminAuthMiddleware,
  getAdminYearlyAnalysis
);

// Get yearly analysis for all creators
router.get('/admin/recent-signups', adminAuthMiddleware, getRecentSignups);

// Get user stats
router.get('/admin/user-stats', adminAuthMiddleware, getUserStats);

// Get users by country
router.get('/admin/users-by-country', adminAuthMiddleware, getUsersByCountry);

// Get student analysis (for regular users)
router.get('/student/yearly', authMiddleware, getStudentAnalysis);

router.get('/user/landing', authMiddleware, getUserAnalysis);

router.get(
  '/institution/landing',
  authMiddleware,
  authorizeInstitution,
  getInstitutionAnalytics
);
// Get analysis for a specific creator
// router.get('/creator/:creatorId', authMiddleware, getCreatorAnalysis);

export default router;
