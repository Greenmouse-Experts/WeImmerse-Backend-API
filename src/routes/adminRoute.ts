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
  validate,
  reviewJobValidationRules,
} from '../utils/validations'; // Import the service
import {
  digitalAssetValidationRules,
  physicalAssetValidationRules,
  vetAccountValidationRules,
} from '../utils/validations/adminValidations';
import checkPermission from '../middlewares/checkPermissionMiddleware';

const adminRoutes = Router();

// User routes
adminRoutes.post('/logout', adminAuthMiddleware, adminController.logout);
adminRoutes.put(
  '/profile/update',
  adminAuthMiddleware,
  adminUpdateProfileValidationRules(),
  validate,
  checkPermission('update-profile'),
  adminController.updateProfile
);
adminRoutes.put(
  '/profile/update/password',
  adminAuthMiddleware,
  updatePasswordValidationRules(),
  validate,
  checkPermission('update-password'),
  adminController.updatePassword
);

// Sub Admin
adminRoutes.get(
  '/sub-admins',
  adminAuthMiddleware,
  checkPermission('view-subadmin'),
  adminController.subAdmins
);
adminRoutes.post(
  '/sub-admin/create',
  adminAuthMiddleware,
  createSubAdminValidationRules(),
  validate,
  checkPermission('create-subadmin'),
  adminController.createSubAdmin
);
adminRoutes.put(
  '/sub-admin/update',
  adminAuthMiddleware,
  updateSubAdminValidationRules(),
  validate,
  checkPermission('update-subadmin'),
  adminController.updateSubAdmin
);
adminRoutes.patch(
  '/sub-admin/status',
  adminAuthMiddleware,
  checkPermission('activateanddeactivate-subadmin'),
  adminController.deactivateOrActivateSubAdmin
);
adminRoutes.delete(
  '/sub-admin/delete',
  adminAuthMiddleware,
  checkPermission('delete-subadmin'),
  adminController.deleteSubAdmin
);
adminRoutes.post(
  '/sub-admin/resend-login',
  adminAuthMiddleware,
  checkPermission('resendlogindetails-subadmin'),
  adminController.resendLoginDetailsSubAdmin
);

// Role
adminRoutes.get(
  '/roles',
  adminAuthMiddleware,
  checkPermission('view-role'),
  adminController.getRoles
);
adminRoutes.post(
  '/role/create',
  adminAuthMiddleware,
  checkPermission('create-role'),
  adminController.createRole
);
adminRoutes.put(
  '/role/update',
  adminAuthMiddleware,
  checkPermission('update-role'),
  adminController.updateRole
);
adminRoutes.get(
  '/role/view/permissions',
  adminAuthMiddleware,
  checkPermission('view-role-permissions'),
  adminController.viewRolePermissions
);
adminRoutes.post(
  '/role/assign/permission',
  adminAuthMiddleware,
  checkPermission('assign-role-permissions'),
  adminController.assignPermissionToRole
);
adminRoutes.delete(
  '/role/delete/permission',
  adminAuthMiddleware,
  checkPermission('delete-role-permissions'),
  adminController.deletePermissionFromRole
);

// Permission
adminRoutes.get(
  '/permissions',
  adminAuthMiddleware,
  checkPermission('view-permission'),
  adminController.getPermissions
);
adminRoutes.post(
  '/permission/create',
  adminAuthMiddleware,
  checkPermission('create-permission'),
  adminController.createPermission
);
adminRoutes.put(
  '/permission/update',
  adminAuthMiddleware,
  checkPermission('update-permission'),
  adminController.updatePermission
);
adminRoutes.delete(
  '/permission/delete',
  adminAuthMiddleware,
  checkPermission('delete-permission'),
  adminController.deletePermission
);

// Course Category
adminRoutes.get(
  '/course/categories',
  adminAuthMiddleware,
  adminController.getCourseCategories
);
adminRoutes.post(
  '/course/category/create',
  adminAuthMiddleware,
  adminController.createCourseCategory
);
adminRoutes.put(
  '/course/category/update',
  adminAuthMiddleware,
  adminController.updateCourseCategory
);
adminRoutes.delete(
  '/course/category/delete',
  adminAuthMiddleware,
  adminController.deleteCourseCategory
);

// Asset Category
adminRoutes.get(
  '/asset/categories',
  adminAuthMiddleware,
  adminController.getAssetCategories
);
adminRoutes.post(
  '/asset/category/create',
  adminAuthMiddleware,
  adminController.createAssetCategory
);
adminRoutes.put(
  '/asset/category/update',
  adminAuthMiddleware,
  adminController.updateAssetCategory
);
adminRoutes.delete(
  '/asset/category/delete',
  adminAuthMiddleware,
  adminController.deleteAssetCategory
);

