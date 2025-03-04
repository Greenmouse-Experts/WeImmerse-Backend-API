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
exports.finalizeTransfer = exports.initiateTransfer = exports.createTransferRecipient = exports.verifyBankAccount = void 0;
const axios_1 = __importDefault(require("axios"));
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const verifyBankAccount = (accountNumber, bankCode) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield axios_1.default.get(`${PAYSTACK_BASE_URL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        });
        console.log(response.data.s);
        if (!response.data.status) {
            throw new Error('Invalid bank details provided.');
        }
        return response.data.data; // Contains verified account details
    }
    catch (error) {
        console.error('Paystack verification error:', error);
        throw new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Bank verification failed.');
    }
});
exports.verifyBankAccount = verifyBankAccount;
/**
 * Create transfer recipient
 * @param name
 * @param email
 * @param accountNumber
 * @param bankCode
 * @returns
 */
const createTransferRecipient = (name, email, accountNumber, bankCode) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield axios_1.default.post(`${PAYSTACK_BASE_URL}/transferrecipient`, {
            type: 'nuban',
            name,
            email,
            account_number: accountNumber,
            bank_code: bankCode,
            currency: 'NGN',
        }, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        });
        return response.data.data.recipient_code;
    }
    catch (error) {
        throw new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to create recipient');
    }
});
exports.createTransferRecipient = createTransferRecipient;
/**
 * Initiate transfer
 * @param amount
 * @param recipientCode
 * @param reason
 * @returns
 */
const initiateTransfer = (amount, recipientCode, reason) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield axios_1.default.post(`${PAYSTACK_BASE_URL}/transfer`, {
            source: 'balance',
            amount: amount * 100,
            recipient: recipientCode,
            reason,
        }, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
        });
        return response.data;
    }
    catch (error) {
        throw new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to initiate transfer');
    }
});
exports.initiateTransfer = initiateTransfer;
/**
 * Finalize transfer
 * @param transfer_code
 * @param otp
 * @returns
 */
const finalizeTransfer = (transfer_code, otp) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield axios_1.default.post(`${PAYSTACK_BASE_URL}/transfer/finalize_transfer`, {
            transfer_code,
            otp,
        }, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
        });
        return response.data;
    }
    catch (error) {
        throw new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to finalize transfer');
    }
});
exports.finalizeTransfer = finalizeTransfer;
//# sourceMappingURL=paystack.service.js.map