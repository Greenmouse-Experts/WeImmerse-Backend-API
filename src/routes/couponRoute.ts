// routes/couponRoutes.ts
import express from 'express';
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  getCouponUsageStats,
  getUserCouponHistory,
  updateCoupon,
  validateCoupon,
} from '../controllers/couponController';
import {
  createCouponValidationRules,
  applyCouponValidationRules,
} from '../utils/validations';
import authMiddleware from '../middlewares/authMiddleware';
import authorizeCreatorOrInstitution from '../middlewares/authorizeCreatorOrInstitution';

const router = express.Router();

// Admin routes
router.post(
  '/',
  authMiddleware,
  authorizeCreatorOrInstitution,
  createCouponValidationRules(),
  createCoupon
);
router.get('/', authMiddleware, authorizeCreatorOrInstitution, getAllCoupons);
router.get(
  '/:id',
  authMiddleware,
  authorizeCreatorOrInstitution,
  getCouponById
);
router.put(
  '/:id',
  authMiddleware,
  authorizeCreatorOrInstitution,
  createCouponValidationRules(),
  updateCoupon
);
router.delete(
  '/:id',
  authMiddleware,
  authorizeCreatorOrInstitution,
  deleteCoupon
);
router.get(
  '/:couponId/stats',
  authMiddleware,
  authorizeCreatorOrInstitution,
  getCouponUsageStats
);

// User routes
router.post(
  '/validate',
  authMiddleware,
  applyCouponValidationRules(),
  validateCoupon
);
router.post(
  '/apply',
  authMiddleware,
  applyCouponValidationRules(),
  applyCoupon
);
router.get('/user/:userId/history', authMiddleware, getUserCouponHistory);

export default router;
