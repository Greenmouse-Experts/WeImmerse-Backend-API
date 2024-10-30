// src/routes/userRoute.ts
import { Router } from 'express';
import * as vendorController from '../controllers/vendorController';
import authMiddleware from '../middlewares/authMiddleware';
import authorizeVendor from '../middlewares/authorizeVendor';
import { kycValidationRules, validate } from '../utils/validations';

const userRoutes = Router();

// User routes
userRoutes.post("/kyc", authMiddleware, authorizeVendor, kycValidationRules(), validate, vendorController.submitOrUpdateKYC);
userRoutes.get("/kyc", authMiddleware, vendorController.submitOrUpdateKYC);

export default userRoutes;
