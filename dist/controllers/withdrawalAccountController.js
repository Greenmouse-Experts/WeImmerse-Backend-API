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
exports.deleteWithdrawalAccount = exports.updateWithdrawalAccount = exports.getWithdrawalAccountById = exports.getWithdrawalAccounts = exports.createWithdrawalAccount = void 0;
const withdrawalaccount_1 = __importDefault(require("../models/withdrawalaccount"));
/**
 * Create withdrawal account
 * @param req
 * @param res
 * @returns
 */
const createWithdrawalAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Retrieve the authenticated user's ID
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { accountNumber } = req.body;
    try {
        // Check if account exists
        const accountExists = yield withdrawalaccount_1.default.findOne({
            where: { userId },
        });
        if (accountExists) {
            return res
                .status(409)
                .json({ status: false, message: 'Withdrawal account exists.' });
        }
        // Verify account with paystack
        const account = yield withdrawalaccount_1.default.create(Object.assign(Object.assign({}, req.body), { userId }));
        res.status(201).json({
            status: true,
            message: 'Withdrawal account created successfully.',
            data: account,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Error creating withdrawal account',
            error,
        });
    }
});
exports.createWithdrawalAccount = createWithdrawalAccount;
/**
 * Get withdrawal accounts
 * @param req
 * @param res
 */
const getWithdrawalAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accounts = yield withdrawalaccount_1.default.findAll();
        res.status(200).json({ status: true, data: accounts });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error fetching withdrawal accounts',
            error,
        });
    }
});
exports.getWithdrawalAccounts = getWithdrawalAccounts;
/**
 * Get withdrawal account details
 * @param req
 * @param res
 * @returns
 */
const getWithdrawalAccountById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield withdrawalaccount_1.default.findByPk(req.params.id);
        if (!account)
            return res
                .status(404)
                .json({ status: false, message: 'Account not found' });
        res.status(200).json({ status: true, data: account });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error fetching withdrawal account',
            error,
        });
    }
});
exports.getWithdrawalAccountById = getWithdrawalAccountById;
/**
 * Update withdrawal account
 * @param req
 * @param res
 * @returns
 */
const updateWithdrawalAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield withdrawalaccount_1.default.findByPk(req.params.id);
        if (!account)
            return res
                .status(404)
                .json({ status: true, message: 'Account not found' });
        yield account.update(req.body);
        res.status(200).json({
            status: true,
            message: 'Withdrawal account updated successfully.',
            account,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error updating withdrawal account',
            error,
        });
    }
});
exports.updateWithdrawalAccount = updateWithdrawalAccount;
/**
 * Delete withdrawal account
 * @param req
 * @param res
 * @returns
 */
const deleteWithdrawalAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield withdrawalaccount_1.default.findByPk(req.params.id);
        if (!account)
            return res.status(404).json({ message: 'Account not found' });
        yield account.destroy();
        res.status(200).send({
            status: true,
            message: 'Withdrawal account deleted successfully.',
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error deleting withdrawal account',
            error,
        });
    }
});
exports.deleteWithdrawalAccount = deleteWithdrawalAccount;
//# sourceMappingURL=withdrawalAccountController.js.map