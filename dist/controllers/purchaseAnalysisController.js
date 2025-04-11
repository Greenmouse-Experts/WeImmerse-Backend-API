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
exports.getYearlyAnalysis = void 0;
const analysis_service_1 = __importDefault(require("../services/analysis.service"));
const getYearlyAnalysis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
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
//# sourceMappingURL=purchaseAnalysisController.js.map