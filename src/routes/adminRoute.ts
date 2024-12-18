// src/routes/adminRoute.ts
import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';
import { 
    adminUpdateProfileValidationRules, 
    updatePasswordValidationRules, 
    createSubAdminValidationRules, 
    updateSubAdminValidationRules, 
    createSubscriptionPlanValidationRules, 
    updateSubscriptionPlanValidationRules,
    validatePaymentGateway,
    validate } from '../utils/validations'; // Import the service
import checkPermission from '../middlewares/checkPermissionMiddleware';

const adminRoutes = Router();

// User routes
adminRoutes.post("/logout", adminAuthMiddleware, adminController.logout);
adminRoutes.put('/profile/update', adminAuthMiddleware, adminUpdateProfileValidationRules(), validate, checkPermission('update-profile'), adminController.updateProfile);
adminRoutes.put('/profile/update/password', adminAuthMiddleware, updatePasswordValidationRules(), validate, checkPermission('update-password'), adminController.updatePassword);

// Sub Admin
adminRoutes.get('/sub-admins', adminAuthMiddleware, checkPermission('view-subadmin'), adminController.subAdmins);
adminRoutes.post('/sub-admin/create', adminAuthMiddleware, createSubAdminValidationRules(), validate, checkPermission('create-subadmin'), adminController.createSubAdmin);
adminRoutes.put('/sub-admin/update', adminAuthMiddleware, updateSubAdminValidationRules(), validate, checkPermission('update-subadmin'), adminController.updateSubAdmin);
adminRoutes.patch('/sub-admin/status', adminAuthMiddleware, checkPermission('activateanddeactivate-subadmin'), adminController.deactivateOrActivateSubAdmin);
adminRoutes.delete('/sub-admin/delete', adminAuthMiddleware, checkPermission('delete-subadmin'), adminController.deleteSubAdmin);
adminRoutes.post('/sub-admin/resend-login', adminAuthMiddleware, checkPermission('resendlogindetails-subadmin'), adminController.resendLoginDetailsSubAdmin);

// Role
adminRoutes.get('/roles', adminAuthMiddleware, checkPermission('view-role'), adminController.getRoles);
adminRoutes.post('/role/create', adminAuthMiddleware, checkPermission('create-role'), adminController.createRole);
adminRoutes.put('/role/update', adminAuthMiddleware, checkPermission('update-role'), adminController.updateRole);
adminRoutes.get('/role/view/permissions', adminAuthMiddleware, checkPermission('view-role-permissions'), adminController.viewRolePermissions);
adminRoutes.post('/role/assign/permission', adminAuthMiddleware, checkPermission('assign-role-permissions'), adminController.assignPermissionToRole);
adminRoutes.delete('/role/delete/permission', adminAuthMiddleware, checkPermission('delete-role-permissions'), adminController.deletePermissionFromRole);

// Permission
adminRoutes.get('/permissions', adminAuthMiddleware, checkPermission('view-permission'), adminController.getPermissions);
adminRoutes.post('/permission/create', adminAuthMiddleware, checkPermission('create-permission'), adminController.createPermission);
adminRoutes.put('/permission/update', adminAuthMiddleware, checkPermission('update-permission'), adminController.updatePermission);
adminRoutes.delete('/permission/delete', adminAuthMiddleware, checkPermission('delete-permission'), adminController.deletePermission);

// Course Category
adminRoutes.get('/course/categories', adminAuthMiddleware, adminController.getCourseCategories);
adminRoutes.post('/course/category/create', adminAuthMiddleware, adminController.createCourseCategory);
adminRoutes.put('/course/category/update', adminAuthMiddleware, adminController.updateCourseCategory);
adminRoutes.delete('/course/category/delete', adminAuthMiddleware, adminController.deleteCourseCategory);

// Asset Category
adminRoutes.get('/asset/categories', adminAuthMiddleware, adminController.getAssetCategories);
adminRoutes.post('/asset/category/create', adminAuthMiddleware, adminController.createAssetCategory);
adminRoutes.put('/asset/category/update', adminAuthMiddleware, adminController.updateAssetCategory);
adminRoutes.delete('/asset/category/delete', adminAuthMiddleware, adminController.deleteAssetCategory);

// Subscription Plan
adminRoutes.get('/subscription/plans', adminAuthMiddleware, adminController.getAllSubscriptionPlans);
adminRoutes.post('/subscription/plan/create', adminAuthMiddleware, createSubscriptionPlanValidationRules(), validate, adminController.createSubscriptionPlan);
adminRoutes.put('/subscription/plan/update', adminAuthMiddleware, updateSubscriptionPlanValidationRules(), validate, adminController.updateSubscriptionPlan);
adminRoutes.delete('/subscription/plan/delete', adminAuthMiddleware, adminController.deleteSubscriptionPlan);

// Users
adminRoutes.get('/creators', adminAuthMiddleware, adminController.getAllSubscriptionPlans);
adminRoutes.get('/users', adminAuthMiddleware, adminController.getAllSubscriptionPlans);
adminRoutes.get('/students', adminAuthMiddleware, adminController.getAllSubscriptionPlans);
adminRoutes.get('/institutions', adminAuthMiddleware, adminController.getAllSubscriptionPlans);
export default adminRoutes; // Export the router
