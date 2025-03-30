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
exports.hasActiveSubscription = hasActiveSubscription;
const subscription_service_1 = __importDefault(require("../services/subscription.service"));
function hasActiveSubscription(feature) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const subscription = yield subscription_service_1.default.getActiveSubscription(userId);
            if (!subscription) {
                return res.status(403).json({
                    message: 'Active subscription required to access this feature',
                });
            }
            // Check for specific feature if provided
            if (feature) {
                const plan = yield subscription_service_1.default.getPlanById(subscription.planId);
                if (!(plan === null || plan === void 0 ? void 0 : plan.features.includes(feature))) {
                    return res.status(403).json({
                        message: 'Your subscription plan does not include this feature',
                    });
                }
            }
            req.subscription = subscription;
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
//# sourceMappingURL=subscriptionMiddleware.js.map