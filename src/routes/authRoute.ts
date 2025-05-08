// src/routes/authroute.ts
import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as frontendController from '../controllers/frontendController';
import {
  userRegistrationValidationRules,
  studentRegistrationValidationRules,
  creatorRegistrationValidationRules,
  institutionRegistrationValidationRules,
  verificationValidationRules,
  loginValidationRules,
  resendVerificationValidationRules,
  forgotPasswordValidationRules,
  resetPasswordValidationRules,
  validate,
} from '../utils/validations'; // Import the service
import authMiddleware from '../middlewares/authMiddleware';
import authorizeCreatorOrInstitution from '../middlewares/authorizeCreatorOrInstitution';
import upload from '../utils/multer';

const authRoutes = Router();

// Auth routes
authRoutes.get('/', authController.index);
authRoutes.post(
  '/auth/register/user',
  userRegistrationValidationRules(),
  validate,
  authController.userRegister
);
authRoutes.post(
  '/auth/register/institution',
  institutionRegistrationValidationRules(),
  validate,
  authController.institutionRegister
);
authRoutes.post(
  '/auth/register/creator',
  creatorRegistrationValidationRules(),
  validate,
  authController.creatorRegister
);
authRoutes.post(
  '/auth/register/student',
  studentRegistrationValidationRules(),
  validate,
  authController.studentRegister
);
authRoutes.post(
  '/auth/verify/email',
  verificationValidationRules(),
  validate,
  authController.verifyEmail
);
authRoutes.post(
  '/auth/login',
  loginValidationRules(),
  validate,
  authController.login
);
authRoutes.post(
  '/auth/resend/verification/email',
  resendVerificationValidationRules(),
  validate,
  authController.resendVerificationEmail
);
authRoutes.post(
  '/auth/password/forgot',
  forgotPasswordValidationRules(),
  validate,
  authController.forgetPassword
);
authRoutes.post(
  '/auth/password/code/check',
  verificationValidationRules(),
  validate,
  authController.codeCheck
);
authRoutes.post(
  '/auth/password/reset',
  resetPasswordValidationRules(),
  validate,
  authController.resetPassword
);

// Admin
authRoutes.post(
  '/auth/admin/login',
  loginValidationRules(),
  validate,
  authController.adminLogin
);

// Frontend
authRoutes.get('/fetch/digital/assets', frontendController.fetchDigitalAssets);
authRoutes.get('/view/digital/asset', frontendController.viewDigitalAsset);
authRoutes.get(
  '/fetch/physical/assets',
  frontendController.fetchPhysicalAssets
);
authRoutes.get('/view/physical/asset', frontendController.viewPhysicalAsset);
authRoutes.get('/fetch/jobs', frontendController.fetchJobs);
authRoutes.get('/view/job', frontendController.viewJob);

// Subscription plan
authRoutes.get(
  '/subscription-plans/fetch',
  authMiddleware,
  authorizeCreatorOrInstitution,
  authController.getAllSubscriptionPlans
);

authRoutes.post(
  '/upload-multiple',
  authMiddleware,
  upload.array('files', 5),
  authController.uploadImages
);

export default authRoutes; // Export the router
