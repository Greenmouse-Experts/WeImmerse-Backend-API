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
const subscription_service_1 = __importDefault(require("../services/subscription.service"));
class SubscriptionController {
    // Subscription Handling
    createSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id; // Assuming user ID is in the request
                const email = req.user.email;
                const subscription = yield subscription_service_1.default.createSubscription(Object.assign({ userId }, req.body));
                // Initialize payment
                const plan = yield subscription_service_1.default.getPlanById(req.body.planId);
                if (!plan)
                    throw new Error('Plan not found');
                const payment = yield subscription_service_1.default.initializePayment({ id: userId, email }, subscription.id, plan.price, plan.currency, req.body.paymentMethod);
                res.status(201).json({
                    message: 'Subscription initiated successfully.',
                    subscription,
                    payment,
                });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getUserSubscriptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const subscriptions = yield subscription_service_1.default.getUserSubscriptions(userId);
                res.json({ status: true, data: subscriptions });
            }
            catch (error) {
                res.status(400).json({ status: false, message: error.message });
            }
        });
    }
    getActiveSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const subscription = yield subscription_service_1.default.getActiveSubscription(userId);
                res.json({ status: true, data: subscription });
            }
            catch (error) {
                res.status(400).json({ status: false, message: error.message });
            }
        });
    }
    cancelSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const subscription = yield subscription_service_1.default.cancelSubscription(req.params.id, userId);
                res.json({
                    status: true,
                    message: 'Subscription cancelled successfully.',
                    data: subscription,
                });
            }
            catch (error) {
                res.status(400).json({ status: false, message: error.message });
            }
        });
    }
    // Payment Processing
    verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield subscription_service_1.default.verifyPayment(req.body.reference);
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ status: false, message: error.message });
            }
        });
    }
}
exports.default = new SubscriptionController();
//# sourceMappingURL=subscriptionController.js.map