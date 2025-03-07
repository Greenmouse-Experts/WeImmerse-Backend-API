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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/institutionRoute.ts
const express_1 = require("express");
const institutionController = __importStar(require("../controllers/institutionController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const authorizeInstitution_1 = __importDefault(require("../middlewares/authorizeInstitution"));
const validations_1 = require("../utils/validations");
const creatorValidations_1 = require("../utils/validations/creatorValidations");
const institutionRoutes = (0, express_1.Router)();
// JOB
institutionRoutes.get('/job/categories', authMiddleware_1.default, authorizeInstitution_1.default, institutionController.jobCategories);
institutionRoutes.post('/job/add', authMiddleware_1.default, authorizeInstitution_1.default, (0, creatorValidations_1.addJobValidationRules)(), validations_1.validate, institutionController.addJob);
institutionRoutes.put('/job/post', authMiddleware_1.default, authorizeInstitution_1.default, (0, creatorValidations_1.postJobValidationRules)(), validations_1.validate, institutionController.postJob);
institutionRoutes.get('/jobs', authMiddleware_1.default, authorizeInstitution_1.default, institutionController.getJobs);
institutionRoutes.patch('/job/close', authMiddleware_1.default, authorizeInstitution_1.default, institutionController.closeJob);
institutionRoutes.delete('/job/delete', authMiddleware_1.default, authorizeInstitution_1.default, institutionController.deleteJob);
institutionRoutes.post('/job/repost', authMiddleware_1.default, authorizeInstitution_1.default, institutionController.repostJob);
institutionRoutes.get('/job/applicants', authMiddleware_1.default, authorizeInstitution_1.default, institutionController.getJobApplicants);
institutionRoutes.get('/job/view/applicant', authMiddleware_1.default, authorizeInstitution_1.default, institutionController.viewApplicant);
institutionRoutes.patch('/job/reject/applicant', authMiddleware_1.default, authorizeInstitution_1.default, institutionController.rejectApplicant);
institutionRoutes.post('/job/download/applicant/resume', authMiddleware_1.default, authorizeInstitution_1.default, institutionController.downloadApplicantResume);
exports.default = institutionRoutes;
//# sourceMappingURL=institutionRoute.js.map