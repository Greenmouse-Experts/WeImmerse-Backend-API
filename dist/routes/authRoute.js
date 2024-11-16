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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authroute.ts
const express_1 = require("express");
const authController = __importStar(require("../controllers/authController"));
const homeController = __importStar(require("../controllers/homeController"));
const validations_1 = require("../utils/validations"); // Import the service
const authRoutes = (0, express_1.Router)();
// Auth routes
authRoutes.get("/", authController.index);
authRoutes.post("/auth/register/vendor", (0, validations_1.registrationValidationRules)(), validations_1.validate, authController.vendorRegister);
authRoutes.post("/auth/register/customer", (0, validations_1.registrationValidationRules)(), validations_1.validate, authController.customerRegister);
authRoutes.post("/auth/verify/email", (0, validations_1.verificationValidationRules)(), validations_1.validate, authController.verifyEmail);
authRoutes.post("/auth/login", (0, validations_1.loginValidationRules)(), validations_1.validate, authController.login);
authRoutes.post("/auth/resend/verification/email", (0, validations_1.resendVerificationValidationRules)(), validations_1.validate, authController.resendVerificationEmail);
authRoutes.post("/auth/password/forgot", (0, validations_1.forgotPasswordValidationRules)(), validations_1.validate, authController.forgetPassword);
authRoutes.post("/auth/password/code/check", (0, validations_1.verificationValidationRules)(), validations_1.validate, authController.codeCheck);
authRoutes.post("/auth/password/reset", (0, validations_1.resetPasswordValidationRules)(), validations_1.validate, authController.resetPassword);
// Admin
authRoutes.post("/auth/admin/login", (0, validations_1.loginValidationRules)(), validations_1.validate, authController.adminLogin);
// Frontend
authRoutes.get('/categories', homeController.getCategoriesWithSubcategories); // Fetch categories with subcategories
authRoutes.get("/products", homeController.products);
authRoutes.get('/product', homeController.getProductById); // Fetch a single product by ID
exports.default = authRoutes; // Export the router
//# sourceMappingURL=authRoute.js.map