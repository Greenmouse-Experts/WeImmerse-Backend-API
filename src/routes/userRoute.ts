// src/routes/userRoute.ts
import { Router } from 'express';
import * as userController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';
import authorizeUser from '../middlewares/authorizeUser';
import { validate } from '../utils/validations';

const userRoutes = Router();

export default userRoutes;
