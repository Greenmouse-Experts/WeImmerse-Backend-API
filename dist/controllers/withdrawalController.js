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
exports.finalizeWithdrawal = exports.approveWithdrawal = exports.fetchWithdrawalRequests = exports.requestWithdrawal = exports.deleteWithdrawalAccount = exports.updateWithdrawalAccount = exports.getWithdrawalAccountById = exports.getWithdrawalAccounts = exports.createWithdrawalAccount = void 0;
const withdrawalaccount_1 = __importDefault(require("../models/withdrawalaccount"));
const paystack_service_1 = require("../services/paystack.service");
const wallet_1 = __importDefault(require("../models/wallet"));
const wallet_service_1 = __importDefault(require("../services/wallet.service"));
const withdrawal_service_1 = __importDefault(require("../services/withdrawal.service"));
const sequelize_service_1 = __importDefault(require("../services/sequelize.service"));
const user_1 = __importDefault(require("../models/user"));
const helpers_1 = require("../utils/helpers");
const withdrawalrequest_1 = __importDefault(require("../models/withdrawalrequest"));
const messages_1 = require("../utils/messages");
const mail_service_1 = require("../services/mail.service");
const logger_1 = __importDefault(require("../middlewares/logger"));
/**
 * Create withdrawal account
 * @param req
 * @param res
 * @returns
 */
const createWithdrawalAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // Retrieve the authenticated user's ID
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { accountNumber, bankCode } = req.body;
    const transaction = yield ((_b = sequelize_service_1.default.connection) === null || _b === void 0 ? void 0 : _b.transaction());
    try {
        // Check if account exists
        const accountExists = yield withdrawalaccount_1.default.findOne({
            where: { userId },
            transaction,
        });
        if (accountExists) {
            return res
                .status(409)
                .json({ status: false, message: 'Withdrawal account exists.' });
        }
        // Verify account with paystack
        const verifiedAccount = yield (0, paystack_service_1.verifyBankAccount)(accountNumber, bankCode);
        const account = JSON.parse(JSON.stringify(yield withdrawalaccount_1.default.create(Object.assign(Object.assign({}, req.body), { userId, accountName: verifiedAccount.account_name }), { transaction })));
        // Create a wallet for user if not existent
        yield wallet_service_1.default.createWallet(userId);
        transaction === null || transaction === void 0 ? void 0 : transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Withdrawal account created successfully.',
            data: Object.assign(Object.assign({}, account), { verifiedAccount }),
        });
    }
    catch (error) {
        res.status(((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500).json({
            status: false,
            message: error.message,
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
// Request
const requestWithdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = req.user;
        const { id: userId, name, email } = user;
        const { amount, currency, paymentProvider } = req.body;
        // Check if withdrawal threshold is reached
        if (amount < ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.WITHDRAWAL_THRESHOLD_NGN)) {
            throw new Error(`Withdrawal threshold amount of ${(0, helpers_1.formatMoney)(+((_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b.WITHDRAWAL_THRESHOLD_NGN), currency)} not reached.`);
        }
        // Get wallet
        const wallet = yield wallet_1.default.findOne({
            where: { userId, currency },
        });
        if (!wallet)
            throw new Error('Wallet not found');
        if (wallet.balance < amount)
            throw new Error('Insufficient balance');
        // Get withdrawal account details
        const withdrawalAccount = yield withdrawalaccount_1.default.findOne({
            where: { userId },
            include: [{ model: user_1.default, as: 'user' }],
        });
        let recipientCode = '';
        // If recipientCode is not provided, create a new recipient in Paystack
        if (paymentProvider.toLowerCase() === 'paystack') {
            if (!withdrawalAccount) {
                throw new Error('Bank details are required to create a Paystack recipient');
            }
            recipientCode = yield (0, paystack_service_1.createTransferRecipient)(name, email, withdrawalAccount.accountNumber, withdrawalAccount.bankCode);
        }
        const result = yield withdrawal_service_1.default.requestWithdrawal(userId, amount, currency, paymentProvider, recipientCode);
        if (!result.success)
            return res.status(400).json({ error: result.message });
        // Deduct fund from wallet
        yield wallet_service_1.default.deductWallet(userId, amount, currency);
        // Send email to admin
        const message = messages_1.emailTemplates.withdrawalRequestEmail(user, result.withdrawalRequest);
        try {
            yield (0, mail_service_1.sendMail)(process.env.ADMIN_EMAIL, `${process.env.APP_NAME} - Withdrawal Request Notification`, message);
        }
        catch (emailError) {
            logger_1.default.error('Error sending email:', emailError); // Log error for internal use
        }
        res.json({
            status: true,
            message: 'Withdrawal request created successfully.',
            data: result.withdrawalRequest,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            message: error.message,
        });
    }
});
exports.requestWithdrawal = requestWithdrawal;
/**
 * Fetch withdrawal requests
 * @param req
 * @param res
 * @returns
 */
const fetchWithdrawalRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const transaction = await sequelizeService.connection!.transaction();
    const whereCondition = {};
    const { page, limit, offset } = (0, helpers_1.getPaginationFields)(req.query.page, req.query.limit);
    const { rows: withdrawalRequest, count: totalItems } = yield withdrawalrequest_1.default.findAndCountAll({
        where: whereCondition,
        include: [
            {
                model: user_1.default,
                as: 'user',
            },
            // Adjust alias to match your associations
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
    });
    // Calculate pagination metadata
    const totalPages = (0, helpers_1.getTotalPages)(totalItems, limit);
    // Respond with the paginated jobs and metadata
    return res.status(200).json({
        message: 'Withdrawal requests retrieved successfully.',
        data: withdrawalRequest,
        meta: {
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
        },
    });
});
exports.fetchWithdrawalRequests = fetchWithdrawalRequests;
// Approve
const approveWithdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id: adminId } = req.admin;
    const { requestId, approve } = req.body;
    const transaction = yield sequelize_service_1.default.connection.transaction();
    const result = yield withdrawal_service_1.default.approveWithdrawal(adminId, requestId, approve, transaction);
    if (!result.success)
        return res.status(400).json({ status: false, message: result.message });
    // Send email to notify
    const message = messages_1.emailTemplates.withdrawalRequestVettingEmail(((_a = result.data) === null || _a === void 0 ? void 0 : _a.withdrawalRequest)['user'], (_b = result.data) === null || _b === void 0 ? void 0 : _b.withdrawalRequest);
    try {
        yield (0, mail_service_1.sendMail)(((_c = result.data) === null || _c === void 0 ? void 0 : _c.withdrawalRequest)['user'].email, `${process.env.APP_NAME} - Withdrawal Request Notification`, message);
    }
    catch (emailError) {
        logger_1.default.error('Error sending email:', emailError); // Log error for internal use
    }
    yield transaction.commit();
    res.json(result);
});
exports.approveWithdrawal = approveWithdrawal;
/**
 * Finalize withdrawal
 * @param req
 * @param res
 * @returns
 */
const finalizeWithdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: adminId } = req.admin;
    const { withdrawalHistoryId, otp } = req.body;
    const transaction = yield sequelize_service_1.default.connection.transaction();
    try {
        const result = yield withdrawal_service_1.default.finalizeWithdrawal(adminId, withdrawalHistoryId, otp, transaction);
        // Send email to user concerned - creator or instructor
        const withdrawalHistory = result.data;
        // Send email to notify
        const message = messages_1.emailTemplates.withdrawalSuccessEmail(withdrawalHistory);
        try {
            yield (0, mail_service_1.sendMail)(withdrawalHistory.user.email, `${process.env.APP_NAME} - Your Wallet Has Been Credited!`, message);
        }
        catch (emailError) {
            logger_1.default.error('Error sending email:', emailError); // Log error for internal use
        }
        if (!result.success)
            return res.status(400).json({ status: false, message: result.message });
        yield transaction.commit();
        res.json(result);
    }
    catch (error) {
        yield transaction.rollback();
        return res.status(400).json({
            status: false,
            message: error.message,
        });
    }
});
exports.finalizeWithdrawal = finalizeWithdrawal;
//# sourceMappingURL=withdrawalController.js.map