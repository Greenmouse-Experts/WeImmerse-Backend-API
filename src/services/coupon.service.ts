// services/couponService.ts
import { Op } from 'sequelize';
import Coupon from '../models/coupon';
import CouponUsage from '../models/couponusage';
import User, { UserType } from '../models/user';

class CouponService {
  /**
   * Create a new coupon
   */
  async createCoupon(couponData: any): Promise<Coupon> {
    const { code } = couponData;
    // Check coupon code
    const coupon = await Coupon.findOne({ where: { code } });
    if (coupon) {
      throw new Error('Coupon code exists.');
    }

    return await Coupon.create(couponData);
  }

  /**
   * Get all coupons
   */
  async getAllCoupons(userId?: string): Promise<Coupon[]> {
    const where = userId ? { creatorId: userId } : {};
    return await Coupon.findAll({ where });
  }

  /**
   * Get coupon by ID
   */
  async getCouponById(id: string, userId?: string): Promise<Coupon | null> {
    const where = {
      id,
      ...(userId && { creatorId: userId }),
    };
    return await Coupon.findOne({ where });
  }

  /**
   * Get coupon by code
   */
  async getCouponByCode(code: string): Promise<Coupon | null> {
    return await Coupon.findOne({ where: { code } });
  }

  /**
   * Update coupon
   */
  async updateCoupon(
    id: string,
    updateData: any,
    userId?: string
  ): Promise<[number, Coupon[]]> {
    return await Coupon.update(updateData, {
      where: { id, ...(userId && { creatorId: userId }) },
      returning: true,
    });
  }

  /**
   * Delete coupon
   */
  async deleteCoupon(id: string, userId?: string): Promise<number> {
    // Check if coupon is used.
    const couponUsed = await CouponUsage.findOne({ where: { couponId: id } });
    if (couponUsed) {
      throw new Error('Coupon used cannot be deleted.');
    }

    return await Coupon.destroy({
      where: { id, ...(userId && { creatorId: userId }) },
    });
  }

  /**
   * Validate and apply coupon
   */
  async validateAndApplyCoupon(
    couponCode: string,
    userId: string,
    courseId: string | null,
    purchaseAmount: number
  ): Promise<{
    valid: boolean;
    discountAmount?: number;
    message?: string;
    coupon?: Coupon;
  }> {
    const coupon = await this.getCouponByCode(couponCode);
    if (!coupon) {
      return { valid: false, message: 'Coupon not found' };
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return { valid: false, message: 'Coupon is not active' };
    }

    // Check validity period
    const now = new Date();
    if (now < new Date(coupon.validFrom) || now > new Date(coupon.validUntil)) {
      return { valid: false, message: 'Coupon is not valid at this time' };
    }

    // Check max uses
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return {
        valid: false,
        message: 'Coupon has reached its maximum usage limit',
      };
    }

    // Check minimum purchase amount
    if (coupon.minPurchaseAmount && purchaseAmount < coupon.minPurchaseAmount) {
      return {
        valid: false,
        message: `Minimum purchase amount of ${coupon.minPurchaseAmount} required`,
      };
    }

    // Check if coupon is applicable to the course
    if (
      courseId &&
      coupon.applicableCourses &&
      !coupon.applicableCourses.includes(courseId)
    ) {
      return {
        valid: false,
        message: 'Coupon is not applicable to this course',
      };
    }

    // Check if user has already used this coupon
    const user = await User.findByPk(userId);
    if (!user) {
      return { valid: false, message: 'User not found' };
    }

    // Check account type restrictions
    if (
      coupon.applicableAccountTypes &&
      !coupon.applicableAccountTypes.includes(user.accountType as UserType)
    ) {
      return {
        valid: false,
        message: 'Coupon is not applicable to your account type',
      };
    }

    // Check if user has already used this coupon
    const existingUsage = await CouponUsage.findOne({
      where: {
        couponId: coupon.id,
        userId: user.id,
      },
    });

    if (existingUsage) {
      return { valid: false, message: 'You have already used this coupon' };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = purchaseAmount * (coupon.discountValue / 100);
    } else {
      discountAmount = Math.min(coupon.discountValue, purchaseAmount);
    }

    return {
      valid: true,
      discountAmount,
      coupon,
    };
  }

  /**
   * Apply coupon and record usage
   */
  async applyCoupon(
    couponCode: string,
    userId: string,
    courseId: string | null,
    purchaseAmount: number,
    orderId?: string
  ): Promise<{ success: boolean; discountAmount?: number; message?: string }> {
    const validation = await this.validateAndApplyCoupon(
      couponCode,
      userId,
      courseId,
      purchaseAmount
    );

    if (!validation.valid || !validation.coupon) {
      return {
        success: false,
        message: validation.message || 'Invalid coupon',
      };
    }

    const { coupon, discountAmount } = validation;

    // Start transaction to ensure data consistency
    const transaction = await Coupon.sequelize?.transaction();

    try {
      // Record coupon usage
      await CouponUsage.create(
        {
          couponId: coupon.id,
          userId,
          orderId,
          discountApplied: discountAmount,
        },
        { transaction }
      );

      // Increment coupon usage count
      await Coupon.update(
        {
          currentUses: coupon.currentUses + 1,
        },
        {
          where: { id: coupon.id },
          transaction,
        }
      );

      await transaction?.commit();

      return {
        success: true,
        discountAmount,
      };
    } catch (error) {
      await transaction?.rollback();
      console.error('Error applying coupon:', error);
      return {
        success: false,
        message: 'Failed to apply coupon',
      };
    }
  }

  /**
   * Get coupon usage history for a user
   */
  async getUserCouponHistory(userId: string): Promise<CouponUsage[]> {
    return await CouponUsage.findAll({
      where: { userId },
      include: [
        {
          association: 'coupon',
          attributes: ['code', 'discountType', 'discountValue'],
        },
      ],
    });
  }

  /**
   * Get coupon usage statistics
   */
  async getCouponUsageStats(
    couponId: string
  ): Promise<{ totalUses: number; recentUses: CouponUsage[] }> {
    const coupon = await Coupon.findByPk(couponId);
    if (!coupon) {
      throw new Error('Coupon not found');
    }

    const recentUses = await CouponUsage.findAll({
      where: { couponId },
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return {
      totalUses: coupon.currentUses,
      recentUses,
    };
  }
}

export default new CouponService();
