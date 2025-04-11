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
class AnalysisService {
    getYearlyAnalysis(year, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59);
            // Get all successful transactions for the year
            const transactions = yield transaction_1.default.findAll({
                where: {
                    metadata: { [sequelize_1.Op.like]: `%${userId}%` },
                    status: 'success',
                    createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
                },
            });
            // Initialize results with proper numeric values
            const result = {
                totalRevenue: 0,
                courses: { revenue: 0, count: 0, topCourses: [] },
                digitalAssets: { revenue: 0, count: 0, topAssets: [] },
                physicalAssets: { revenue: 0, count: 0, topAssets: [] },
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
                const amount = Number(tx.amount); // Ensure we're working with numbers
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
                }
                // Update total monthly values
                result.monthlyTrends[month].totalRevenue += amount;
                result.monthlyTrends[month].transactions += 1;
                result.totalRevenue += amount;
            }
            // Get names for top items
            result.courses.topCourses = yield this.getTopItems(courseRevenueMap, course_1.default, 'title');
            result.digitalAssets.topAssets = yield this.getTopItems(digitalAssetRevenueMap, digitalasset_1.default, 'assetName');
            result.physicalAssets.topAssets = yield this.getTopItems(physicalAssetRevenueMap, physicalasset_1.default, 'assetName');
            // Sort and limit top items
            result.courses.topCourses = this.sortAndLimit(result.courses.topCourses);
            result.digitalAssets.topAssets = this.sortAndLimit(result.digitalAssets.topAssets);
            result.physicalAssets.topAssets = this.sortAndLimit(result.physicalAssets.topAssets);
            // Format all numbers to 2 decimal places
            return this.formatNumbers(result);
        });
    }
    getTopItems(revenueMap, model, nameField) {
        return __awaiter(this, void 0, void 0, function* () {
            if (revenueMap.size === 0)
                return [];
            const items = yield model.findAll({
                where: { id: Array.from(revenueMap.keys()) },
                attributes: ['id', nameField],
            });
            return items.map((item) => ({
                id: item.id,
                name: item[nameField] || 'Untitled',
                revenue: revenueMap.get(item.id) || 0,
            }));
        });
    }
    sortAndLimit(items) {
        return items
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map((item) => (Object.assign(Object.assign({}, item), { revenue: parseFloat(item.revenue.toFixed(2)) })));
    }
    formatNumbers(result) {
        return Object.assign(Object.assign({}, result), { totalRevenue: parseFloat(result.totalRevenue.toFixed(2)), courses: Object.assign(Object.assign({}, result.courses), { revenue: parseFloat(result.courses.revenue.toFixed(2)), topCourses: result.courses.topCourses.map((c) => (Object.assign(Object.assign({}, c), { revenue: parseFloat(c.revenue.toFixed(2)) }))) }), digitalAssets: Object.assign(Object.assign({}, result.digitalAssets), { revenue: parseFloat(result.digitalAssets.revenue.toFixed(2)), topAssets: result.digitalAssets.topAssets.map((a) => (Object.assign(Object.assign({}, a), { revenue: parseFloat(a.revenue.toFixed(2)) }))) }), physicalAssets: Object.assign(Object.assign({}, result.physicalAssets), { revenue: parseFloat(result.physicalAssets.revenue.toFixed(2)), topAssets: result.physicalAssets.topAssets.map((a) => (Object.assign(Object.assign({}, a), { revenue: parseFloat(a.revenue.toFixed(2)) }))) }), monthlyTrends: result.monthlyTrends.map((month) => (Object.assign(Object.assign({}, month), { coursesRevenue: parseFloat(month.coursesRevenue.toFixed(2)), digitalRevenue: parseFloat(month.digitalRevenue.toFixed(2)), physicalRevenue: parseFloat(month.physicalRevenue.toFixed(2)), totalRevenue: parseFloat(month.totalRevenue.toFixed(2)) }))) });
    }
}
exports.default = new AnalysisService();
//# sourceMappingURL=analysis.service.js.map