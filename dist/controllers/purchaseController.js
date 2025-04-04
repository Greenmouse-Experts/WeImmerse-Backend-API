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
exports.paymentWebhook = exports.getPurchaseDetails = exports.getPurchaseHistory = exports.verifyPayment = exports.initiatePurchase = void 0;
const transaction_service_1 = __importDefault(require("../services/transaction.service"));
const logger_1 = __importDefault(require("../middlewares/logger"));
const ApiError_1 = require("../utils/ApiError");
const paystack_service_1 = require("../services/paystack.service");
const initiatePurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productType, productId, paymentMethod, amount, currency, shippingAddress, } = req.body;
        const userId = req.user.id;
        const transaction = yield transaction_service_1.default.initiatePurchase({
            userId,
            productType,
            productId,
            paymentMethod,
            amount,
            currency,
            shippingAddress,
        });
        res.status(201).json({
            status: true,
            message: 'Purchase initiated successfully',
            data: transaction,
        });
    }
    catch (error) {
        logger_1.default.error('Error initiating purchase:', error);
        res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
});
exports.initiatePurchase = initiatePurchase;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reference } = req.body;
        const userId = req.user.id;
        const transaction = yield transaction_service_1.default.verifyPayment(reference, userId);
        res.status(200).json({
            status: true,
            message: 'Payment verified successfully',
            data: transaction,
        });
    }
    catch (error) {
        logger_1.default.error('Error verifying payment:', error);
        res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
});
exports.verifyPayment = verifyPayment;
const getPurchaseHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const history = yield transaction_service_1.default.getPurchaseHistory(userId, parseInt(page), parseInt(limit));
        res.status(200).json({
            status: true,
            message: 'Purchase history retrieved successfully',
            data: history,
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching purchase history:', error);
        res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
});
exports.getPurchaseHistory = getPurchaseHistory;
const getPurchaseDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transactionId } = req.params;
        const userId = req.user.id;
        const transaction = yield transaction_service_1.default.getPurchaseDetails(transactionId, userId);
        res.status(200).json({
            status: true,
            message: 'Purchase details retrieved successfully',
            data: transaction,
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching purchase details:', error);
        res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
});
exports.getPurchaseDetails = getPurchaseDetails;
const paymentWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify the webhook signature for security
        const signature = req.headers['x-paystack-signature'];
        if (!signature) {
            throw new ApiError_1.ForbiddenError('Missing webhook signature');
        }
        const isValid = paystack_service_1.PaystackService.verifyWebhookSignature(JSON.stringify(req.body), signature);
        if (!isValid) {
            throw new ApiError_1.ForbiddenError('Invalid webhook signature');
        }
        // Process the webhook
        const result = yield transaction_service_1.default.processWebhook(req.body);
        res.status(200).json({
            status: true,
            message: 'Webhook processed successfully',
            data: result,
        });
    }
    catch (error) {
        logger_1.default.error('Error processing webhook:', {
            error: error.message,
            body: req.body,
            headers: req.headers,
        });
        res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
});
exports.paymentWebhook = paymentWebhook;
//# sourceMappingURL=purchaseController.js.map