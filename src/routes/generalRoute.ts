// src/routes/generalRoute.ts
import { Router } from 'express';
import * as generalController from '../controllers/generalController';
import authMiddleware from '../middlewares/authMiddleware';
import { updatePasswordValidationRules, validateJobApplication, validate } from '../utils/validations';

const generalRoutes = Router();

// User routes
generalRoutes.post("/logout", authMiddleware, generalController.logout);
generalRoutes.get('/profile', authMiddleware, generalController.profile);
generalRoutes.get('/profile', authMiddleware, generalController.profile);
generalRoutes.put('/profile/update', authMiddleware, generalController.updateProfile);
generalRoutes.patch('/profile/photo/update', authMiddleware, generalController.updateProfilePhoto);
generalRoutes.put('/profile/update/password', authMiddleware, updatePasswordValidationRules(), validate, generalController.updatePassword);

generalRoutes.get('/notification/settings', authMiddleware, generalController.getUserNotificationSettings);
generalRoutes.put('/update/notification/settings', authMiddleware, generalController.updateUserNotificationSettings);

generalRoutes.post('/save/job', authMiddleware, generalController.saveJob);
generalRoutes.post('/apply/job', authMiddleware, validateJobApplication(), validate, generalController.applyJob);
generalRoutes.get('/fetch/savedJob', authMiddleware, generalController.getSavedJobs);
generalRoutes.get('/fetch/appliedJob', authMiddleware, generalController.getAppliedJobs);

export default generalRoutes;
