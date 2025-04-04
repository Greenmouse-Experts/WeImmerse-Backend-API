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
exports.PaystackService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../middlewares/logger"));
const crypto = __importStar(require("crypto"));
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
class PaystackService {
    /**
     * Initialize payment for subscription
     */
    static initializePayment(reference, amount, currency, userEmail, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                // Convert amount to kobo (smallest currency unit)
                const amountInKobo = Math.round(amount * 100);
                const response = yield axios_1.default.post(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
                    email: userEmail,
                    amount: amountInKobo,
                    reference,
                    currency: currency || 'NGN',
                    metadata,
                    channels: this.getPaymentChannels(process.env.DEFAULT_COUNTRY),
                    callback_url: this.getCallbackUrl(process.env.DEFAULT_COUNTRY),
                }, {
                    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
                });
                return response.data.data;
            }
            catch (error) {
                console.error('Paystack initialization error:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw new Error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Payment initialization failed');
            }
        });
    }
    /**
     * Verify payment status
     */
    static verifyPayment(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const response = yield axios_1.default.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
                    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
                });
                return response.data;
            }
            catch (error) {
                console.error('Paystack verification error:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw new Error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Payment verification failed');
            }
        });
    }
    /**
     * Create recurring payment authorization
     */
    static createRecurringAuthorization(email, amount, reference, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const response = yield axios_1.default.post(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
                    email,
                    amount: Math.round(amount * 100),
                    reference,
                    authorization_code: data.paymentAuthorizationCode,
                    currency: data.currency || 'NGN',
                    metadata: {
                        subscriptionId: data.id,
                        isRecurring: true,
                    },
                }, {
                    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
                });
                return response.data.data;
            }
            catch (error) {
                console.error('Paystack recurring auth error:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw new Error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Recurring authorization failed');
            }
        });
    }
    /**
     * Charge recurring payment
     */
    static chargeRecurringPayment(authorizationCode, email, amount, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const response = yield axios_1.default.post(`${PAYSTACK_BASE_URL}/transaction/charge_authorization`, {
                    authorization_code: authorizationCode,
                    email,
                    amount: Math.round(amount * 100),
                    reference,
                    currency: 'NGN',
                }, {
                    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
                });
                return response.data.data;
            }
            catch (error) {
                console.error('Paystack charge error:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw new Error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Recurring charge failed');
            }
        });
    }
    /**
     * Get list of supported banks by country
     */
    static getBanks() {
        return __awaiter(this, arguments, void 0, function* (country = 'nigeria') {
            var _a, _b, _c;
            try {
                const response = yield axios_1.default.get(`${PAYSTACK_BASE_URL}/bank?country=${country}`, {
                    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
                });
                return response.data.data;
            }
            catch (error) {
                console.error('Paystack banks error:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw new Error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to fetch banks');
            }
        });
    }
    /**
     * Verify bank account details
     */
    static verifyBankAccount(accountNumber, bankCode) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const response = yield axios_1.default.get(`${PAYSTACK_BASE_URL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
                    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
                });
                if (!response.data.status) {
                    throw new Error('Invalid bank details provided.');
                }
                return response.data.data;
            }
            catch (error) {
                console.error('Paystack verification error:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw new Error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Bank verification failed.');
            }
        });
    }
    /**
     * Create transfer recipient
     */
    static createTransferRecipient(name_1, accountNumber_1, bankCode_1) {
        return __awaiter(this, arguments, void 0, function* (name, accountNumber, bankCode, currency = 'NGN') {
            var _a, _b, _c;
            try {
                const response = yield axios_1.default.post(`${PAYSTACK_BASE_URL}/transferrecipient`, {
                    type: 'nuban',
                    name,
                    account_number: accountNumber,
                    bank_code: bankCode,
                    currency,
                }, {
                    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
                });
                return response.data.data.recipient_code;
            }
            catch (error) {
                console.error('Paystack recipient error:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw new Error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to create recipient');
            }
        });
    }
    /**
     * Initiate transfer
     */
    static initiateTransfer(amount_1, recipientCode_1, reason_1) {
        return __awaiter(this, arguments, void 0, function* (amount, recipientCode, reason, currency = 'NGN') {
            var _a, _b, _c;
            try {
                const response = yield axios_1.default.post(`${PAYSTACK_BASE_URL}/transfer`, {
                    source: 'balance',
                    amount: Math.round(amount * 100),
                    recipient: recipientCode,
                    reason,
                    currency,
                }, {
                    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
                });
                return response.data.data;
            }
            catch (error) {
                console.error('Paystack transfer error:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw new Error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to initiate transfer');
            }
        });
    }
    /**
     * Finalize transfer with OTP
     */
    static finalizeTransfer(transferCode, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const response = yield axios_1.default.post(`${PAYSTACK_BASE_URL}/transfer/finalize_transfer`, {
                    transfer_code: transferCode,
                    otp,
                }, {
                    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
                });
                return response.data.data;
            }
            catch (error) {
                console.error('Paystack finalize error:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw new Error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to finalize transfer');
            }
        });
    }
    /**
     * Get region-specific payment channels
     */
    static getPaymentChannels(region) {
        const channels = {
            NG: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
            GH: ['card', 'mobile_money'],
            US: ['card', 'bank'],
            UK: ['card', 'bank'],
        };
        return channels[region] || ['card', 'bank'];
    }
    /**
     * Get region-specific callback URL
     */
    static getCallbackUrl(region) {
        const urls = {
            NG: `${process.env.BASE_URL}/api/payments/ng/callback`,
            GH: `${process.env.BASE_URL}/api/payments/gh/callback`,
            US: `${process.env.BASE_URL}/api/payments/us/callback`,
            UK: `${process.env.BASE_URL}/api/payments/uk/callback`,
        };
        return urls[region] || `${process.env.BASE_URL}/api/payments/callback`;
    }
    /**
     * Initialize a refund for a transaction
     * @param reference - The original transaction reference
     * @param amount - Amount to refund (in the original currency)
     * @param reason - Optional reason for the refund
     */
    static initiateRefund(reference, amount, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const response = yield axios_1.default.post(`${PAYSTACK_BASE_URL}/refund`, Object.assign({ transaction: reference, amount: amount * 100 }, (reason && { merchant_note: reason })), {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                return response.data;
            }
            catch (error) {
                logger_1.default.error('Paystack refund initialization failed:', {
                    reference,
                    amount,
                    error: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message,
                });
                throw new Error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to initiate refund');
            }
        });
    }
    static verifyWebhookSignature(body, signature) {
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
            .update(body)
            .digest('hex');
        return hash === signature;
    }
}
exports.PaystackService = PaystackService;
//# sourceMappingURL=paystack.service.js.map