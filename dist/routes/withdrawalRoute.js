"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const withdrawalController_1 = require("../controllers/withdrawalController");
const validations_1 = require("../utils/validations");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const authorizeCreatorOrInstitution_1 = __importDefault(require("../middlewares/authorizeCreatorOrInstitution"));
const adminAuthMiddleware_1 = __importDefault(require("../middlewares/adminAuthMiddleware"));
const withdrawalRoutes = (0, express_1.Router)();
// Account
withdrawalRoutes.post('/account/create', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, (0, validations_1.withdrawalAccountValidationRules)(), validations_1.validate, withdrawalController_1.createWithdrawalAccount);
withdrawalRoutes.get('/account/', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, withdrawalController_1.getWithdrawalAccounts);
withdrawalRoutes.get('/account/:id', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, withdrawalController_1.getWithdrawalAccountById);
withdrawalRoutes.put('/account/:id', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, withdrawalController_1.updateWithdrawalAccount);
withdrawalRoutes.delete('/account/:id', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, withdrawalController_1.deleteWithdrawalAccount);
// Request
withdrawalRoutes.post('/request', authMiddleware_1.default, authorizeCreatorOrInstitution_1.default, (0, validations_1.withdrawalRequestValidationRules)(), validations_1.validate, withdrawalController_1.requestWithdrawal);
// Request
withdrawalRoutes.get('/requests', adminAuthMiddleware_1.default, withdrawalController_1.fetchWithdrawalRequests);
// Approve request
withdrawalRoutes.post('/approve-request', adminAuthMiddleware_1.default, withdrawalController_1.approveWithdrawal);
withdrawalRoutes.post('/finalize', adminAuthMiddleware_1.default, withdrawalController_1.finalizeWithdrawal);
exports.default = withdrawalRoutes;
//# sourceMappingURL=withdrawalRoute.js.map