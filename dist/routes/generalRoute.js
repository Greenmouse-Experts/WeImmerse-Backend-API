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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/generalRoute.ts
const express_1 = require("express");
const generalController = __importStar(require("../controllers/generalController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const validations_1 = require("../utils/validations");
const generalRoutes = (0, express_1.Router)();
// User routes
generalRoutes.post("/logout", authMiddleware_1.default, generalController.logout);
generalRoutes.get('/profile', authMiddleware_1.default, generalController.profile);
generalRoutes.get('/profile', authMiddleware_1.default, generalController.profile);
generalRoutes.put('/profile/update', authMiddleware_1.default, generalController.updateProfile);
generalRoutes.patch('/profile/photo/update', authMiddleware_1.default, generalController.updateProfilePhoto);
generalRoutes.put('/profile/update/password', authMiddleware_1.default, (0, validations_1.updatePasswordValidationRules)(), validations_1.validate, generalController.updatePassword);
generalRoutes.get('/notification/settings', authMiddleware_1.default, generalController.getUserNotificationSettings);
generalRoutes.put('/update/notification/settings', authMiddleware_1.default, generalController.updateUserNotificationSettings);
generalRoutes.post('/save/job', authMiddleware_1.default, generalController.saveJob);
generalRoutes.post('/apply/job', authMiddleware_1.default, (0, validations_1.validateJobApplication)(), validations_1.validate, generalController.applyJob);
generalRoutes.get('/fetch/savedJob', authMiddleware_1.default, generalController.getSavedJobs);
generalRoutes.get('/fetch/appliedJob', authMiddleware_1.default, generalController.getAppliedJobs);
exports.default = generalRoutes;
//# sourceMappingURL=generalRoute.js.map