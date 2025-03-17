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
  uploadKycDocumentValidationRules,
} from '../utils/validations'; // Import the service
import authMiddleware from '../middlewares/authMiddleware';
import {
  getKYCDocuments,
  reviewKYC,
  uploadKYCDocument,
} from '../controllers/kycController';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';

const kycRouter = Router();

kycRouter.post(
  '/upload',
  authMiddleware,
  uploadKycDocumentValidationRules(),
  validate,
  uploadKYCDocument
);
// kycRouter.post(
//   '/initiate-verification',
//   authMiddleware,
//   initiateKYCVerification
// );
kycRouter.post('/review', adminAuthMiddleware, reviewKYC);
kycRouter.get('/fetch/:userId', adminAuthMiddleware, getKYCDocuments);

export default kycRouter;
