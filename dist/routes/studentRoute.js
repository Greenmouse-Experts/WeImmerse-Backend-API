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
// src/routes/studentRoute.ts
const express_1 = require("express");
const studentController = __importStar(require("../controllers/studentController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const validations_1 = require("../utils/validations");
const studentController_1 = require("../controllers/studentController");
const studentValidations_1 = require("../utils/validations/studentValidations");
const studentRoutes = (0, express_1.Router)();
/**
 * Authorized route to get all enrolled courses
 * For now - it fetches all live courses for students
 */
studentRoutes.get('/enrolled-courses', authMiddleware_1.default, studentController_1.getAllCourses);
/**
 * Authorized route to get a single enrolled course
 */
studentRoutes.get('/course/:id', authMiddleware_1.default, studentController_1.getCourseById);
/**
 * Enroll in a course
 */
studentRoutes.post('/course/:courseId/enroll', authMiddleware_1.default, studentController_1.enrollCourse);
/**
 * Progress tracking
 */
studentRoutes.post('/course-progress/save', authMiddleware_1.default, studentController_1.saveCourseProgress);
/**
 * Quiz attempt
 */
studentRoutes.post('/submit-quiz', authMiddleware_1.default, studentController_1.submitQuiz);
studentRoutes.get('/quiz-attempt/:quizId', authMiddleware_1.default, studentController_1.getAttempts);
studentRoutes.get('/latest-quiz-attempt/:quizId', authMiddleware_1.default, studentController_1.getLatestAttempt);
/**
 * Certification
 */
studentRoutes.post('/generate-certificate', authMiddleware_1.default, (0, studentValidations_1.generateCertificateValidationRules)(), validations_1.validate, studentController.generateCertificate);
studentRoutes.get('/certificate/:courseId', authMiddleware_1.default, (0, studentValidations_1.generateCertificateValidationRules)(), validations_1.validate, studentController.getCertificate);
studentRoutes.get('/purchased-products', authMiddleware_1.default, studentController.getPurchasedProducts);
studentRoutes.get('/purchased-product/:trxId', authMiddleware_1.default, studentController.getPurchasedProductDetails);
exports.default = studentRoutes;
//# sourceMappingURL=studentRoute.js.map