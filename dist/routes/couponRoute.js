"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/couponRoutes.ts
const express_1 = __importDefault(require("express"));
const couponController_1 = require("../controllers/couponController");
const validations_1 = require("../utils/validations");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const authorizeCreatorOrInstitution_1 = __importDefault(require("../middlewares/authorizeCreatorOrInstitution"));
const router = express_1.default.Router();
// Admin routes
router.post('/', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, (0, validations_1.createCouponValidationRules)(), couponController_1.createCoupon);
router.get('/', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, couponController_1.getAllCoupons);
router.get('/:id', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, couponController_1.getCouponById);
router.put('/:id', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, (0, validations_1.createCouponValidationRules)(), couponController_1.updateCoupon);
router.delete('/:id', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, couponController_1.deleteCoupon);
router.get('/:couponId/stats', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, couponController_1.getCouponUsageStats);
// User routes
router.post('/validate', authMiddleware_1.default, (0, validations_1.applyCouponValidationRules)(), couponController_1.validateCoupon);
router.post('/apply', authMiddleware_1.default, (0, validations_1.applyCouponValidationRules)(), couponController_1.applyCoupon);
router.get('/user/:userId/history', authMiddleware_1.default, couponController_1.getUserCouponHistory);
exports.default = router;
//# sourceMappingURL=couponRoute.js.map