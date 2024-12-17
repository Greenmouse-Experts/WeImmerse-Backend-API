// src/routes/generalRoute.ts
import { Router } from 'express';
import * as generalController from '../controllers/generalController';
import authMiddleware from '../middlewares/authMiddleware';
import { updatePasswordValidationRules, validate } from '../utils/validations';

const generalRoutes = Router();

// User routes
generalRoutes.post("/logout", authMiddleware, generalController.logout);
generalRoutes.get('/profile', authMiddleware, generalController.profile);
generalRoutes.put('/profile/update', authMiddleware, generalController.updateProfile);
generalRoutes.patch('/profile/photo/update', authMiddleware, generalController.updateProfilePhoto);
generalRoutes.put('/profile/update/password', authMiddleware, updatePasswordValidationRules(), validate, generalController.updatePassword);

generalRoutes.get('/notification/settings', authMiddleware, generalController.getUserNotificationSettings);
generalRoutes.put('/update/notification/settings', authMiddleware, generalController.updateUserNotificationSettings);

export default generalRoutes;
