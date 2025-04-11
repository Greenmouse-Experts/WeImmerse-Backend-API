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
exports.getRecentSignups = exports.getAdminYearlyAnalysis = exports.getYearlyAnalysis = void 0;
exports.getUserStats = getUserStats;
const analysis_service_1 = __importDefault(require("../services/analysis.service"));
const admin_analysis_service_1 = __importDefault(require("../services/admin-analysis.service"));
const getYearlyAnalysis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const year = req.query.year
            ? parseInt(req.query.year)
            : new Date().getFullYear();
        const analysis = yield analysis_service_1.default.getYearlyAnalysis(year, userId);
        res.json(analysis);
    }
    catch (error) {
        console.error('Error fetching yearly analysis:', error);
        res.status(500).json({ message: 'Failed to fetch yearly analysis' });
    }
});
exports.getYearlyAnalysis = getYearlyAnalysis;
const getAdminYearlyAnalysis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = req.query.year
            ? parseInt(req.query.year)
            : new Date().getFullYear();
        const analysis = yield admin_analysis_service_1.default.getYearlyAnalysis(year);
        res.json(analysis);
    }
    catch (error) {
        console.error('Error fetching yearly analysis:', error);
        res.status(500).json({ message: 'Failed to fetch yearly analysis' });
    }
});
exports.getAdminYearlyAnalysis = getAdminYearlyAnalysis;
const getRecentSignups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = { userType: null, limit: null };
        filters.userType = req.query.userType;
        filters.limit = req.query.limit
            ? parseInt(req.query.limit)
            : undefined;
        const analysis = yield admin_analysis_service_1.default.getRecentSignups(filters);
        res.json(analysis);
    }
    catch (error) {
        console.error('Error fetching yearly analysis:', error);
        res.status(500).json({ message: 'Failed to fetch yearly analysis' });
    }
});
exports.getRecentSignups = getRecentSignups;
function getUserStats(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stats = yield admin_analysis_service_1.default.getUserStats();
            res.json(stats);
        }
        catch (error) {
            console.error('Failed to fetch user stats:', error);
            res.status(500).json({ error: 'Failed to fetch user statistics' });
        }
    });
}
// export const getCreatorAnalysis = async (req: Request, res: Response) => {
//   try {
//     const creatorId = req.params.creatorId;
//     const year = req.query.year
//       ? parseInt(req.query.year as string)
//       : new Date().getFullYear();
//     const analysis = await PurchaseAnalysisService.getCreatorAnalysis(
//       creatorId,
//       year
//     );
//     res.json(analysis);
//   } catch (error) {
//     console.error('Error fetching creator analysis:', error);
//     res.status(500).json({ message: 'Failed to fetch creator analysis' });
//   }
// };
//# sourceMappingURL=purchaseAnalysisController.js.map