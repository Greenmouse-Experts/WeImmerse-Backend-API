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
const withdrawalrequest_1 = __importStar(require("../models/withdrawalrequest"));
const withdrawalhistory_1 = __importDefault(require("../models/withdrawalhistory"));
const user_1 = __importDefault(require("../models/user"));
const admin_1 = __importDefault(require("../models/admin"));
const withdrawalaccount_1 = __importDefault(require("../models/withdrawalaccount"));
const paystack_service_1 = require("./paystack.service");
class WithdrawalService {
    static requestWithdrawal(userId, amount, currency, paymentProvider, recipientCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ where: { id: userId } });
                if (!user)
                    throw new Error('User not found');
                const withdrawalRequest = yield withdrawalrequest_1.default.create({
                    userId: userId,
                    amount,
                    currency,
                    paymentProvider,
                    recipientCode,
                    status: withdrawalrequest_1.WithdrawalStatus.PENDING,
                });
                return { success: true, withdrawalRequest };
            }
            catch (error) {
                return { success: false, message: error.message };
            }
        });
    }
    /**
     * Approve withdrawal
     * @param adminId
     * @param requestId
     * @param approve
     * @param transaction
     * @returns
     */
    static approveWithdrawal(adminId_1, requestId_1) {
        return __awaiter(this, arguments, void 0, function* (adminId, requestId, approve = true, transaction) {
            try {
                const admin = yield admin_1.default.findByPk(adminId);
                if (!admin)
                    throw new Error('Admin not found');
                const withdrawalRequest = yield withdrawalrequest_1.default.findByPk(requestId);
                if (!withdrawalRequest)
                    throw new Error('Withdrawal request not found');
                if (withdrawalRequest.status !== withdrawalrequest_1.WithdrawalStatus.PENDING) {
                    throw new Error('Withdrawal request already processed');
                }
                let status = approve
                    ? withdrawalrequest_1.WithdrawalStatus.APPROVED
                    : withdrawalrequest_1.WithdrawalStatus.REJECTED;
                yield withdrawalRequest.update({
                    status,
                    adminReviewedBy: adminId,
                    adminReviewedAt: new Date(),
                }, { transaction });
                let message = '';
                let withdrawalHistory = {};
                if (approve) {
                    // Retrieve the withdrawal account record
                    const withdrawalAccount = yield withdrawalaccount_1.default.findOne({
                        where: { userId: withdrawalRequest.userId },
                    });
                    if (!withdrawalAccount)
                        throw new Error('Withdrawal account not found');
                    const transferResponse = yield (0, paystack_service_1.initiateTransfer)(withdrawalRequest.amount, withdrawalRequest.recipientCode, 'Withdrawal payout');
                    message = transferResponse.message;
                    withdrawalHistory = yield withdrawalhistory_1.default.create({
                        userId: withdrawalRequest.userId,
                        amount: withdrawalRequest.amount,
                        currency: withdrawalRequest.currency,
                        paymentProvider: withdrawalRequest.paymentProvider,
                        payoutReference: transferResponse.data.transfer_code,
                        status: withdrawalrequest_1.WithdrawalStatus.PENDING,
                        transactionDate: new Date(),
                    }, { transaction });
                }
                yield transaction.commit();
                return {
                    success: true,
                    message,
                    data: withdrawalHistory,
                };
            }
            catch (error) {
                yield transaction.rollback();
                return { success: false, message: error.message };
            }
        });
    }
    /**
     * Finalize withdrawal
     * @param adminId
     * @param withdrawalHistoryId
     * @param otp
     * @param transaction
     * @returns
     */
    static finalizeWithdrawal(adminId, withdrawalHistoryId, otp, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield admin_1.default.findByPk(adminId);
                if (!admin)
                    throw new Error('Admin not found');
                // Get withdrawal history details
                const withdrawalHistory = yield withdrawalhistory_1.default.findOne({
                    where: { id: withdrawalHistoryId },
                    transaction,
                });
                if (!withdrawalHistory) {
                    throw new Error('Withdrawal history not found.');
                }
                // Finalize transfer with otp
                const paymentVerification = yield (0, paystack_service_1.finalizeTransfer)(withdrawalHistory.payoutReference, otp);
                if (!paymentVerification.status) {
                    throw new Error('Payment verification failed');
                }
                return { success: true, message: paymentVerification.message };
            }
            catch (error) {
                yield transaction.rollback();
                return { success: false, message: error.message };
            }
        });
    }
}
exports.default = WithdrawalService;
//# sourceMappingURL=withdrawal.service.js.map