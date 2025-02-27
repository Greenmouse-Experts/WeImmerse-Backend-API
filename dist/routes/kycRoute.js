"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validations_1 = require("../utils/validations"); // Import the service
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const kycController_1 = require("../controllers/kycController");
const adminAuthMiddleware_1 = __importDefault(require("../middlewares/adminAuthMiddleware"));
const kycRouter = (0, express_1.Router)();
kycRouter.post('/upload', authMiddleware_1.default, (0, validations_1.uploadKycDocumentValidationRules)(), validations_1.validate, kycController_1.uploadKYCDocument);
// kycRouter.post(
//   '/initiate-verification',
//   authMiddleware,
//   initiateKYCVerification
// );
kycRouter.post('/review', adminAuthMiddleware_1.default, kycController_1.reviewKYC);
exports.default = kycRouter;
//# sourceMappingURL=kycRoute.js.map