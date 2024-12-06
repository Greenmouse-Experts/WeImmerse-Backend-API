// src/routes/generalRoute.ts
import { Router } from 'express';
import * as userController from '../controllers/generalController';
import authMiddleware from '../middlewares/authMiddleware';
import { updatePasswordValidationRules, updateProfileEmailValidationRules, confirmProfileEmailValidationRules, updateProfilePhoneNumberValidationRules, confirmProfilePhoneNumberValidationRules, validateSendMessage, validate } from '../utils/validations';

const generalRoutes = Router();

// User routes
generalRoutes.post("/logout", authMiddleware, userController.logout);
generalRoutes.get('/profile', authMiddleware, userController.profile);
generalRoutes.put('/profile/update', authMiddleware, userController.updateProfile);
generalRoutes.patch('/profile/photo/update', authMiddleware, userController.updateProfilePhoto);
generalRoutes.put('/profile/update/password', authMiddleware, updatePasswordValidationRules(), validate, userController.updatePassword);

generalRoutes.get('/notification/settings', authMiddleware, userController.getUserNotificationSettings);
generalRoutes.put('/update/notification/settings', authMiddleware, userController.updateUserNotificationSettings);

export default generalRoutes;
