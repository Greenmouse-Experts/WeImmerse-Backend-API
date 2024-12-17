// src/routes/studentRoute.ts
import { Router } from 'express';
import * as studentController from '../controllers/studentController';
import authMiddleware from '../middlewares/authMiddleware';
import authorizeStudent from '../middlewares/authorizeStudent';
import { 
    validate } from '../utils/validations';

const studentRoutes = Router();


export default studentRoutes;
