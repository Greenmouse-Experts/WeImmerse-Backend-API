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
const sequelize_1 = require("sequelize");
const course_1 = __importStar(require("../models/course"));
const courseenrollment_1 = __importDefault(require("../models/courseenrollment"));
const transaction_1 = __importStar(require("../models/transaction"));
const transaction_2 = require("../models/transaction");
class UserStatsService {
    /**
     * Get total number of courses with filtering options
     * @param creatorId - Optional filter by creator
     * @param status - Optional filter by status
     */
    static getTotalCourses(creatorId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (creatorId)
                where.creatorId = creatorId;
            if (status)
                where.status = status;
            return yield course_1.default.count({ where });
        });
    }
    /**
     * Get all courses with optional filtering
     * @param creatorId - Optional filter by creator
     * @param status - Optional filter by status
     * @param limit - Optional limit for pagination
     * @param offset - Optional offset for pagination
     */
    static getAllCourses(creatorId, status, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (creatorId)
                where.creatorId = creatorId;
            if (status)
                where.status = status;
            const options = { where };
            if (limit)
                options.limit = limit;
            if (offset)
                options.offset = offset;
            return yield course_1.default.findAll(options);
        });
    }
    /**
     * Get ongoing (live) courses
     * @param creatorId - Optional filter by creator
     * @param limit - Optional limit for pagination
     * @param offset - Optional offset for pagination
     */
    static getOngoingCourses(userId, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (userId)
                where.userId = userId;
            const options = { where };
            if (limit)
                options.limit = limit;
            if (offset)
                options.offset = offset;
            return yield courseenrollment_1.default.findAll(options);
        });
    }
    /**
     * Get total number of enrollments
     * @param courseId - Optional filter by course
     * @param userId - Optional filter by user
     */
    static getTotalEnrollments(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (courseId)
                where.courseId = courseId;
            if (userId)
                where.userId = userId;
            return yield courseenrollment_1.default.count({ where });
        });
    }
    /**
     * Get creator-specific total enrollments
     * @param courseId - Optional filter by course
     * @param userId - Creator ID to filter by
     */
    static getCreatorTotalEnrollments(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (userId)
                where.userId = userId;
            return yield courseenrollment_1.default.count({
                where,
            });
        });
    }
    /**
     * Get total asset transactions with filtering options
     * @param userId - Optional filter by user
     * @param status - Optional filter by payment status
     */
    static getAssetTransactions(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                [sequelize_1.Op.or]: [
                    { paymentType: transaction_1.PaymentType.DIGITAL_ASSET },
                    { paymentType: transaction_1.PaymentType.PHYSICAL_ASSET },
                ],
                userId,
                status,
            };
            return yield transaction_1.default.count({ where });
        });
    }
    /**
     * Get total revenue with filtering options
     * @param productId - Optional filter by product
     * @param userId - Optional filter by user
     * @param status - Optional filter by payment status
     * @param paymentType - Optional filter by payment type
     */
    static getTotalRevenue(productId, userId, status, paymentType) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (productId)
                where.productId = productId;
            if (userId)
                where.userId = userId;
            if (status)
                where.status = status;
            if (paymentType)
                where.paymentType = paymentType;
            const result = (yield transaction_1.default.findOne({
                where,
                attributes: [
                    [sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('amount')), 'totalRevenue'],
                ],
                raw: true,
            }));
            return parseFloat((result === null || result === void 0 ? void 0 : result.totalRevenue) || '0');
        });
    }
    /**
     * Get total spend by a user
     * @param userId - User ID to filter by
     * @param status - Optional filter by payment status (defaults to completed)
     */
    static getTotalSpend(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, status = transaction_2.PaymentStatus.COMPLETED) {
            const where = {
                userId,
                status,
            };
            const result = (yield transaction_1.default.findOne({
                where,
                attributes: [
                    [sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('amount')), 'totalSpend'],
                ],
                raw: true,
            }));
            return parseFloat((result === null || result === void 0 ? void 0 : result.totalSpend) || '0');
        });
    }
    /**
     * Get purchased assets by a user
     * @param userId - User ID to filter by
     * @param status - Optional filter by payment status (defaults to completed)
     * @param limit - Optional limit for pagination
     * @param offset - Optional offset for pagination
     */
    static getPurchasedAssets(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, status = transaction_2.PaymentStatus.COMPLETED, limit, offset) {
            const where = {
                userId,
                status,
                paymentType: {
                    [sequelize_1.Op.in]: [
                        transaction_2.ProductType.DIGITAL_ASSET,
                        transaction_2.ProductType.PHYSICAL_ASSET,
                        transaction_2.ProductType.COURSE,
                    ],
                },
            };
            const options = { where };
            if (limit)
                options.limit = limit;
            if (offset)
                options.offset = offset;
            return yield transaction_1.default.findAll(options);
        });
    }
    /**
     * Get statistics for a user
     */
    static getStatistics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (userId)
                where.userId = userId;
            const [totalCourses, ongoingCourses, totalTransactions, totalSpends] = yield Promise.all([
                this.getTotalCourses(null, course_1.CourseStatus.LIVE),
                this.getOngoingCourses(userId),
                this.getAssetTransactions(userId, transaction_2.PaymentStatus.COMPLETED),
                this.getTotalSpend(userId, transaction_2.PaymentStatus.COMPLETED),
            ]);
            return {
                totalCourses,
                ongoingCourses: ongoingCourses.length,
                totalTransactions,
                totalSpends,
            };
        });
    }
    /**
     * Get comprehensive user statistics
     */
    static getUserStatistics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [purchasedAssets, totalSpend, enrolledCourses] = yield Promise.all([
                this.getPurchasedAssets(userId),
                this.getTotalSpend(userId),
                this.getTotalEnrollments(null, userId),
            ]);
            return {
                purchasedAssets: purchasedAssets.length,
                totalSpend,
                enrolledCourses,
            };
        });
    }
    // Helper methods for backward compatibility
    static getTotalCreatorTransactions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // return this.getTotalTransactions(userId, PaymentStatus.COMPLETED);
        });
    }
    static getCourseRevenue(courseId, userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getTotalRevenue(courseId, userId, status || undefined, transaction_2.ProductType.COURSE);
        });
    }
}
exports.default = UserStatsService;
//# sourceMappingURL=user-stats.service.js.map