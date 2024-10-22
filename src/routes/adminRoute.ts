// src/routes/adminRoute.ts
import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';
import { adminUpdateProfileValidationRules, updatePasswordValidationRules, validate } from '../utils/validations'; // Import the service

const adminRoutes = Router();

// User routes
adminRoutes.get("/logout", adminAuthMiddleware, adminController.logout);
adminRoutes.put('/profile/update', adminAuthMiddleware, adminUpdateProfileValidationRules(), validate, adminController.updateProfile);
adminRoutes.put('/profile/update/password', adminAuthMiddleware, updatePasswordValidationRules(), validate, adminController.updatePassword);

export default adminRoutes; // Export the router
