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
// services/analysis.service.ts
const sequelize_1 = require("sequelize");
const transaction_1 = __importDefault(require("../models/transaction"));
const course_1 = __importDefault(require("../models/course"));
const digitalasset_1 = __importDefault(require("../models/digitalasset"));
const physicalasset_1 = __importDefault(require("../models/physicalasset"));
const subscription_1 = __importDefault(require("../models/subscription"));
const subscriptionplan_1 = __importDefault(require("../models/subscriptionplan"));
const user_1 = __importDefault(require("../models/user"));
class AdminAnalysisService {
    getYearlyAnalysis(year, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59);
            // Build the where clause conditionally
            const where = {
                status: 'success',
                createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
            };
            if (userId) {
                where.metadata = { [sequelize_1.Op.like]: `%${userId}%` };
            }
            // Get all successful transactions for the year
            const transactions = yield transaction_1.default.findAll({
                where,
                include: [
                    {
                        model: subscription_1.default,
                        as: 'subscription',
                        required: false,
                        include: [{ model: subscriptionplan_1.default, as: 'plan' }],
                    },
                ],
            });
            // Initialize results with proper numeric values
            const result = {
                totalRevenue: 0,
                courses: { revenue: 0, count: 0, topItems: [] },
                digitalAssets: { revenue: 0, count: 0, topItems: [] },
                physicalAssets: { revenue: 0, count: 0, topItems: [] },
                subscriptions: { revenue: 0, count: 0, topItems: [] }, // Initialize subscriptions
                monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
                    month: i + 1,
                    coursesRevenue: 0,
                    digitalRevenue: 0,
                    physicalRevenue: 0,
                    subscriptionRevenue: 0, // Initialize subscription revenue
                    totalRevenue: 0,
                    transactions: 0,
                })),
            };
            // Track top items with proper numeric values
            const courseRevenueMap = new Map();
            const digitalAssetRevenueMap = new Map();
            const physicalAssetRevenueMap = new Map();
            const subscriptionRevenueMap = new Map();
            // Process each transaction with proper number handling
            for (const tx of transactions) {
                const amount = Number(tx.amount);
                const month = tx.createdAt.getMonth();
                // Update monthly trends by product type
                switch (tx.paymentType) {
                    case 'course':
                        result.monthlyTrends[month].coursesRevenue += amount;
                        result.courses.revenue += amount;
                        result.courses.count += 1;
                        if (tx.productId) {
                            const current = courseRevenueMap.get(tx.productId) || 0;
                            courseRevenueMap.set(tx.productId, current + amount);
                        }
                        break;
                    case 'digital_asset':
                        result.monthlyTrends[month].digitalRevenue += amount;
                        result.digitalAssets.revenue += amount;
                        result.digitalAssets.count += 1;
                        if (tx.productId) {
                            const current = digitalAssetRevenueMap.get(tx.productId) || 0;
                            digitalAssetRevenueMap.set(tx.productId, current + amount);
                        }
                        break;
                    case 'physical_asset':
                        result.monthlyTrends[month].physicalRevenue += amount;
                        result.physicalAssets.revenue += amount;
                        result.physicalAssets.count += 1;
                        if (tx.productId) {
                            const current = physicalAssetRevenueMap.get(tx.productId) || 0;
                            physicalAssetRevenueMap.set(tx.productId, current + amount);
                        }
                        break;
                    case 'subscription':
                        result.monthlyTrends[month].subscriptionRevenue += amount;
                        result.subscriptions.revenue += amount;
                        result.subscriptions.count += 1;
                        if (tx.subscriptionId && (tx === null || tx === void 0 ? void 0 : tx.subscription)) {
                            const current = subscriptionRevenueMap.get(tx.subscriptionId) || {
                                revenue: 0,
                                name: ((_a = tx === null || tx === void 0 ? void 0 : tx.subscription.plan) === null || _a === void 0 ? void 0 : _a.name) || 'Unnamed Plan',
                            };
                            subscriptionRevenueMap.set(tx.subscriptionId, {
                                revenue: current.revenue + amount,
                                name: current.name,
                            });
                        }
                        break;
                }
                // Update total monthly values
                result.monthlyTrends[month].totalRevenue += amount;
                result.monthlyTrends[month].transactions += 1;
                result.totalRevenue += amount;
            }
            // Get names and additional fields for top items
            result.courses.topItems = yield this.getTopItems(courseRevenueMap, course_1.default, [
                'title',
                'image',
            ]);
            result.digitalAssets.topItems = yield this.getTopItems(digitalAssetRevenueMap, digitalasset_1.default, ['assetName', 'assetUpload', 'assetThumbnail']);
            result.physicalAssets.topItems = yield this.getTopItems(physicalAssetRevenueMap, physicalasset_1.default, ['assetName', 'assetUpload', 'assetThumbnail']);
            // Process subscription top items
            result.subscriptions.topItems = Array.from(subscriptionRevenueMap.entries()).map(([id, { revenue, name }]) => ({
                id,
                name,
                revenue,
            }));
            // Format all numbers
            return this.formatResults(result);
        });
    }
    getTopItems(revenueMap, model, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            if (revenueMap.size === 0)
                return [];
            const items = yield model.findAll({
                where: { id: Array.from(revenueMap.keys()) },
                attributes: ['id', ...fields],
            });
            // Get the name field (first field in the array)
            const nameField = fields[0];
            return items.map((item) => (Object.assign(Object.assign(Object.assign({ id: item.id, name: item[nameField] || 'Untitled', revenue: revenueMap.get(item.id) || 0 }, (fields.includes('image') && { image: item.image })), (fields.includes('assetUpload') && { assetUpload: item.assetUpload })), (fields.includes('assetThumbnail') && {
                assetThumbnail: item.assetThumbnail,
            }))));
        });
    }
    sortAndLimit(items) {
        return items
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map((item) => (Object.assign(Object.assign({}, item), { revenue: parseFloat(item.revenue.toFixed(2)) })));
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
            subscriptions: {
                revenue: parseFloat(result.subscriptions.revenue.toFixed(2)),
                count: result.subscriptions.count,
                topItems: this.sortAndLimit(result.subscriptions.topItems),
            },
            monthlyTrends: result.monthlyTrends.map((month) => (Object.assign(Object.assign({}, month), { coursesRevenue: parseFloat(month.coursesRevenue.toFixed(2)), digitalRevenue: parseFloat(month.digitalRevenue.toFixed(2)), physicalRevenue: parseFloat(month.physicalRevenue.toFixed(2)), subscriptionRevenue: parseFloat(month.subscriptionRevenue.toFixed(2)), totalRevenue: parseFloat(month.totalRevenue.toFixed(2)) }))),
        };
    }
    getRecentSignups(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            const limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 10; // Default to 10 recent signups
            // Add user type filter if provided
            if (filters === null || filters === void 0 ? void 0 : filters.userType) {
                where.accountType = filters.userType;
            }
            const users = yield user_1.default.findAll({
                where,
                order: [['createdAt', 'DESC']], // Get newest first
                limit,
                attributes: [
                    'id',
                    'name',
                    'email',
                    'accountType',
                    'createdAt',
                    'lastLogin',
                ],
            });
            return users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                type: user.accountType,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
            }));
        });
    }
    getUserStats() {
        return __awaiter(this, void 0, void 0, function* () {
            // Run all counts in parallel
            const [totalUsers, totalStudents, totalCreators, totalInstitutions] = yield Promise.all([
                user_1.default.count({ where: { accountType: 'user' } }),
                user_1.default.count({ where: { accountType: 'student' } }),
                user_1.default.count({ where: { accountType: 'creator' } }),
                user_1.default.count({ where: { accountType: 'institution' } }),
            ]);
            return {
                totalUsers,
                totalStudents,
                totalCreators,
                totalInstitutions,
            };
        });
    }
}
exports.default = new AdminAnalysisService();
//# sourceMappingURL=admin-analysis.service.js.map