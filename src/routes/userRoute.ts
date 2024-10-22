// src/routes/userRoute.ts
import { Router } from 'express';
import * as userController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';
import { updatePasswordValidationRules, validate } from '../utils/validations'; // Import the service

const userRoutes = Router();

// User routes
userRoutes.get("/logout", authMiddleware, userController.logout);
userRoutes.put('/profile/update', authMiddleware, userController.updateProfile);
userRoutes.put('/profile/update/password', authMiddleware, updatePasswordValidationRules(), validate, userController.updatePassword);

export default userRoutes; // Export the router
