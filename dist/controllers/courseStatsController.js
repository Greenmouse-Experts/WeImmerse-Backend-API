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
exports.getCourseTransactions = exports.getCourseEnrollments = exports.getCourseStatistics = void 0;
const course_stats_service_1 = __importDefault(require("../services/course-stats.service"));
const logger_1 = __importDefault(require("../middlewares/logger"));
const getCourseStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const creatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming authenticated user is the creator
        const stats = yield course_stats_service_1.default.getCourseStatistics(creatorId);
        res.status(200).json({
            status: true,
            message: 'Course statistics retrieved successfully',
            data: stats,
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching course statistics:', error);
        res.status(500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
});
exports.getCourseStatistics = getCourseStatistics;
const getCourseEnrollments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const totalEnrollments = yield course_stats_service_1.default.getTotalEnrollments(courseId);
        res.status(200).json({
            status: true,
            message: 'Course enrollments retrieved successfully',
            data: { totalEnrollments },
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching course enrollments:', error);
        res.status(500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
});
exports.getCourseEnrollments = getCourseEnrollments;
const getCourseTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const { status } = req.query;
        const totalTransactions = yield course_stats_service_1.default.getTotalCourseTransactions(courseId, undefined, status);
        res.status(200).json({
            status: true,
            message: 'Course transactions retrieved successfully',
            data: { totalTransactions },
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching course transactions:', error);
        res.status(500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
});
exports.getCourseTransactions = getCourseTransactions;
//# sourceMappingURL=courseStatsController.js.map