"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = __importDefault(require("../controllers/categoryController"));
const validations_1 = require("../utils/validations");
const validations_2 = require("../utils/validations");
const adminAuthMiddleware_1 = __importDefault(require("../middlewares/adminAuthMiddleware"));
const router = (0, express_1.Router)();
// Crud
router
    .route('/')
    .post(adminAuthMiddleware_1.default, (0, validations_1.createCategoryValidationRules)(), validations_2.validate, categoryController_1.default.createCategory)
    .get(categoryController_1.default.getAllCategories);
router
    .route('/:id')
    .get(categoryController_1.default.getCategory)
    .put(adminAuthMiddleware_1.default, (0, validations_1.updateCategoryValidationRules)(), validations_2.validate, categoryController_1.default.updateCategory)
    .delete(adminAuthMiddleware_1.default, categoryController_1.default.deleteCategory);
router.patch('/:id/toggle-status', adminAuthMiddleware_1.default, categoryController_1.default.toggleCategoryStatus);
exports.default = router;
//# sourceMappingURL=categoryRoute.js.map