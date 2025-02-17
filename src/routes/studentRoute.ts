// src/routes/studentRoute.ts
import { Router } from 'express';
import * as studentController from '../controllers/studentController';
import authMiddleware from '../middlewares/authMiddleware';
import authorizeStudent from '../middlewares/authorizeStudent';
import { validate } from '../utils/validations';

import {
  getAllCourses,
  getCourseById,
  enrollCourse,
  getProgress,
  updateProgress,
  getAllCourseProgress,
  saveCourseProgress,
} from '../controllers/studentController';

const studentRoutes = Router();

// Get courses based on filters
// studentRoutes.get('courses', authMiddleware, )

/**
 * Authorized route to get all enrolled courses
 * For now - it fetches all live courses for students
 */
studentRoutes.get('/enrolled-courses', authMiddleware, getAllCourses);

/**
 * Authorized route to get a single enrolled course
 */
studentRoutes.get('/course/:id', authMiddleware, getCourseById);

/**
 * Enroll in a course
 */
studentRoutes.post('/course/:courseId/enroll', authMiddleware, enrollCourse);

/**
 * Progress tracking
 */
studentRoutes.post('/course-progress/update', authMiddleware, updateProgress);
studentRoutes.post('/course-progress/save', authMiddleware, saveCourseProgress);

export default studentRoutes;
