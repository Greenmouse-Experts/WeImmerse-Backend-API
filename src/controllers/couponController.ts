// controllers/couponController.ts
import { Request, Response } from 'express';
import couponService from '../services/coupon.service';
import {
  createCouponValidationRules,
  applyCouponValidationRules,
} from '../utils/validations';
import { validationResult } from 'express-validator';
import User from '../models/user';

/**
 * Create a new coupon
 */
export const createCoupon = async (
  req: Request,
  res: Response
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.user as User;

    req.body.creatorId = id;
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully.',
      data: coupon,
    });
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to create coupon',
    });
  }
};

/**
 * Get all coupons
 */
export const getAllCoupons = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.user as User;
    const coupons = await couponService.getAllCoupons(id);
    res.json({
      success: true,
      message: 'Coupons fetched successfully',
      data: coupons,
    });
  } catch (error: any) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch coupons',
    });
  }
};

/**
 * Get coupon by ID
 */
export const getCouponById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.user as User;
    const coupon = await couponService.getCouponById(req.params.id, id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }
    res.json({
      success: true,
      data: coupon,
    });
  } catch (error: any) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch coupon',
    });
  }
};

/**
 * Update coupon
 */
export const updateCoupon = async (
  req: Request,
  res: Response
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.user as User;
    const [affectedCount, updatedCoupons] = await couponService.updateCoupon(
      req.params.id,
      req.body,
      id
    );

    if (affectedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    res.json({
      success: true,
      message: 'Coupon updated successfully.',
      data: updatedCoupons[0],
    });
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to update coupon',
    });
  }
};

/**
 * Delete coupon
 */
export const deleteCoupon = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.user as User;
    const affectedCount = await couponService.deleteCoupon(req.params.id, id);
    if (affectedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }
    res.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to delete coupon',
    });
  }
};

/**
 * Validate coupon
 */
export const validateCoupon = async (
  req: Request,
  res: Response
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { couponCode, userId, courseId, purchaseAmount } = req.body;
    const validation = await couponService.validateAndApplyCoupon(
      couponCode,
      userId,
      courseId,
      purchaseAmount
    );

    if (!validation.valid) {
      return res.status(422).json({
        success: false,
        message: validation.message,
      });
    }

    res.json({
      success: true,
      message: 'Coupon validated successfully.',
      discountAmount: validation.discountAmount,
    });
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to validate coupon',
    });
  }
};

/**
 * Apply coupon
 */
export const applyCoupon = async (
  req: Request,
  res: Response
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { couponCode, userId, courseId, purchaseAmount, orderId } = req.body;
    const result = await couponService.applyCoupon(
      couponCode,
      userId,
      courseId,
      purchaseAmount,
      orderId
    );

    if (!result.success) {
      return res.status(422).json({
        success: false,
        message: result.message,
      });
    }

    res.json({
      success: true,
      message: 'Coupon applied successfully.',
      discountAmount: result.discountAmount,
    });
  } catch (error: any) {
    console.error('Error applying coupon:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to apply coupon',
    });
  }
};

/**
 * Get user's coupon history
 */
export const getUserCouponHistory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const history = await couponService.getUserCouponHistory(req.params.userId);
    res.json({
      success: true,
      message: 'Coupon history fetched successfully.',
      data: history,
    });
  } catch (error: any) {
    console.error('Error fetching coupon history:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch coupon history',
    });
  }
};

/**
 * Get coupon usage statistics
 */
export const getCouponUsageStats = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const stats = await couponService.getCouponUsageStats(req.params.couponId);
    res.json({
      success: true,
      message: 'Coupon usage stats fetched successfully.',
      data: stats,
    });
  } catch (error: any) {
    console.error('Error fetching coupon stats:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch coupon stats',
    });
  }
};
