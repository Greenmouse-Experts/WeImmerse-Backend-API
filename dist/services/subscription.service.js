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
// services/subscription.service.ts
const sequelize_1 = require("sequelize");
const subscriptionplan_1 = __importDefault(require("../models/subscriptionplan"));
const subscription_1 = __importDefault(require("../models/subscription"));
const transaction_1 = __importDefault(require("../models/transaction"));
const date_1 = require("../utils/date");
const paystack_service_1 = require("./paystack.service");
class SubscriptionService {
    // Subscription Plan Management
    createPlan(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionplan_1.default.create(Object.assign(Object.assign({}, data), { currency: data.currency || 'NGN', features: data.features || [] }));
        });
    }
    getPlans() {
        return __awaiter(this, arguments, void 0, function* (isActive = true) {
            return yield subscriptionplan_1.default.findAll({
                where: isActive ? { isActive: true } : {},
                order: [['price', 'ASC']],
            });
        });
    }
    getPlanById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionplan_1.default.findByPk(id);
        });
    }
    updatePlan(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield subscriptionplan_1.default.findByPk(id);
            if (!plan)
                throw new Error('Subscription plan not found');
            return yield plan.update(data);
        });
    }
    deletePlan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield subscriptionplan_1.default.findByPk(id);
            if (!plan)
                throw new Error('Subscription plan not found');
            // Check if any subscriptions exist for this plan
            const subscriptions = yield subscription_1.default.count({ where: { planId: id } });
            if (subscriptions > 0) {
                throw new Error('Cannot delete plan with active subscriptions');
            }
            yield plan.destroy();
            return true;
        });
    }
    // Subscription Handling
    createSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield subscriptionplan_1.default.findByPk(data.planId);
            if (!plan)
                throw new Error('Subscription plan not found');
            const startDate = new Date();
            const endDate = (0, date_1.calculateEndDate)(startDate, plan.duration);
            return yield subscription_1.default.create({
                userId: data.userId,
                planId: data.planId,
                startDate,
                endDate,
                status: 'pending',
                isAutoRenew: data.isAutoRenew || false,
                paymentMethod: data.paymentMethod,
            });
        });
    }
    getUserSubscriptions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscription_1.default.findAll({
                where: { userId },
                include: [{ model: subscriptionplan_1.default, as: 'plan' }],
                order: [['createdAt', 'DESC']],
            });
        });
    }
    getActiveSubscription(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscription_1.default.findOne({
                where: {
                    userId,
                    status: 'active',
                    endDate: { [sequelize_1.Op.gt]: new Date() },
                },
                include: [{ model: subscriptionplan_1.default, as: 'plan' }],
                order: [['endDate', 'DESC']],
            });
        });
    }
    cancelSubscription(subscriptionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield subscription_1.default.findOne({
                where: { id: subscriptionId, userId },
            });
            if (!subscription)
                throw new Error('Subscription not found');
            if (subscription.status !== 'active')
                throw new Error('Only active subscriptions can be canceled');
            yield subscription.update({
                status: 'canceled',
                isAutoRenew: false,
            });
            return subscription;
        });
    }
    // Payment Processing
    initializePayment(user, subscriptionId, amount, currency, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            // In a real app, this would call your payment gateway
            const reference = `PAY-${Date.now()}`;
            const payment = yield paystack_service_1.PaystackService.initializePayment(reference, amount, currency, user.email, { subscriptionId, userId: user.id });
            yield transaction_1.default.create({
                userId: user.id,
                subscriptionId,
                amount,
                currency,
                status: 'pending',
                paymentMethod,
                paymentGateway: 'paystack', // Example
                gatewayReference: reference,
            });
            return Object.assign(Object.assign({}, payment), { reference });
        });
    }
    verifyPayment(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            // In a real app, this would verify with your payment gateway
            const transaction = yield transaction_1.default.findOne({
                where: { gatewayReference: reference },
            });
            if (!transaction)
                throw new Error('Transaction not found.');
            // Mock verification - in reality you'd call your payment provider
            const isSuccess = Math.random() > 0.2; // 80% chance of success for demo
            const verification = yield paystack_service_1.PaystackService.verifyPayment(reference);
            if (verification.data.status !== 'success') {
                // Activate subscription
                throw new Error('Transaction yet to be confirmed.');
            }
            yield transaction.update({ status: 'success' });
            if (transaction.subscriptionId) {
                const subscription = yield subscription_1.default.findByPk(transaction.subscriptionId);
                if (subscription) {
                    yield subscription.update({
                        status: 'active',
                        transactionId: transaction.id,
                    });
                    // Send confirmation email
                    yield sendSubscriptionConfirmation(subscription);
                }
            }
            return {
                success: true,
                message: 'Payment confirmed successfully.',
                transaction,
            };
        });
    }
    // Subscription Expiry & Renewal
    checkExpiredSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const expiredSubscriptions = yield subscription_1.default.findAll({
                where: {
                    status: 'active',
                    endDate: { [sequelize_1.Op.lt]: now },
                },
            });
            for (const subscription of expiredSubscriptions) {
                if (subscription.isAutoRenew) {
                    yield this.renewSubscription(subscription.id);
                }
                else {
                    yield subscription.update({ status: 'expired' });
                    yield sendSubscriptionExpiredNotification(subscription);
                }
            }
            return expiredSubscriptions.length;
        });
    }
    renewSubscription(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield subscription_1.default.findOne({
                where: { subscriptionId },
                include: [{ model: subscriptionplan_1.default, as: 'plan' }],
            });
            if (!subscription)
                throw new Error('Subscription not found');
            if (subscription.status !== 'active')
                throw new Error('Only active subscriptions can be renewed');
            const newStartDate = new Date();
            const newEndDate = (0, date_1.calculateEndDate)(newStartDate, 
            // @ts-ignore
            subscription.plan.duration);
            // Create a new payment transaction
            const transaction = yield transaction_1.default.create({
                subscriptionId: subscription.id,
                userId: subscription.userId,
                // @ts-ignore
                amount: subscription.plan.price,
                // @ts-ignore
                currency: subscription.plan.currency,
                status: 'pending',
                paymentMethod: subscription.paymentMethod,
                paymentGateway: 'paystack',
            });
            // Process payment (in reality you'd call your payment gateway)
            const paymentSuccess = Math.random() > 0.2; // 80% success rate for demo
            if (paymentSuccess) {
                yield transaction.update({ status: 'success' });
                yield subscription.update({
                    startDate: newStartDate,
                    endDate: newEndDate,
                    transactionId: transaction.id,
                });
                yield sendSubscriptionRenewalConfirmation(subscription);
                return { success: true, subscription };
            }
            else {
                yield transaction.update({ status: 'failed' });
                yield subscription.update({
                    status: 'expired',
                    isAutoRenew: false,
                });
                yield sendPaymentFailureNotification(subscription);
                return { success: false, subscription };
            }
        });
    }
}
// Helper functions for emails (would be in a separate file)
function sendSubscriptionConfirmation(subscription) {
    return __awaiter(this, void 0, void 0, function* () {
        // Implementation would use your email service
    });
}
function sendSubscriptionExpiredNotification(subscription) {
    return __awaiter(this, void 0, void 0, function* () {
        // Implementation would use your email service
    });
}
function sendSubscriptionRenewalConfirmation(subscription) {
    return __awaiter(this, void 0, void 0, function* () {
        // Implementation would use your email service
    });
}
function sendPaymentFailureNotification(subscription) {
    return __awaiter(this, void 0, void 0, function* () {
        // Implementation would use your email service
    });
}
exports.default = new SubscriptionService();
//# sourceMappingURL=subscription.service.js.map