// Job Category
adminRoutes.get(
  '/job/categories',
  adminAuthMiddleware,
  adminController.getJobCategories
);
adminRoutes.post(
  '/job/category/create',
  adminAuthMiddleware,
  adminController.createJobCategory
);
adminRoutes.put(
  '/job/category/update',
  adminAuthMiddleware,
  adminController.updateJobCategory
);
adminRoutes.delete(
  '/job/category/delete',
  adminAuthMiddleware,
  adminController.deleteJobCategory
);

// Subscription Plan
adminRoutes.get(
  '/subscription/plans',
  adminAuthMiddleware,
  adminController.getAllSubscriptionPlans
);
adminRoutes.get(
  '/subscription/plan/:id',
  adminAuthMiddleware,
  adminController.getSubscriptionPlan
);
adminRoutes.post(
  '/subscription/plan/create',
  adminAuthMiddleware,
  createSubscriptionPlanValidationRules(),
  validate,
  adminController.createSubscriptionPlan
);
adminRoutes.put(
  '/subscription/plan/update',
  adminAuthMiddleware,
  updateSubscriptionPlanValidationRules(),
  validate,
  adminController.updateSubscriptionPlan
);
adminRoutes.delete(
  '/subscription/plan/delete',
  adminAuthMiddleware,
  adminController.deleteSubscriptionPlan
);

// Users
adminRoutes.get(
  '/creators',
  adminAuthMiddleware,
  adminController.getAllCreator
);
adminRoutes.get('/users', adminAuthMiddleware, adminController.getAllUser);
adminRoutes.get(
  '/students',
  adminAuthMiddleware,
  adminController.getAllStudent
);
adminRoutes.get(
  '/institutions',
  adminAuthMiddleware,
  adminController.getAllInstitution
);
adminRoutes.get(
  '/user-details/:id',
  adminAuthMiddleware,
  adminController.getSingleUser
);

// Digital Asset
adminRoutes.get(
  '/all/digital/assets',
  adminAuthMiddleware,
  adminController.getAllDigitalAssets
);
adminRoutes.get(
  '/digital/assets',
  adminAuthMiddleware,
  adminController.getDigitalAssets
);
adminRoutes.get(
  '/digital/asset/view',
  adminAuthMiddleware,
  adminController.viewDigitalAsset
);
adminRoutes.post(
  '/digital/asset/create',
  adminAuthMiddleware,
  digitalAssetValidationRules(),
  validate,
  adminController.createDigitalAsset
);
adminRoutes.put(
  '/digital/asset/update',
  adminAuthMiddleware,
  digitalAssetValidationRules(),
  validate,
  adminController.updateDigitalAsset
);
adminRoutes.delete(
  '/digital/asset/delete',
  adminAuthMiddleware,
  adminController.deleteDigitalAsset
);
adminRoutes.patch(
  '/digital/asset/update/status',
  adminAuthMiddleware,
  adminController.updateDigitalAssetStatus
);

// Physical Asset
adminRoutes.get(
  '/all/physical/assets',
  adminAuthMiddleware,
  adminController.getAllPhysicalAssets
);
adminRoutes.get(
  '/physical/assets',
  adminAuthMiddleware,
  adminController.getPhysicalAssets
);
adminRoutes.get(
  '/physical/asset/view',
  adminAuthMiddleware,
  adminController.viewPhysicalAsset
);
adminRoutes.post(
  '/physical/asset/create',
  adminAuthMiddleware,
  physicalAssetValidationRules(),
  validate,
  adminController.createPhysicalAsset
);
adminRoutes.put(
  '/physical/asset/update',
  adminAuthMiddleware,
  physicalAssetValidationRules(),
  validate,
  adminController.updatePhysicalAsset
);
adminRoutes.delete(
  '/physical/asset/delete',
  adminAuthMiddleware,
  adminController.deletePhysicalAsset
);
adminRoutes.patch(
  '/physical/asset/update/status',
  adminAuthMiddleware,
  adminController.updatePhysicalAssetStatus
);

// Course
adminRoutes.post(
  '/course/:id/publish',
  adminAuthMiddleware,
  adminController.publishCourse
);
adminRoutes.get(
  '/course/fetch',
  adminAuthMiddleware,
  adminController.getAllCourses
);

// Job
adminRoutes.get(
  '/job/fetch/:userId',
  adminAuthMiddleware,
  adminController.fetchJobs
);
adminRoutes.patch(
  '/job/:id/review',
  adminAuthMiddleware,
  reviewJobValidationRules(),
  validate,
  adminController.reviewJobPost
);
adminRoutes.patch(
  '/job/:id/vet',
  adminAuthMiddleware,
  adminController.vetJobPost
);
adminRoutes.get(
  '/job/fetch',
  adminAuthMiddleware,
  adminController.fetchAllJobs
);

// Creator/Institution account vetting
adminRoutes.post(
  '/account/:userId/vet/',
  adminAuthMiddleware,
  vetAccountValidationRules(),
  validate,
  adminController.vetAccount
);

export default adminRoutes; // Export the router
