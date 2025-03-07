// src/routes/institutionRoute.ts
import { Router } from 'express';
import * as institutionController from '../controllers/institutionController';
import authMiddleware from '../middlewares/authMiddleware';
import authorizeInstitution from '../middlewares/authorizeInstitution';
import { validate } from '../utils/validations';

const institutionRoutes = Router();

// institutionRoutes.post(
//   '/upload',
//   authMiddleware,
//   uploadKycDocumentValidationRules(),
//   validate,
//   uploadKYCDocument
// );

export default institutionRoutes;
