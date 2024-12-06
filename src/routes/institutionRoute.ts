// src/routes/institutionRoute.ts
import { Router } from 'express';
import * as vendorController from '../controllers/studentController';
import authMiddleware from '../middlewares/authMiddleware';
import authorizeVendor from '../middlewares/authorizeVendor';
import { 
    kycValidationRules, 
    createStoreValidation, 
    updateStoreValidation, 
    addProductValidation,
    updateProductValidation,
    auctionProductValidation,
    updateAuctionProductValidation,
    validate } from '../utils/validations';

const institutionRoutes = Router();


export default institutionRoutes;
