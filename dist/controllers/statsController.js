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
exports.getAdminStats = exports.getCreatorStatistics = void 0;
const stats_service_1 = __importDefault(require("../services/stats.service"));
const admin_stats_service_1 = __importDefault(require("../services/admin-stats.service"));
const logger_1 = __importDefault(require("../middlewares/logger"));
const getCreatorStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const creatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming authenticated user is the creator
        const stats = yield stats_service_1.default.getCourseStatistics(creatorId);
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
exports.getCreatorStatistics = getCreatorStatistics;
const getAdminStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = req.query.year
            ? parseInt(req.query.year)
            : new Date().getFullYear();
        const stats = yield admin_stats_service_1.default.getAdminStats(year);
        res.json(stats);
    }
    catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Failed to fetch admin statistics' });
    }
});
exports.getAdminStats = getAdminStats;
// export const getCourseEnrollments = async (req: Request, res: Response) => {
//   try {
//     const { courseId } = req.params;
//     const totalEnrollments = await CourseStatsService.getTotalEnrollments(
//       courseId
//     );
//     res.status(200).json({
//       status: true,
//       message: 'Course enrollments retrieved successfully',
//       data: { totalEnrollments },
//     });
//   } catch (error: any) {
//     logger.error('Error fetching course enrollments:', error);
//     res.status(500).json({
//       status: false,
//       message: error.message || 'Internal server error',
//     });
//   }
// };
// export const getCourseTransactions = async (req: Request, res: Response) => {
//   try {
//     const { courseId } = req.params;
//     const { status } = req.query;
//     const totalTransactions =
//       await CourseStatsService.getTotalCourseTransactions(
//         courseId,
//         undefined,
//         status as PaymentStatus
//       );
//     res.status(200).json({
//       status: true,
//       message: 'Course transactions retrieved successfully',
//       data: { totalTransactions },
//     });
//   } catch (error: any) {
//     logger.error('Error fetching course transactions:', error);
//     res.status(500).json({
//       status: false,
//       message: error.message || 'Internal server error',
//     });
//   }
// };
//# sourceMappingURL=statsController.js.map