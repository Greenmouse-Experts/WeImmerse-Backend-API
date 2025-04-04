"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const uuid_1 = require("uuid");
const transaction_1 = __importStar(require("../models/transaction"));
const digitalasset_1 = __importDefault(require("../models/digitalasset"));
const physicalasset_1 = __importDefault(require("../models/physicalasset"));
const course_1 = __importDefault(require("../models/course"));
const user_1 = __importDefault(require("../models/user"));
const userdigitalasset_1 = __importDefault(require("../models/userdigitalasset"));
const physicalassetorder_1 = __importDefault(require("../models/physicalassetorder"));
const courseenrollment_1 = __importDefault(require("../models/courseenrollment"));
const transaction_2 = require("../models/transaction");
const paystack_service_1 = require("./paystack.service");
const ApiError_1 = require("../utils/ApiError");
const logger_1 = __importDefault(require("../middlewares/logger"));
const mail_service_1 = require("./mail.service");
const messages_1 = require("../utils/messages");
class TransactionService {
    /**
     * Initiate a new purchase transaction
     */
    static initiatePurchase(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, productType, productId, paymentMethod = transaction_2.PaymentMethod.PAYSTACK, amount, currency = 'NGN', shippingAddress, }) {
            // Verify the product exists and is available for purchase
            const { product, creator } = yield this.verifyProduct(productType, productId, amount, currency, userId);
            // Generate transaction reference
            const reference = `TXN-${(0, uuid_1.v4)()}`;
            // Create transaction record
            const transaction = yield transaction_1.default.create({
                productId,
                userId,
                amount,
                currency,
                paymentMethod,
                paymentType: productType,
                paymentGateway: 'paystack',
                gatewayReference: reference,
                status: transaction_2.PaymentStatus.PENDING,
                metadata: {
                    productName: this.getProductName(productType, product),
                    creatorId: creator.id,
                    shippingAddress,
                },
            });
            try {
                // Get user email for payment processing
                const user = yield user_1.default.findByPk(userId);
                if (!user)
                    throw new ApiError_1.NotFoundError('User not found');
                // Initialize payment with payment processor
                const paymentLink = yield paystack_service_1.PaystackService.initializePayment(reference, amount, currency, user.email, {
                    transactionId: transaction.id,
                    userId,
                    productType,
                    productId,
                });
                return Object.assign(Object.assign({}, transaction.toJSON()), { paymentLink });
            }
            catch (error) {
                // Update transaction status if initialization fails
                yield transaction.update({ status: transaction_2.PaymentStatus.FAILED });
                logger_1.default.error('Payment initialization failed:', error);
                throw error;
            }
        });
    }
    /**
     * Verify a payment transaction
     */
    static verifyPayment(reference, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find transaction record
            const transaction = yield transaction_1.default.findOne({
                where: { gatewayReference: reference, userId },
            });
            if (!transaction) {
                throw new ApiError_1.NotFoundError('Transaction not found');
            }
            // Skip if already completed
            if (transaction.status === transaction_2.PaymentStatus.COMPLETED) {
                return transaction;
            }
            try {
                // Verify with payment processor
                const verification = yield paystack_service_1.PaystackService.verifyPayment(reference);
                // Update transaction status based on verification
                let newStatus = transaction_2.PaymentStatus.FAILED;
                if (verification.data.status === 'success') {
                    newStatus = transaction_2.PaymentStatus.COMPLETED;
                }
                yield transaction.update({ status: newStatus });
                // If transaction is successful, complete the purchase
                if (newStatus === transaction_2.PaymentStatus.COMPLETED) {
                    yield this.completePurchase(transaction);
                }
                return transaction;
            }
            catch (error) {
                logger_1.default.error('Payment verification failed:', error);
                throw error;
            }
        });
    }
    /**
     * Get purchase history for a user
     */
    static getPurchaseHistory(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * limit;
            const { count, rows } = yield transaction_1.default.findAndCountAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                include: [
                    {
                        association: 'user',
                        attributes: ['id', 'name', 'email'],
                    },
                ],
            });
            return {
                total: count,
                page,
                limit,
                data: rows,
            };
        });
    }
    /**
     * Get details of a specific purchase
     */
    static getPurchaseDetails(transactionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield transaction_1.default.findOne({
                where: { id: transactionId, userId },
                include: [
                    {
                        association: 'user',
                        attributes: ['id', 'name', 'email'],
                    },
                ],
            });
            if (!transaction) {
                throw new ApiError_1.NotFoundError('Transaction not found');
            }
            return transaction;
        });
    }
    /**
     * Process payment webhook notifications
     */
    static processWebhook(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { event, data } = payload;
            // We only process successful charge events
            if (event !== 'charge.success') {
                logger_1.default.info('Skipping non-charge webhook event', { event });
                return { processed: false, reason: 'Non-charge event' };
            }
            const { reference, status, amount, metadata } = data;
            // Find transaction record
            const transaction = yield transaction_1.default.findOne({
                where: { gatewayReference: reference },
            });
            if (!transaction) {
                logger_1.default.error('Transaction not found for webhook', { reference });
                throw new ApiError_1.NotFoundError('Transaction not found');
            }
            // Skip if already completed
            if (transaction.status === transaction_2.PaymentStatus.COMPLETED) {
                logger_1.default.info('Transaction already completed', {
                    transactionId: transaction.id,
                });
                return {
                    processed: false,
                    reason: 'Transaction already completed',
                    transactionId: transaction.id,
                };
            }
            // Convert amount from kobo to Naira (or equivalent)
            const amountInMajor = amount / 100;
            // Validate amount matches
            if (amountInMajor !== transaction.amount) {
                logger_1.default.error('Amount mismatch in webhook', {
                    expected: transaction.amount,
                    received: amountInMajor,
                    transactionId: transaction.id,
                });
                throw new ApiError_1.ForbiddenError('Amount mismatch');
            }
            // Update transaction status based on verification
            const newStatus = status === 'success' ? transaction_2.PaymentStatus.COMPLETED : transaction_2.PaymentStatus.FAILED;
            yield transaction.update({
                status: newStatus,
                metadata: Object.assign(Object.assign({}, transaction.metadata), { webhookData: data, processedAt: new Date().toISOString() }),
            });
            // If transaction is successful, complete the purchase
            if (newStatus === transaction_2.PaymentStatus.COMPLETED) {
                yield this.completePurchase(transaction);
                logger_1.default.info('Purchase completed successfully', {
                    transactionId: transaction.id,
                    productType: transaction.paymentType,
                    productId: transaction.productId,
                });
            }
            return {
                processed: true,
                transactionId: transaction.id,
                status: newStatus,
                productType: transaction.paymentType,
                productId: transaction.productId,
            };
        });
    }
    /**
     * Verify product availability and pricing
     */
    static verifyProduct(productType, productId, amount, currency, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let product;
            let creator;
            switch (productType) {
                case 'digital_asset':
                    product = (yield digitalasset_1.default.findOne({
                        where: { id: productId, status: 'published' },
                        include: [{ association: 'user' }],
                    }));
                    if (!product)
                        throw new ApiError_1.NotFoundError('Digital asset not found or not available');
                    // Check existing ownership
                    const existingOwnership = yield userdigitalasset_1.default.findOne({
                        where: { userId, assetId: productId },
                    });
                    if (existingOwnership)
                        throw new ApiError_1.ConflictError('You already own this digital asset');
                    if (product.pricingType === 'One-Time-Purchase') {
                        if (!product.currency || !product.amount) {
                            throw new ApiError_1.ForbiddenError('Digital asset not properly configured for purchase');
                        }
                        if (product.currency !== currency || product.amount !== amount) {
                            throw new ApiError_1.ForbiddenError('Invalid payment amount or currency');
                        }
                    }
                    else if (product.pricingType === 'Free' && amount !== 0) {
                        throw new ApiError_1.ForbiddenError('This is a free asset');
                    }
                    creator = product.user;
                    break;
                case 'physical_asset':
                    product = (yield physicalasset_1.default.findOne({
                        where: { id: productId, status: 'published' },
                        include: [{ association: 'user' }],
                    }));
                    if (!product)
                        throw new ApiError_1.NotFoundError('Physical asset not found or not available');
                    if (!product.currency || !product.amount) {
                        throw new ApiError_1.ForbiddenError('Physical asset not properly configured for purchase');
                    }
                    if (product.currency !== currency || product.amount !== amount) {
                        throw new ApiError_1.ForbiddenError('Invalid payment amount or currency');
                    }
                    creator = product.user;
                    break;
                case 'course':
                    product = yield course_1.default.findOne({
                        where: { id: productId, status: 'live', published: true },
                        include: [{ association: 'creator' }],
                    });
                    if (!product)
                        throw new ApiError_1.NotFoundError('Course not found or not available');
                    // Check existing enrollment
                    const existingEnrollment = yield courseenrollment_1.default.findOne({
                        where: { userId, courseId: productId },
                    });
                    if (existingEnrollment)
                        throw new ApiError_1.ConflictError('You are already enrolled in this course');
                    if (product.price === 0 && amount !== 0) {
                        throw new ApiError_1.ForbiddenError('This is a free course');
                    }
                    else if (product.price > 0) {
                        if (!product.currency)
                            throw new ApiError_1.ForbiddenError('Course not properly configured');
                        if (product.currency !== currency || product.price !== amount) {
                            throw new ApiError_1.ForbiddenError('Invalid payment amount or currency');
                        }
                    }
                    creator = product.creator;
                    break;
                default:
                    throw new ApiError_1.NotFoundError('Invalid product type');
            }
            return { product, creator };
        });
    }
    /**
     * Complete the purchase process after successful payment
     */
    static completePurchase(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            // Grant access based on product type
            switch (transaction.paymentType) {
                case transaction_1.ProductType.DIGITAL_ASSET:
                    yield userdigitalasset_1.default.create({
                        userId: transaction.userId,
                        assetId: transaction.productId,
                        transactionId: transaction.id,
                        accessGrantedAt: new Date(),
                    });
                    break;
                case transaction_1.ProductType.PHYSICAL_ASSET:
                    yield physicalassetorder_1.default.create({
                        userId: transaction.userId,
                        assetId: transaction.productId,
                        transactionId: transaction.id,
                        amount: transaction.amount,
                        currency: transaction.currency,
                        shippingAddress: transaction.metadata.shippingAddress || {},
                        status: 'processing',
                    });
                    break;
                case transaction_1.ProductType.COURSE:
                    yield courseenrollment_1.default.create({
                        userId: transaction.userId,
                        courseId: transaction.productId,
                        enrolledAt: new Date(),
                        transactionId: transaction.id,
                    });
                    break;
            }
            // Send purchase confirmation email
            yield this.sendPurchaseConfirmation(transaction);
        });
    }
    /**
     * Send purchase confirmation email
     */
    static sendPurchaseConfirmation(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findByPk(transaction.userId);
                if (!user)
                    return;
                let productName = '';
                let productTypeName = '';
                switch (transaction.paymentType) {
                    case transaction_1.ProductType.DIGITAL_ASSET:
                        productTypeName = 'Digital Asset';
                        const digitalAsset = yield digitalasset_1.default.findByPk(transaction.productId);
                        productName = (digitalAsset === null || digitalAsset === void 0 ? void 0 : digitalAsset.assetName) || 'Digital Asset';
                        break;
                    case transaction_1.ProductType.PHYSICAL_ASSET:
                        productTypeName = 'Physical Asset';
                        const physicalAsset = yield physicalasset_1.default.findByPk(transaction.productId);
                        productName = (physicalAsset === null || physicalAsset === void 0 ? void 0 : physicalAsset.assetName) || 'Physical Asset';
                        break;
                    case transaction_1.ProductType.COURSE:
                        productTypeName = 'Course';
                        const course = yield course_1.default.findByPk(transaction.productId);
                        productName = (course === null || course === void 0 ? void 0 : course.title) || 'Course';
                        break;
                }
                const emailContent = messages_1.emailTemplates.sendPurchaseConfirmation({
                    user,
                    productName,
                    productType: productTypeName,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    transactionId: transaction.id,
                    paymentMethod: transaction.paymentMethod,
                });
                yield (0, mail_service_1.sendMail)(user.email, `Purchase Confirmation - ${productName}`, emailContent);
            }
            catch (error) {
                logger_1.default.error('Error sending purchase confirmation email:', error);
            }
        });
    }
    /**
     * Helper to get product name based on type
     */
    static getProductName(productType, product) {
        switch (productType) {
            case 'digital_asset':
                return product.assetName;
            case 'physical_asset':
                return product.assetName;
            case 'course':
                return product.title || 'Course';
            default:
                return 'Product';
        }
    }
    /**
     * Refund a transaction
     */
    static refundTransaction(transactionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield transaction_1.default.findOne({
                where: { id: transactionId, userId },
            });
            if (!transaction) {
                throw new ApiError_1.NotFoundError('Transaction not found');
            }
            if (transaction.status !== transaction_2.PaymentStatus.COMPLETED) {
                throw new ApiError_1.ForbiddenError('Only completed transactions can be refunded');
            }
            try {
                // Process refund with payment processor
                const refund = yield paystack_service_1.PaystackService.initiateRefund(transaction.gatewayReference, transaction.amount);
                // Update transaction status
                yield transaction.update({
                    status: transaction_2.PaymentStatus.REFUNDED,
                    metadata: Object.assign(Object.assign({}, transaction.metadata), { refundReference: refund.data.transaction.reference }),
                });
                // Reverse the purchase based on product type
                yield this.reversePurchase(transaction);
                return transaction;
            }
            catch (error) {
                logger_1.default.error('Refund failed:', error);
                throw error;
            }
        });
    }
    /**
     * Reverse a purchase (used for refunds)
     */
    static reversePurchase(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (transaction.paymentType) {
                case transaction_1.ProductType.DIGITAL_ASSET:
                    yield userdigitalasset_1.default.destroy({
                        where: {
                            userId: transaction.userId,
                            assetId: transaction.productId,
                            transactionId: transaction.id,
                        },
                    });
                    break;
                case transaction_1.ProductType.COURSE:
                    yield courseenrollment_1.default.destroy({
                        where: {
                            userId: transaction.userId,
                            courseId: transaction.productId,
                            transactionId: transaction.id,
                        },
                    });
                    break;
                case transaction_1.ProductType.PHYSICAL_ASSET:
                    // For physical assets, we typically can't reverse the shipment
                    // but we can mark the order as refunded
                    yield physicalassetorder_1.default.update({ status: 'refunded' }, {
                        where: {
                            userId: transaction.userId,
                            assetId: transaction.productId,
                            transactionId: transaction.id,
                        },
                    });
                    break;
            }
        });
    }
}
exports.default = TransactionService;
//# sourceMappingURL=transaction.service.js.map