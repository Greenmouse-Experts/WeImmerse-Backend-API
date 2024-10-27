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
// src/routes/adminRoute.ts
const express_1 = require("express");
const adminController = __importStar(require("../controllers/adminController"));
const adminAuthMiddleware_1 = __importDefault(require("../middlewares/adminAuthMiddleware"));
const validations_1 = require("../utils/validations"); // Import the service
const checkPermissionMiddleware_1 = __importDefault(require("../middlewares/checkPermissionMiddleware"));
const adminRoutes = (0, express_1.Router)();
// User routes
adminRoutes.get("/logout", adminAuthMiddleware_1.default, adminController.logout);
adminRoutes.put('/profile/update', adminAuthMiddleware_1.default, (0, validations_1.adminUpdateProfileValidationRules)(), validations_1.validate, (0, checkPermissionMiddleware_1.default)('update-profile'), adminController.updateProfile);
adminRoutes.put('/profile/update/password', adminAuthMiddleware_1.default, (0, validations_1.updatePasswordValidationRules)(), validations_1.validate, (0, checkPermissionMiddleware_1.default)('update-password'), adminController.updatePassword);
// Sub Admin
adminRoutes.get('/sub-admins', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('view-subadmin'), adminController.subAdmins);
adminRoutes.post('/sub-admin/create', adminAuthMiddleware_1.default, (0, validations_1.createSubAdminValidationRules)(), validations_1.validate, (0, checkPermissionMiddleware_1.default)('create-subadmin'), adminController.createSubAdmin);
adminRoutes.put('/sub-admin/update', adminAuthMiddleware_1.default, (0, validations_1.updateSubAdminValidationRules)(), validations_1.validate, (0, checkPermissionMiddleware_1.default)('update-subadmin'), adminController.updateSubAdmin);
adminRoutes.patch('/sub-admin/status', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('activateanddeactivate-subadmin'), adminController.deactivateOrActivateSubAdmin);
adminRoutes.delete('/sub-admin/delete', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('delete-subadmin'), adminController.deleteSubAdmin);
adminRoutes.post('/sub-admin/resend-login', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('resendlogindetails-subadmin'), adminController.resendLoginDetailsSubAdmin);
// Role
adminRoutes.get('/roles', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('view-role'), adminController.getRoles);
adminRoutes.post('/role/create', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('create-role'), adminController.createRole);
adminRoutes.put('/role/update', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('update-role'), adminController.updateRole);
adminRoutes.get('/role/view/permissions', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('view-role-permissions'), adminController.viewRolePermissions);
adminRoutes.post('/role/assign/permission', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('assign-role-permissions'), adminController.assignPermissionToRole);
adminRoutes.delete('/role/delete/permission', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('delete-role-permissions'), adminController.deletePermissionFromRole);
// Permission
adminRoutes.get('/permissions', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('view-permission'), adminController.getPermissions);
adminRoutes.post('/permission/create', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('create-permission'), adminController.createPermission);
adminRoutes.put('/permission/update', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('update-permission'), adminController.updatePermission);
adminRoutes.delete('/permission/delete', adminAuthMiddleware_1.default, (0, checkPermissionMiddleware_1.default)('delete-permission'), adminController.deletePermission);
// Subscription Plan
adminRoutes.get('/subscription/plans', adminAuthMiddleware_1.default, adminController.getAllSubscriptionPlans);
adminRoutes.post('/subscription/plan/create', adminAuthMiddleware_1.default, (0, validations_1.createSubscriptionPlanValidationRules)(), validations_1.validate, adminController.createSubscriptionPlan);
adminRoutes.put('/subscription/plan/update', adminAuthMiddleware_1.default, (0, validations_1.updateSubscriptionPlanValidationRules)(), validations_1.validate, adminController.updateSubscriptionPlan);
adminRoutes.delete('/subscription/plan/delete', adminAuthMiddleware_1.default, adminController.deleteSubscriptionPlan);
// Create a category
adminRoutes.post('/categories', adminAuthMiddleware_1.default, adminController.createCategory);
// Update a category
adminRoutes.put('/categories', adminAuthMiddleware_1.default, adminController.updateCategory);
// Delete a category
adminRoutes.delete('/categories', adminAuthMiddleware_1.default, adminController.deleteCategory);
// Fetch all categories
adminRoutes.get('/categories', adminAuthMiddleware_1.default, adminController.getAllCategories);
adminRoutes.get('/categories/sub/categories', adminAuthMiddleware_1.default, adminController.getCategoriesWithSubCategories);
adminRoutes.post('/sub/categories', adminAuthMiddleware_1.default, adminController.createSubCategory);
adminRoutes.put('/sub/categories', adminAuthMiddleware_1.default, adminController.updateSubCategory);
adminRoutes.delete('/sub/categories', adminAuthMiddleware_1.default, adminController.deleteSubCategory);
adminRoutes.get('/sub/categories', adminAuthMiddleware_1.default, adminController.getAllSubCategories);
exports.default = adminRoutes; // Export the router
//# sourceMappingURL=adminRoute.js.map