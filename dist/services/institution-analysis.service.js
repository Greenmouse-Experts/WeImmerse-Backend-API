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
const sequelize_1 = require("sequelize");
const transaction_1 = __importDefault(require("../models/transaction"));
const helpers_1 = require("../utils/helpers");
class InstitutionAnalysis {
    getMonthlyPurchasesByProductType(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, year = new Date().getFullYear()) {
            var _a;
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59);
            // Build the where clause conditionally
            const where = {
                status: 'success',
                createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
                userId,
            };
            // if (userId) {
            //   where.metadata = { [Op.like]: `%${userId}%` };
            // }
            // Get all successful transactions for the year
            const transactions = yield transaction_1.default.findAll({
                where,
            });
            // Initialize results with proper numeric values
            const result = {
                totalRevenue: 0,
                courses: { revenue: 0, count: 0, topItems: [] },
                digitalAssets: { revenue: 0, count: 0, topItems: [] },
                physicalAssets: { revenue: 0, count: 0, topItems: [] },
                monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
                    month: i + 1,
                    coursesRevenue: 0,
                    digitalRevenue: 0,
                    physicalRevenue: 0,
                    totalRevenue: 0,
                    transactions: 0,
                })),
            };
            // Track top items with proper numeric values
            const courseRevenueMap = new Map();
            const digitalAssetRevenueMap = new Map();
            const physicalAssetRevenueMap = new Map();
            // Process each transaction with proper number handling
            for (const tx of transactions) {
                const amount = Number(tx.amount);
                const month = tx.createdAt.getMonth();
                // Update monthly trends by product type
                (_a = tx.metadata) === null || _a === void 0 ? void 0 : _a.items.forEach((details) => {
                    switch (details.productType) {
                        case 'course':
                            result.monthlyTrends[month].coursesRevenue += (0, helpers_1.parseFormattedAmount)(details === null || details === void 0 ? void 0 : details.price);
                            result.courses.revenue += (0, helpers_1.parseFormattedAmount)(details === null || details === void 0 ? void 0 : details.price);
                            result.courses.count += 1;
                            if (tx.productId) {
                                const current = courseRevenueMap.get(tx.productId) || 0;
                                courseRevenueMap.set(tx.productId, current + (0, helpers_1.parseFormattedAmount)(details === null || details === void 0 ? void 0 : details.price));
                            }
                            break;
                        case 'digital_asset':
                            result.monthlyTrends[month].digitalRevenue += (0, helpers_1.parseFormattedAmount)(details === null || details === void 0 ? void 0 : details.price);
                            result.digitalAssets.revenue += (0, helpers_1.parseFormattedAmount)(details === null || details === void 0 ? void 0 : details.price);
                            result.digitalAssets.count += 1;
                            if (tx.productId) {
                                const current = digitalAssetRevenueMap.get(tx.productId) || 0;
                                digitalAssetRevenueMap.set(tx.productId, current + (0, helpers_1.parseFormattedAmount)(details === null || details === void 0 ? void 0 : details.price));
                            }
                            break;
                        case 'physical_asset':
                            result.monthlyTrends[month].physicalRevenue += (0, helpers_1.parseFormattedAmount)(details === null || details === void 0 ? void 0 : details.price);
                            result.physicalAssets.revenue += (0, helpers_1.parseFormattedAmount)(details === null || details === void 0 ? void 0 : details.price);
                            result.physicalAssets.count += 1;
                            if (tx.productId) {
                                const current = physicalAssetRevenueMap.get(tx.productId) || 0;
                                physicalAssetRevenueMap.set(tx.productId, current + (0, helpers_1.parseFormattedAmount)(details === null || details === void 0 ? void 0 : details.price));
                            }
                            break;
                    }
                });
                // Update total monthly values
                result.monthlyTrends[month].totalRevenue += amount;
                result.monthlyTrends[month].transactions += 1;
                result.totalRevenue += amount;
            }
            return this.formatResults(result);
        });
    }
    formatResults(result) {
        return {
            totalRevenue: parseFloat(result.totalRevenue.toFixed(2)),
            courses: {
                revenue: parseFloat(result.courses.revenue.toFixed(2)),
                count: result.courses.count,
                topItems: this.sortAndLimit(result.courses.topItems),
            },
            digitalAssets: {
                revenue: parseFloat(result.digitalAssets.revenue.toFixed(2)),
                count: result.digitalAssets.count,
                topItems: this.sortAndLimit(result.digitalAssets.topItems),
            },
            physicalAssets: {
                revenue: parseFloat(result.physicalAssets.revenue.toFixed(2)),
                count: result.physicalAssets.count,
                topItems: this.sortAndLimit(result.physicalAssets.topItems),
            },
            monthlyTrends: result.monthlyTrends.map((month) => (Object.assign(Object.assign({}, month), { coursesRevenue: parseFloat(month.coursesRevenue.toFixed(2)), digitalRevenue: parseFloat(month.digitalRevenue.toFixed(2)), physicalRevenue: parseFloat(month.physicalRevenue.toFixed(2)), totalRevenue: parseFloat(month.totalRevenue.toFixed(2)) }))),
        };
    }
    sortAndLimit(items) {
        return items
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map((item) => (Object.assign(Object.assign({}, item), { revenue: parseFloat(item.revenue.toFixed(2)) })));
    }
    compiledForInstitution(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newAddedStudents, recentNotifications, purchaseAnalysis, expensesAnalysis,] = yield Promise.all([
                [],
                [],
                yield this.getMonthlyPurchasesByProductType(userId),
                [],
            ]);
            return {
                newAddedStudents,
                recentNotifications,
                purchaseAnalysis,
                expensesAnalysis,
            };
        });
    }
}
exports.default = new InstitutionAnalysis();
//# sourceMappingURL=institution-analysis.service.js.map