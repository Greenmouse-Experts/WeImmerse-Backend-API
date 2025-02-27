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
import { uploadKYCDocument } from '../controllers/kycController';

const kycRouter = Router();

kycRouter.post('/upload', authMiddleware, uploadKYCDocument);
kycRouter.post('/initiate-verification', authMiddleware, uploadKYCDocument);
kycRouter.post('/review', authMiddleware, uploadKYCDocument);

export default kycRouter;
