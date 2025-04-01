"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/subscription.routes.ts
const express_1 = require("express");
const subscriptionController_1 = __importDefault(require("../controllers/subscriptionController"));
const validations_1 = require("../utils/validations");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const authorizeCreatorOrInstitution_1 = __importDefault(require("../middlewares/authorizeCreatorOrInstitution"));
const router = (0, express_1.Router)();
// Subscription Routes (Authenticated users)
router.post('/subscribe', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, (0, validations_1.createSubscriptionValidationRules)(), validations_1.validate, subscriptionController_1.default.createSubscription);
router.get('/my-subscriptions', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, subscriptionController_1.default.getUserSubscriptions);
router.get('/my-active-subscription', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, subscriptionController_1.default.getActiveSubscription);
router.post('/cancel/:id', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, (0, validations_1.cancelSubscriptionValidationRules)(), validations_1.validate, subscriptionController_1.default.cancelSubscription);
// Payment Routes
router.post('/verify-payment', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, (0, validations_1.verifyPaymentValidationRules)(), validations_1.validate, subscriptionController_1.default.verifyPayment);
exports.default = router;
//# sourceMappingURL=subscriptionRoute.js.map