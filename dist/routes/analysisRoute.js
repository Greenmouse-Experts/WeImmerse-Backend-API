"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/purchaseAnalysis.routes.ts
const express_1 = __importDefault(require("express"));
const analysisController_1 = require("../controllers/analysisController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const authorizeCreatorOrInstitution_1 = __importDefault(require("../middlewares/authorizeCreatorOrInstitution"));
const adminAuthMiddleware_1 = __importDefault(require("../middlewares/adminAuthMiddleware"));
const router = express_1.default.Router();
// Get yearly analysis for all creators
router.get('/creator/yearly/landing', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, analysisController_1.getYearlyAnalysis);
// Get yearly analysis for all creators
router.get('/admin/yearly/landing', adminAuthMiddleware_1.default, analysisController_1.getAdminYearlyAnalysis);
// Get yearly analysis for all creators
router.get('/admin/recent-signups', adminAuthMiddleware_1.default, analysisController_1.getRecentSignups);
// Get user stats
router.get('/admin/user-stats', adminAuthMiddleware_1.default, analysisController_1.getUserStats);
// Get users by country
router.get('/admin/users-by-country', adminAuthMiddleware_1.default, analysisController_1.getUsersByCountry);
// Get student analysis (for regular users)
router.get('/student/yearly', authMiddleware_1.default, analysisController_1.getStudentAnalysis);
// Get analysis for a specific creator
// router.get('/creator/:creatorId', authMiddleware, getCreatorAnalysis);
exports.default = router;
//# sourceMappingURL=analysisRoute.js.map