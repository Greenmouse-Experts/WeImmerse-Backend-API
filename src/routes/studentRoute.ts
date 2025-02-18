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
  submitQuiz,
  getAttempts,
  getLatestAttempt,
} from '../controllers/studentController';
import { generateCertificateValidationRules } from '../utils/validations/studentValidations';

const studentRoutes = Router();

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
studentRoutes.post('/course-progress/save', authMiddleware, saveCourseProgress);

/**
 * Quiz attempt
 */
studentRoutes.post('/submit-quiz', authMiddleware, submitQuiz);

studentRoutes.get('/quiz-attempt/:quizId', authMiddleware, getAttempts);

studentRoutes.get(
  '/latest-quiz-attempt/:quizId',
  authMiddleware,
  getLatestAttempt
);

/**
 * Certification
 */
studentRoutes.post(
  '/generate-certificate',
  authMiddleware,
  generateCertificateValidationRules(),
  validate,
  studentController.generateCertificate
);
studentRoutes.get(
  '/certificate/:courseId',
  authMiddleware,
  generateCertificateValidationRules(),
  validate,
  studentController.getCertificate
);

export default studentRoutes;
