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
// src/routes/adminRoute.ts
const express_1 = require("express");
const adminController = __importStar(require("../controllers/adminController"));
const adminAuthMiddleware_1 = __importDefault(require("../middlewares/adminAuthMiddleware"));
const validations_1 = require("../utils/validations"); // Import the service
const adminValidations_1 = require("../utils/validations/adminValidations");
const checkPermissionMiddleware_1 = __importDefault(require("../middlewares/checkPermissionMiddleware"));
const adminRoutes = (0, express_1.Router)();
// User routes
adminRoutes.post('/logout', adminAuthMiddleware_1.default, adminController.logout);
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
// Course Category
adminRoutes.get('/course/categories', adminAuthMiddleware_1.default, adminController.getCourseCategories);
adminRoutes.post('/course/category/create', adminAuthMiddleware_1.default, adminController.createCourseCategory);
adminRoutes.put('/course/category/update', adminAuthMiddleware_1.default, adminController.updateCourseCategory);
adminRoutes.delete('/course/category/delete', adminAuthMiddleware_1.default, adminController.deleteCourseCategory);
// Asset Category
adminRoutes.get('/asset/categories', adminAuthMiddleware_1.default, adminController.getAssetCategories);
adminRoutes.post('/asset/category/create', adminAuthMiddleware_1.default, adminController.createAssetCategory);
adminRoutes.put('/asset/category/update', adminAuthMiddleware_1.default, adminController.updateAssetCategory);
adminRoutes.delete('/asset/category/delete', adminAuthMiddleware_1.default, adminController.deleteAssetCategory);
// Job Category
adminRoutes.get('/job/categories', adminAuthMiddleware_1.default, adminController.getJobCategories);
adminRoutes.post('/job/category/create', adminAuthMiddleware_1.default, adminController.createJobCategory);
adminRoutes.put('/job/category/update', adminAuthMiddleware_1.default, adminController.updateJobCategory);
adminRoutes.delete('/job/category/delete', adminAuthMiddleware_1.default, adminController.deleteJobCategory);
// Subscription Plan
adminRoutes.get('/subscription/plans', adminAuthMiddleware_1.default, adminController.getAllSubscriptionPlans);
adminRoutes.get('/subscription/plan/:id', adminAuthMiddleware_1.default, adminController.getSubscriptionPlan);
adminRoutes.post('/subscription/plan/create', adminAuthMiddleware_1.default, (0, validations_1.createSubscriptionPlanValidationRules)(), validations_1.validate, adminController.createSubscriptionPlan);
adminRoutes.put('/subscription/plan/update', adminAuthMiddleware_1.default, (0, validations_1.updateSubscriptionPlanValidationRules)(), validations_1.validate, adminController.updateSubscriptionPlan);
adminRoutes.delete('/subscription/plan/delete', adminAuthMiddleware_1.default, adminController.deleteSubscriptionPlan);
// Users
adminRoutes.get('/creators', adminAuthMiddleware_1.default, adminController.getAllCreator);
adminRoutes.get('/users', adminAuthMiddleware_1.default, adminController.getAllUser);
adminRoutes.get('/students', adminAuthMiddleware_1.default, adminController.getAllStudent);
adminRoutes.get('/institutions', adminAuthMiddleware_1.default, adminController.getAllInstitution);
adminRoutes.get('/user-details/:id', adminAuthMiddleware_1.default, adminController.getSingleUser);
// Digital Asset
adminRoutes.get('/all/digital/assets', adminAuthMiddleware_1.default, adminController.getAllDigitalAssets);
adminRoutes.get('/digital/assets', adminAuthMiddleware_1.default, adminController.getDigitalAssets);
adminRoutes.get('/digital/asset/view', adminAuthMiddleware_1.default, adminController.viewDigitalAsset);
adminRoutes.post('/digital/asset/create', adminAuthMiddleware_1.default, (0, adminValidations_1.digitalAssetValidationRules)(), validations_1.validate, adminController.createDigitalAsset);
adminRoutes.put('/digital/asset/update', adminAuthMiddleware_1.default, (0, adminValidations_1.digitalAssetValidationRules)(), validations_1.validate, adminController.updateDigitalAsset);
adminRoutes.delete('/digital/asset/delete', adminAuthMiddleware_1.default, adminController.deleteDigitalAsset);
adminRoutes.patch('/digital/asset/update/status', adminAuthMiddleware_1.default, adminController.updateDigitalAssetStatus);
// Physical Asset
adminRoutes.get('/all/physical/assets', adminAuthMiddleware_1.default, adminController.getAllPhysicalAssets);
adminRoutes.get('/physical/assets', adminAuthMiddleware_1.default, adminController.getPhysicalAssets);
adminRoutes.get('/physical/asset/view', adminAuthMiddleware_1.default, adminController.viewPhysicalAsset);
adminRoutes.post('/physical/asset/create', adminAuthMiddleware_1.default, (0, adminValidations_1.physicalAssetValidationRules)(), validations_1.validate, adminController.createPhysicalAsset);
adminRoutes.put('/physical/asset/update', adminAuthMiddleware_1.default, (0, adminValidations_1.physicalAssetValidationRules)(), validations_1.validate, adminController.updatePhysicalAsset);
adminRoutes.delete('/physical/asset/delete', adminAuthMiddleware_1.default, adminController.deletePhysicalAsset);
adminRoutes.patch('/physical/asset/update/status', adminAuthMiddleware_1.default, adminController.updatePhysicalAssetStatus);
// Course
adminRoutes.post('/course/:id/publish', adminAuthMiddleware_1.default, adminController.publishCourse);
adminRoutes.post('/course/:id/unpublish', adminAuthMiddleware_1.default, adminController.unpublishCourse);
adminRoutes.get('/course/fetch', adminAuthMiddleware_1.default, adminController.getAllCourses);
// Job
adminRoutes.get('/job/fetch/:userId', adminAuthMiddleware_1.default, adminController.fetchJobs);
adminRoutes.patch('/job/:id/review', adminAuthMiddleware_1.default, (0, validations_1.reviewJobValidationRules)(), validations_1.validate, adminController.reviewJobPost);
adminRoutes.patch('/job/:id/vet', adminAuthMiddleware_1.default, adminController.vetJobPost);
adminRoutes.get('/job/fetch', adminAuthMiddleware_1.default, adminController.fetchAllJobs);
// Creator/Institution account vetting
adminRoutes.post('/account/:userId/vet/', adminAuthMiddleware_1.default, (0, adminValidations_1.vetAccountValidationRules)(), validations_1.validate, adminController.vetAccount);
exports.default = adminRoutes; // Export the router
//# sourceMappingURL=adminRoute.js.map