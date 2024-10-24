// src/routes/adminRoute.ts
import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';
import { adminUpdateProfileValidationRules, updatePasswordValidationRules, createSubAdminValidationRules, updateSubAdminValidationRules, validate } from '../utils/validations'; // Import the service
import checkPermission from '../middlewares/checkPermissionMiddleware';

const adminRoutes = Router();

// User routes
adminRoutes.get("/logout", adminAuthMiddleware, adminController.logout);
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
adminRoutes.get('/roles', adminAuthMiddleware, checkPermission('view-subadmin'), adminController.getRoles);
adminRoutes.post('/role/create', adminAuthMiddleware, checkPermission('create-subadmin'), adminController.createRole);
adminRoutes.put('/role/update', adminAuthMiddleware, checkPermission('update-subadmin'), adminController.updateRole);

export default adminRoutes; // Export the router
