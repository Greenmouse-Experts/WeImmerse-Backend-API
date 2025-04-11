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
// services/admin-stats.service.ts
const sequelize_1 = require("sequelize");
const transaction_1 = __importDefault(require("../models/transaction"));
const user_1 = __importDefault(require("../models/user"));
const subscription_1 = __importDefault(require("../models/subscription"));
class AdminStatsService {
    getAdminStats(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59);
            // Get all data in parallel
            const [totalUsers, totalIncome, totalActiveUsers, totalSubscriptions, monthlyTrends,] = yield Promise.all([
                this.getTotalUsers(),
                this.getTotalIncome(),
                this.getTotalActiveUsers(),
                this.getTotalSubscriptions(),
                this.getMonthlyTrends(startDate, endDate),
            ]);
            return {
                totalUsers,
                totalIncome,
                totalActiveUsers,
                totalSubscriptions,
                monthlyTrends,
            };
        });
    }
    getTotalUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.default.count();
        });
    }
    getTotalIncome() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield transaction_1.default.findOne({
                where: { status: 'success' },
                attributes: [
                    [sequelize_1.Sequelize.fn('sum', sequelize_1.Sequelize.col('amount')), 'totalAmount'],
                ],
                raw: true,
            }));
            return parseFloat((result === null || result === void 0 ? void 0 : result.totalAmount) || '0');
        });
    }
    getTotalActiveUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            // Active users are those who logged in within the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return user_1.default.count({
                where: {
                    lastLogin: { [sequelize_1.Op.gte]: thirtyDaysAgo },
                },
            });
        });
    }
    getTotalSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            return subscription_1.default.count({
                where: {
                    status: 'active',
                },
            });
        });
    }
    getMonthlyTrends(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize monthly trends array
            const monthlyTrends = Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                newUsers: 0,
                income: 0,
                newSubscriptions: 0,
            }));
            // Get monthly user counts
            const monthlyUsers = yield user_1.default.findAll({
                attributes: [
                    [sequelize_1.Sequelize.fn('MONTH', sequelize_1.Sequelize.col('createdAt')), 'month'],
                    [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'count'],
                ],
                where: {
                    createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
                },
                group: ['month'],
                raw: true,
            });
            // Get monthly income
            const monthlyIncome = yield transaction_1.default.findAll({
                attributes: [
                    [sequelize_1.Sequelize.fn('MONTH', sequelize_1.Sequelize.col('createdAt')), 'month'],
                    [sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('amount')), 'amount'],
                ],
                where: {
                    status: 'success',
                    createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
                },
                group: ['month'],
                raw: true,
            });
            // Get monthly subscription counts
            const monthlySubscriptions = yield subscription_1.default.findAll({
                attributes: [
                    [sequelize_1.Sequelize.fn('MONTH', sequelize_1.Sequelize.col('createdAt')), 'month'],
                    [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'count'],
                ],
                where: {
                    status: 'active',
                    createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
                },
                group: ['month'],
                raw: true,
            });
            // Populate monthly trends
            monthlyUsers.forEach(({ month, count }) => {
                const index = month - 1;
                if (index >= 0 && index < 12) {
                    monthlyTrends[index].newUsers = parseInt(count) || 0;
                }
            });
            monthlyIncome.forEach(({ month, amount }) => {
                const index = month - 1;
                if (index >= 0 && index < 12) {
                    monthlyTrends[index].income = parseFloat(amount) || 0;
                }
            });
            monthlySubscriptions.forEach(({ month, count }) => {
                const index = month - 1;
                if (index >= 0 && index < 12) {
                    monthlyTrends[index].newSubscriptions = parseInt(count) || 0;
                }
            });
            return monthlyTrends;
        });
    }
}
exports.default = new AdminStatsService();
//# sourceMappingURL=admin-stats.service.js.map