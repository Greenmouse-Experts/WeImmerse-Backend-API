"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const kycController_1 = require("../controllers/kycController");
const adminAuthMiddleware_1 = __importDefault(require("../middlewares/adminAuthMiddleware"));
const kycRouter = (0, express_1.Router)();
kycRouter.post('/upload', authMiddleware_1.default, kycController_1.uploadKYCDocument);
kycRouter.post('/initiate-verification', authMiddleware_1.default, kycController_1.uploadKYCDocument);
kycRouter.post('/review', adminAuthMiddleware_1.default, kycController_1.uploadKYCDocument);
exports.default = kycRouter;
//# sourceMappingURL=kycRoute.js.map