// src/routes/userRoute.ts
import { Router } from 'express';
import * as userController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';
import { updatePasswordValidationRules, updateProfileEmailValidationRules, confirmProfileEmailValidationRules, updateProfilePhoneNumberValidationRules, confirmProfilePhoneNumberValidationRules, validate } from '../utils/validations';

const userRoutes = Router();

// User routes
userRoutes.get("/logout", authMiddleware, userController.logout);
userRoutes.put('/profile/update', authMiddleware, userController.updateProfile);
userRoutes.put('/profile/update/email', authMiddleware, updateProfileEmailValidationRules(), validate, userController.updateProfileEmail);
userRoutes.put('/profile/confirm/email', authMiddleware, confirmProfileEmailValidationRules(), validate, userController.confirmEmailUpdate);
userRoutes.put('/profile/update/phone', authMiddleware, updateProfilePhoneNumberValidationRules(), validate, userController.updateProfilePhoneNumber);
userRoutes.put('/profile/confirm/phone/number', authMiddleware, confirmProfilePhoneNumberValidationRules(), validate, userController.confirmPhoneNumberUpdate);
userRoutes.put('/profile/update/password', authMiddleware, updatePasswordValidationRules(), validate, userController.updatePassword);

export default userRoutes;
