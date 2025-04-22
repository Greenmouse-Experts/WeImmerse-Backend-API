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
// services/student-analytics.service.ts
const sequelize_1 = require("sequelize");
const course_1 = __importDefault(require("../models/course"));
const courseenrollment_1 = __importDefault(require("../models/courseenrollment"));
const courseprogress_1 = __importDefault(require("../models/courseprogress"));
const lessonquiz_1 = __importDefault(require("../models/lessonquiz"));
const notification_1 = __importDefault(require("../models/notification")); // Assuming you have a Notification model
const user_1 = __importDefault(require("../models/user"));
const transaction_1 = __importStar(require("../models/transaction"));
const helpers_1 = require("../utils/helpers");
class StudentAnalyticsService {
    getStudentAnalytics(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Run all queries in parallel for better performance
            const [courseStats, continueCourses, notifications] = yield Promise.all([
                this.getCourseStats(studentId),
                this.getContinueCourses(studentId),
                this.getNotifications(studentId),
            ]);
            return {
                courseStats,
                continueCourses,
                notifications,
            };
        });
    }
    getCourseStats(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [all, ongoing, completed] = yield Promise.all([
                // All enrolled courses
                courseenrollment_1.default.count({
                    where: { userId: studentId },
                }),
                // Ongoing courses (progress < 100%)
                courseprogress_1.default.count({
                    where: { studentId: studentId, progressPercentage: { [sequelize_1.Op.lt]: 100 } },
                }),
                // Completed courses (progress = 100%)
                courseprogress_1.default.count({
                    where: {
                        studentId: studentId,
                        progressPercentage: 100,
                    },
                }),
            ]);
            return {
                ongoing,
                all,
                completed,
            };
        });
    }
    getContinueCourses(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = JSON.parse(JSON.stringify(yield courseenrollment_1.default.findAll({
                include: [
                    {
                        model: course_1.default,
                        as: 'course',
                        include: [
                            {
                                model: courseprogress_1.default,
                                as: 'progress',
                                attributes: ['completedLessons'],
                            },
                            {
                                model: user_1.default,
                                as: 'creator',
                            },
                        ],
                    },
                    {
                        model: user_1.default,
                        as: 'user',
                        attributes: ['name'],
                    },
                ],
                where: {
                    userId: studentId,
                    // '$course.$progress.progressPercentage$': { [Op.lt]: 100 },
                },
                order: [['createdAt', 'DESC']],
                // order: [['course.progress.lastAccessed', 'DESC']],
                limit: 3,
            })));
            return courses === null || courses === void 0 ? void 0 : courses.map((enrollment) => {
                var _a, _b, _c, _d, _e, _f, _g;
                return (Object.assign({ id: (_a = enrollment === null || enrollment === void 0 ? void 0 : enrollment.course) === null || _a === void 0 ? void 0 : _a.id, title: ((_b = enrollment === null || enrollment === void 0 ? void 0 : enrollment.course) === null || _b === void 0 ? void 0 : _b.title) || 'Untitled Course', chapter: `Chapter ${((_d = (_c = enrollment === null || enrollment === void 0 ? void 0 : enrollment.course) === null || _c === void 0 ? void 0 : _c.progress) === null || _d === void 0 ? void 0 : _d.completedLessons) || 0 + 1}`, tutor: ((_f = (_e = enrollment === null || enrollment === void 0 ? void 0 : enrollment.course) === null || _e === void 0 ? void 0 : _e.creator) === null || _f === void 0 ? void 0 : _f.name) || 'Unknown Tutor', creator_details: (_g = enrollment === null || enrollment === void 0 ? void 0 : enrollment.course) === null || _g === void 0 ? void 0 : _g.creator }, enrollment === null || enrollment === void 0 ? void 0 : enrollment.course));
            });
            // return [];
        });
    }
    getUpcomingAssessments(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get quizzes from courses the student is enrolled in
            const quizzes = yield lessonquiz_1.default.findAll({
                include: [
                    {
                        model: course_1.default,
                        as: 'course',
                        attributes: ['id', 'title'],
                        include: [
                            {
                                model: courseenrollment_1.default,
                                as: 'enrollments',
                                where: { userId: studentId },
                                // attributes: [],
                            },
                        ],
                    },
                ],
                where: {},
                // where: {
                //   dueDate: { [Op.gte]: new Date() },
                // },
                // order: [['dueDate', 'ASC']],
                limit: 5,
            });
            return quizzes.map((quiz) => {
                var _a;
                return ({
                    id: quiz.id,
                    title: ((_a = quiz.course) === null || _a === void 0 ? void 0 : _a.title) || 'Untitled Course',
                    // dueDate: quiz.dueDate,
                });
            });
        });
    }
    getStudyHours(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // This would depend on your study tracking implementation
            // Mock data based on screenshot
            return {
                study: 100,
                exams: 75,
            };
        });
    }
    getPointProgress(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // This would depend on your points system implementation
            // Mock data based on screenshot
            return {
                points: 8.966,
                message: 'You are doing well, Keep it up',
                trend: 'up',
            };
        });
    }
    getNotifications(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield notification_1.default.findAll({
                where: { userId: studentId },
                order: [['createdAt', 'DESC']],
                limit: 5,
            });
            return notifications.map((notification) => ({
                id: notification.id,
                message: notification.message,
                date: this.formatDate(notification.createdAt),
                read: notification.read,
            }));
        });
    }
    formatDate(date) {
        return date
            .toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
        })
            .replace(/\//g, '-');
    }
    // private async getMonthlyPurchasesByProductType(userId: string) {
    //   const transactions = await Transaction.findAll({
    //     attributes: [
    //       [
    //         Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')),
    //         'month',
    //       ],
    //       'paymentType',
    //       [Sequelize.fn('COUNT', Sequelize.col('id')), 'purchaseCount'],
    //     ],
    //     where: {
    //       userId,
    //       paymentType: {
    //         [Op.in]: [
    //           ProductType.COURSE,
    //           ProductType.DIGITAL_ASSET,
    //           ProductType.PHYSICAL_ASSET,
    //         ],
    //       },
    //       status: PaymentStatus.COMPLETED,
    //     },
    //     group: ['month', 'paymentType'],
    //     order: [['month', 'ASC']],
    //     raw: true,
    //   });
    //   return transactions;
    // }
    // private async getMonthlyPurchasesByProductType(userId: string) {
    //   const transactions = await Transaction.findAll({
    //     attributes: [
    //       [
    //         Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'),
    //         'month',
    //       ],
    //       'paymentType',
    //       [Sequelize.fn('COUNT', Sequelize.col('id')), 'purchaseCount'],
    //     ],
    //     where: {
    //       userId,
    //       paymentType: {
    //         [Op.in]: [
    //           ProductType.COURSE,
    //           ProductType.DIGITAL_ASSET,
    //           ProductType.PHYSICAL_ASSET,
    //         ],
    //       },
    //       status: PaymentStatus.COMPLETED,
    //     },
    //     group: [
    //       Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'),
    //       'paymentType',
    //     ],
    //     order: [
    //       [
    //         Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'),
    //         'ASC',
    //       ],
    //     ],
    //     raw: true,
    //   });
    //   return transactions;
    // }
    // private async getMonthlyPurchasesByProductType(
    //   userId: string,
    //   year: number = new Date().getFullYear()
    // ): Promise<{ [productType: string]: MonthlyPurchase[] }> {
    //   // Month names in order
    //   const monthNames = [
    //     'Jan',
    //     'Feb',
    //     'Mar',
    //     'Apr',
    //     'May',
    //     'Jun',
    //     'Jul',
    //     'Aug',
    //     'Sep',
    //     'Oct',
    //     'Nov',
    //     'Dec',
    //   ];
    //   // 1. Get the actual data from database
    //   const dbResults = await Transaction.findAll({
    //     attributes: [
    //       [fn('DATE_FORMAT', col('createdAt'), '%m'), 'monthNumber'], // Get month as '01', '02', etc.
    //       'paymentType',
    //       [fn('COUNT', col('id')), 'purchaseCount'],
    //     ],
    //     where: {
    //       userId,
    //       paymentType: {
    //         [Op.in]: [
    //           ProductType.COURSE,
    //           ProductType.DIGITAL_ASSET,
    //           ProductType.PHYSICAL_ASSET,
    //         ],
    //       },
    //       status: PaymentStatus.COMPLETED,
    //       createdAt: {
    //         [Op.between]: [
    //           new Date(`${year}-01-01`),
    //           new Date(`${year}-12-31 23:59:59`),
    //         ],
    //       },
    //     },
    //     group: ['paymentType', literal('DATE_FORMAT(createdAt, "%m")')],
    //     order: [
    //       ['paymentType', 'ASC'],
    //       [literal('monthNumber'), 'ASC'],
    //     ],
    //     raw: true,
    //   });
    //   // 2. Create complete month structure
    //   const allMonths = monthNames.map((month, index) => ({
    //     month,
    //     monthNumber: (index + 1).toString().padStart(2, '0'),
    //     purchaseCount: 0,
    //   }));
    //   // 3. Initialize result structure
    //   const result: { [key: string]: MonthlyPurchase[] } = {
    //     [ProductType.COURSE]: JSON.parse(JSON.stringify(allMonths)),
    //     [ProductType.DIGITAL_ASSET]: JSON.parse(JSON.stringify(allMonths)),
    //     [ProductType.PHYSICAL_ASSET]: JSON.parse(JSON.stringify(allMonths)),
    //   };
    //   // 4. Merge database results
    //   dbResults.forEach((row) => {
    //     const productType = row.paymentType as keyof typeof result;
    //     const monthIndex = parseInt(row.monthNumber, 10) - 1;
    //     if (monthIndex >= 0 && monthIndex < 12 && result[productType]) {
    //       result[productType][monthIndex].purchaseCount = parseInt(
    //         row.purchaseCount,
    //         10
    //       );
    //     }
    //   });
    //   return result;
    // }
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
    getLatestTransactions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield transaction_1.default.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
                limit: 10,
            });
            return transactions;
        });
    }
    getTotalPurchasesByProductType(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = (yield transaction_1.default.findAll({
                attributes: ['paymentType', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'total']],
                where: {
                    userId,
                    status: transaction_1.PaymentStatus.COMPLETED,
                    paymentType: {
                        [sequelize_1.Op.in]: [
                            transaction_1.ProductType.COURSE,
                            transaction_1.ProductType.DIGITAL_ASSET,
                            transaction_1.ProductType.PHYSICAL_ASSET,
                        ],
                    },
                },
                group: ['paymentType'],
                raw: true,
            }));
            // Initialize summary with all possible product types
            const summary = {
                course: 0,
                digital_asset: 0,
                physical_asset: 0,
            };
            // Type the row parameter properly
            results.forEach((row) => {
                summary[row.paymentType] = parseInt(row.total, 10);
            });
            return summary;
        });
    }
    compiledForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [ongoingCourses, latestCourses, monthlyPurchases, latestTrx, totalPurchasesByType,] = yield Promise.all([
                yield this.getContinueCourses(userId),
                yield this.getNotifications(userId),
                yield this.getMonthlyPurchasesByProductType(userId),
                yield this.getLatestTransactions(userId),
                yield this.getTotalPurchasesByProductType(userId),
            ]);
            return {
                ongoingCourses,
                latestCourses,
                monthlyPurchases,
                latestTrx,
                totalPurchasesByType,
            };
        });
    }
}
exports.default = new StudentAnalyticsService();
//# sourceMappingURL=student-analysis.service.js.map