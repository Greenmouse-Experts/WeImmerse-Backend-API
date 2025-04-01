"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coupon_1 = __importDefault(require("../models/coupon"));
const couponusage_1 = __importDefault(require("../models/couponusage"));
const user_1 = __importDefault(require("../models/user"));
class CouponService {
    /**
     * Create a new coupon
     */
    createCoupon(couponData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = couponData;
            // Check coupon code
            const coupon = yield coupon_1.default.findOne({ where: { code } });
            if (coupon) {
                throw new Error('Coupon code exists.');
            }
            return yield coupon_1.default.create(couponData);
        });
    }
    /**
     * Get all coupons
     */
    getAllCoupons(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = userId ? { creatorId: userId } : {};
            return yield coupon_1.default.findAll({ where });
        });
    }
    /**
     * Get coupon by ID
     */
    getCouponById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = Object.assign({ id }, (userId && { creatorId: userId }));
            return yield coupon_1.default.findOne({ where });
        });
    }
    /**
     * Get coupon by code
     */
    getCouponByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield coupon_1.default.findOne({ where: { code } });
        });
    }
    /**
     * Update coupon
     */
    updateCoupon(id, updateData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield coupon_1.default.update(updateData, {
                where: Object.assign({ id }, (userId && { creatorId: userId })),
                returning: true,
            });
        });
    }
    /**
     * Delete coupon
     */
    deleteCoupon(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if coupon is used.
            const couponUsed = yield couponusage_1.default.findOne({ where: { couponId: id } });
            if (couponUsed) {
                throw new Error('Coupon used cannot be deleted.');
            }
            return yield coupon_1.default.destroy({
                where: Object.assign({ id }, (userId && { creatorId: userId })),
            });
        });
    }
    /**
     * Validate and apply coupon
     */
    validateAndApplyCoupon(couponCode, userId, courseId, purchaseAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield this.getCouponByCode(couponCode);
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
            if (courseId &&
                coupon.applicableCourses &&
                !coupon.applicableCourses.includes(courseId)) {
                return {
                    valid: false,
                    message: 'Coupon is not applicable to this course',
                };
            }
            // Check if user has already used this coupon
            const user = yield user_1.default.findByPk(userId);
            if (!user) {
                return { valid: false, message: 'User not found' };
            }
            // Check account type restrictions
            if (coupon.applicableAccountTypes &&
                !coupon.applicableAccountTypes.includes(user.accountType)) {
                return {
                    valid: false,
                    message: 'Coupon is not applicable to your account type',
                };
            }
            // Check if user has already used this coupon
            const existingUsage = yield couponusage_1.default.findOne({
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
            }
            else {
                discountAmount = Math.min(coupon.discountValue, purchaseAmount);
            }
            return {
                valid: true,
                discountAmount,
                coupon,
            };
        });
    }
    /**
     * Apply coupon and record usage
     */
    applyCoupon(couponCode, userId, courseId, purchaseAmount, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const validation = yield this.validateAndApplyCoupon(couponCode, userId, courseId, purchaseAmount);
            if (!validation.valid || !validation.coupon) {
                return {
                    success: false,
                    message: validation.message || 'Invalid coupon',
                };
            }
            const { coupon, discountAmount } = validation;
            // Start transaction to ensure data consistency
            const transaction = yield ((_a = coupon_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.transaction());
            try {
                // Record coupon usage
                yield couponusage_1.default.create({
                    couponId: coupon.id,
                    userId,
                    orderId,
                    discountApplied: discountAmount,
                }, { transaction });
                // Increment coupon usage count
                yield coupon_1.default.update({
                    currentUses: coupon.currentUses + 1,
                }, {
                    where: { id: coupon.id },
                    transaction,
                });
                yield (transaction === null || transaction === void 0 ? void 0 : transaction.commit());
                return {
                    success: true,
                    discountAmount,
                };
            }
            catch (error) {
                yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
                console.error('Error applying coupon:', error);
                return {
                    success: false,
                    message: 'Failed to apply coupon',
                };
            }
        });
    }
    /**
     * Get coupon usage history for a user
     */
    getUserCouponHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield couponusage_1.default.findAll({
                where: { userId },
                include: [
                    {
                        association: 'coupon',
                        attributes: ['code', 'discountType', 'discountValue'],
                    },
                ],
            });
        });
    }
    /**
     * Get coupon usage statistics
     */
    getCouponUsageStats(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield coupon_1.default.findByPk(couponId);
            if (!coupon) {
                throw new Error('Coupon not found');
            }
            const recentUses = yield couponusage_1.default.findAll({
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
        });
    }
}
exports.default = new CouponService();
//# sourceMappingURL=coupon.service.js.map