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
const express_1 = require("express");
const purchaseController = __importStar(require("../controllers/purchaseController"));
const validations_1 = require("../utils/validations");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const webhookAuth_1 = require("../middlewares/webhookAuth");
const purchaseRoutes = (0, express_1.Router)();
// Purchase routes
purchaseRoutes.post('/initiate', authMiddleware_1.default, (0, validations_1.initiatePurchaseValidationRules)(), validations_1.validate, purchaseController.initiatePurchase);
purchaseRoutes.post('/verify', authMiddleware_1.default, (0, validations_1.verifyPaymentValidationRules)(), validations_1.validate, purchaseController.verifyPayment);
purchaseRoutes.get('/history', authMiddleware_1.default, purchaseController.getPurchaseHistory);
purchaseRoutes.get('/details/:paymentId', authMiddleware_1.default, purchaseController.getPurchaseDetails);
// Webhook route (no auth needed)
purchaseRoutes.post('/webhook', webhookAuth_1.webhookAuth, (0, validations_1.webhookValidationRules)(), validations_1.validate, purchaseController.paymentWebhook);
exports.default = purchaseRoutes;
//# sourceMappingURL=purchaseRoute.js.map