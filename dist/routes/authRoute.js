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
// src/routes/authroute.ts
const express_1 = require("express");
const authController = __importStar(require("../controllers/authController"));
const frontendController = __importStar(require("../controllers/frontendController"));
const validations_1 = require("../utils/validations"); // Import the service
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const authorizeCreatorOrInstitution_1 = __importDefault(require("../middlewares/authorizeCreatorOrInstitution"));
const multer_1 = __importDefault(require("../utils/multer"));
const authRoutes = (0, express_1.Router)();
// Auth routes
authRoutes.get('/', authController.index);
authRoutes.post('/auth/register/user', (0, validations_1.userRegistrationValidationRules)(), validations_1.validate, authController.userRegister);
authRoutes.post('/auth/register/institution', (0, validations_1.institutionRegistrationValidationRules)(), validations_1.validate, authController.institutionRegister);
authRoutes.post('/auth/register/creator', (0, validations_1.creatorRegistrationValidationRules)(), validations_1.validate, authController.creatorRegister);
authRoutes.post('/auth/register/student', (0, validations_1.studentRegistrationValidationRules)(), validations_1.validate, authController.studentRegister);
authRoutes.post('/auth/verify/email', (0, validations_1.verificationValidationRules)(), validations_1.validate, authController.verifyEmail);
authRoutes.post('/auth/login', (0, validations_1.loginValidationRules)(), validations_1.validate, authController.login);
authRoutes.post('/auth/resend/verification/email', (0, validations_1.resendVerificationValidationRules)(), validations_1.validate, authController.resendVerificationEmail);
authRoutes.post('/auth/password/forgot', (0, validations_1.forgotPasswordValidationRules)(), validations_1.validate, authController.forgetPassword);
authRoutes.post('/auth/password/code/check', (0, validations_1.verificationValidationRules)(), validations_1.validate, authController.codeCheck);
authRoutes.post('/auth/password/reset', (0, validations_1.resetPasswordValidationRules)(), validations_1.validate, authController.resetPassword);
// Admin
authRoutes.post('/auth/admin/login', (0, validations_1.loginValidationRules)(), validations_1.validate, authController.adminLogin);
// Frontend
authRoutes.get('/fetch/digital/assets', frontendController.fetchDigitalAssets);
authRoutes.get('/view/digital/asset', frontendController.viewDigitalAsset);
authRoutes.get('/fetch/physical/assets', frontendController.fetchPhysicalAssets);
authRoutes.get('/view/physical/asset', frontendController.viewPhysicalAsset);
authRoutes.get('/fetch/jobs', frontendController.fetchJobs);
authRoutes.get('/view/job', frontendController.viewJob);
// Subscription plan
authRoutes.get('/subscription-plans/fetch', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, authController.getAllSubscriptionPlans);
authRoutes.post('/upload-multiple', authMiddleware_1.default, multer_1.default.array('files', 5), authController.uploadImages);
exports.default = authRoutes; // Export the router
//# sourceMappingURL=authRoute.js.map