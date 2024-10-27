// src/routes/userRoute.ts
import { Router } from 'express';
import * as userController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';
import { validate } from '../utils/validations';

const userRoutes = Router();

// User routes
userRoutes.get("/logout", authMiddleware, userController.logout);

export default userRoutes;
