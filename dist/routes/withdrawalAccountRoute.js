"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const withdrawalAccountController_1 = require("../controllers/withdrawalAccountController");
const validations_1 = require("../utils/validations");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const withdrawalAccountRoutes = (0, express_1.Router)();
withdrawalAccountRoutes.post('/create', authMiddleware_1.default, (0, validations_1.withdrawalAccountValidationRules)(), validations_1.validate, withdrawalAccountController_1.createWithdrawalAccount);
withdrawalAccountRoutes.get('/', authMiddleware_1.default, withdrawalAccountController_1.getWithdrawalAccounts);
withdrawalAccountRoutes.get('/:id', authMiddleware_1.default, withdrawalAccountController_1.getWithdrawalAccountById);
withdrawalAccountRoutes.put('/:id', authMiddleware_1.default, withdrawalAccountController_1.updateWithdrawalAccount);
withdrawalAccountRoutes.delete('/:id', authMiddleware_1.default, withdrawalAccountController_1.deleteWithdrawalAccount);
exports.default = withdrawalAccountRoutes;
//# sourceMappingURL=withdrawalAccountRoute.js.map