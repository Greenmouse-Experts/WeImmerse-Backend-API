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
exports.getCouponUsageStats = exports.getUserCouponHistory = exports.applyCoupon = exports.validateCoupon = exports.deleteCoupon = exports.updateCoupon = exports.getCouponById = exports.getAllCoupons = exports.createCoupon = void 0;
const coupon_service_1 = __importDefault(require("../services/coupon.service"));
const express_validator_1 = require("express-validator");
/**
 * Create a new coupon
 */
const createCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.user;
        req.body.creatorId = id;
        const coupon = yield coupon_service_1.default.createCoupon(req.body);
        res.status(201).json({
            success: true,
            message: 'Coupon created successfully.',
            data: coupon,
        });
    }
    catch (error) {
        console.error('Error creating coupon:', error);
        res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to create coupon',
        });
    }
});
exports.createCoupon = createCoupon;
/**
 * Get all coupons
 */
const getAllCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const coupons = yield coupon_service_1.default.getAllCoupons(id);
        res.json({
            success: true,
            message: 'Coupons fetched successfully',
            data: coupons,
        });
    }
    catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to fetch coupons',
        });
    }
});
exports.getAllCoupons = getAllCoupons;
/**
 * Get coupon by ID
 */
const getCouponById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const coupon = yield coupon_service_1.default.getCouponById(req.params.id, id);
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
    }
    catch (error) {
        console.error('Error fetching coupon:', error);
        res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to fetch coupon',
        });
    }
});
exports.getCouponById = getCouponById;
/**
 * Update coupon
 */
const updateCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.user;
        const [affectedCount, updatedCoupons] = yield coupon_service_1.default.updateCoupon(req.params.id, req.body, id);
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
    }
    catch (error) {
        console.error('Error updating coupon:', error);
        res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to update coupon',
        });
    }
});
exports.updateCoupon = updateCoupon;
/**
 * Delete coupon
 */
const deleteCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const affectedCount = yield coupon_service_1.default.deleteCoupon(req.params.id, id);
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
    }
    catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to delete coupon',
        });
    }
});
exports.deleteCoupon = deleteCoupon;
/**
 * Validate coupon
 */
const validateCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { couponCode, userId, courseId, purchaseAmount } = req.body;
        const validation = yield coupon_service_1.default.validateAndApplyCoupon(couponCode, userId, courseId, purchaseAmount);
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
    }
    catch (error) {
        console.error('Error validating coupon:', error);
        res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to validate coupon',
        });
    }
});
exports.validateCoupon = validateCoupon;
/**
 * Apply coupon
 */
const applyCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { couponCode, userId, courseId, purchaseAmount, orderId } = req.body;
        const result = yield coupon_service_1.default.applyCoupon(couponCode, userId, courseId, purchaseAmount, orderId);
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
    }
    catch (error) {
        console.error('Error applying coupon:', error);
        res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to apply coupon',
        });
    }
});
exports.applyCoupon = applyCoupon;
/**
 * Get user's coupon history
 */
const getUserCouponHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const history = yield coupon_service_1.default.getUserCouponHistory(req.params.userId);
        res.json({
            success: true,
            message: 'Coupon history fetched successfully.',
            data: history,
        });
    }
    catch (error) {
        console.error('Error fetching coupon history:', error);
        res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to fetch coupon history',
        });
    }
});
exports.getUserCouponHistory = getUserCouponHistory;
/**
 * Get coupon usage statistics
 */
const getCouponUsageStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield coupon_service_1.default.getCouponUsageStats(req.params.couponId);
        res.json({
            success: true,
            message: 'Coupon usage stats fetched successfully.',
            data: stats,
        });
    }
    catch (error) {
        console.error('Error fetching coupon stats:', error);
        res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to fetch coupon stats',
        });
    }
});
exports.getCouponUsageStats = getCouponUsageStats;
//# sourceMappingURL=couponController.js.map