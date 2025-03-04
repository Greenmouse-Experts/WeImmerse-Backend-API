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
const wallet_1 = __importDefault(require("../models/wallet"));
const { sequelize } = require('../config/database.js'); // Ensure this points to your Sequelize instance
const sequelize_service_1 = __importDefault(require("./sequelize.service"));
class WalletService {
    /**
     * Create a wallet for a user
     * @param userId - The user's ID
     * @returns The created wallet
     */
    static createWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletExists = yield wallet_1.default.findOne({ where: { userId } });
                if (walletExists) {
                    return;
                }
                const wallet = yield wallet_1.default.create({ userId });
                return wallet;
            }
            catch (error) {
                throw new Error(`Wallet creation failed: ${error.message}`);
            }
        });
    }
    /**
     * Top up a user's wallet balance
     * @param userId - The user's ID
     * @param amount - The amount to top up
     * @returns The updated wallet
     */
    static topUpWallet(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount <= 0) {
                throw new Error('Top-up amount must be greater than zero.');
            }
            return yield sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const wallet = yield wallet_1.default.findOne({
                    where: { userId },
                    transaction: t,
                });
                if (!wallet) {
                    throw new Error('Wallet not found.');
                }
                wallet.previousBalance = wallet.balance;
                wallet.balance = wallet.balance + amount;
                yield wallet.save({ transaction: t });
                return wallet;
            }));
        });
    }
    /**
     * Deduct funds from a user's wallet
     * @param userId - The user's ID
     * @param amount - The amount to deduct
     * @returns The updated wallet
     */
    static deductWallet(userId, amount, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (amount <= 0) {
                throw new Error('Deduction amount must be greater than zero.');
            }
            yield ((_a = sequelize_service_1.default.connection) === null || _a === void 0 ? void 0 : _a.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const wallet = yield wallet_1.default.findOne({
                    where: { userId, currency },
                    transaction: t,
                });
                if (!wallet) {
                    throw new Error('Wallet not found.');
                }
                if (wallet.balance < amount) {
                    throw new Error('Insufficient wallet balance.');
                }
                wallet.previousBalance = wallet.balance;
                wallet.balance = wallet.balance - amount;
                yield wallet.save({ transaction: t });
                return wallet;
            })));
        });
    }
    /**
     * Get current balance
     * @param userId
     * @param currency
     * @returns
     */
    static getCurrentBalance(userId, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = yield wallet_1.default.findOne({ where: { userId, currency } });
                if (!wallet)
                    throw new Error('Wallet not found');
                return wallet;
            }
            catch (error) {
                return { status: false, message: error.message };
            }
        });
    }
}
exports.default = WalletService;
//# sourceMappingURL=wallet.service.js.map