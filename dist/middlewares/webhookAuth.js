"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookAuth = void 0;
const paystack_service_1 = require("../services/paystack.service");
const ApiError_1 = require("../utils/ApiError");
const webhookAuth = (req, res, next) => {
    const signature = req.headers['x-paystack-signature'];
    if (!signature) {
        throw new ApiError_1.ForbiddenError('Missing webhook signature');
    }
    const isValid = paystack_service_1.PaystackService.verifyWebhookSignature(JSON.stringify(req.body), signature);
    if (!isValid) {
        throw new ApiError_1.ForbiddenError('Invalid webhook signature');
    }
    next();
};
exports.webhookAuth = webhookAuth;
//# sourceMappingURL=webhookAuth.js.map