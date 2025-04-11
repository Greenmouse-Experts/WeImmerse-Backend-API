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
const course_1 = __importDefault(require("../models/course"));
const courseenrollment_1 = __importDefault(require("../models/courseenrollment"));
const transaction_1 = __importDefault(require("../models/transaction"));
const transaction_2 = require("../models/transaction");
class CourseStatsService {
    /**
     * Get total number of courses
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
     * Get total number of enrollments
     * @param courseId - Optional filter by course
     * @param userId - Optional filter by user
     */
    static getCreatorTotalEnrollments(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (courseId)
                where.courseId = courseId;
            return yield courseenrollment_1.default.count({
                where,
                include: [{ model: course_1.default, where: { creatorId: userId }, as: 'course' }],
            });
        });
    }
    /**
     * Get total number of course transactions
     * @param courseId - Optional filter by course
     * @param userId - Optional filter by user
     * @param status - Optional filter by payment status
     */
    static getTotalCourseTransactions(courseId, userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                paymentType: transaction_2.ProductType.COURSE,
            };
            if (courseId)
                where.productId = courseId;
            if (userId)
                where.userId = userId;
            if (status)
                where.status = status;
            return yield transaction_1.default.count({ where });
        });
    }
    /**
     * Get total revenue from course transactions
     * @param courseId - Optional filter by course
     * @param userId - Optional filter by user
     * @param status - Optional filter by payment status
     */
    static getCourseRevenue(courseId, userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                paymentType: transaction_2.ProductType.COURSE,
            };
            if (courseId)
                where.productId = courseId;
            if (userId)
                where.userId = userId;
            if (status)
                where.status = status;
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
     * Get comprehensive course statistics
     */
    static getCourseStatistics(creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (creatorId)
                where.creatorId = creatorId;
            const [totalCourses, totalEnrollments, totalTransactions, totalRevenue] = yield Promise.all([
                this.getTotalCourses(creatorId),
                this.getCreatorTotalEnrollments(null, creatorId),
                this.getTotalCourseTransactions(null, creatorId, null),
                this.getCourseRevenue(null, creatorId, null),
            ]);
            return {
                totalCourses,
                totalEnrollments,
                totalTransactions,
                totalRevenue,
            };
        });
    }
}
exports.default = CourseStatsService;
//# sourceMappingURL=course-stats.service.js.map