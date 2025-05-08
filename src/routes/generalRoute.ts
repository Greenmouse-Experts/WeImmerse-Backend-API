// src/routes/generalRoute.ts
import { Router } from 'express';
import * as generalController from '../controllers/generalController';
import authMiddleware from '../middlewares/authMiddleware';
import {
  updatePasswordValidationRules,
  validateJobApplication,
  validate,
} from '../utils/validations';
import * as blogController from '../controllers/blogController';
import faqController from '../controllers/faqController';
import searchController from '../controllers/searchController';

const generalRoutes = Router();

// User routes
generalRoutes.post('/logout', authMiddleware, generalController.logout);
generalRoutes.get('/profile', authMiddleware, generalController.profile);
generalRoutes.put(
  '/profile/update',
  authMiddleware,
  generalController.updateProfile
);
generalRoutes.patch(
  '/profile/photo/update',
  authMiddleware,
  generalController.updateProfilePhoto
);
generalRoutes.put(
  '/profile/update/password',
  authMiddleware,
  updatePasswordValidationRules(),
  validate,
  generalController.updatePassword
);

generalRoutes.get(
  '/notification/settings',
  authMiddleware,
  generalController.getUserNotificationSettings
);
generalRoutes.put(
  '/update/notification/settings',
  authMiddleware,
  generalController.updateUserNotificationSettings
);

generalRoutes.post('/save/job', authMiddleware, generalController.saveJob);
generalRoutes.post(
  '/apply/job',
  authMiddleware,
  validateJobApplication(),
  validate,
  generalController.applyJob
);
generalRoutes.get(
  '/fetch/savedJob',
  authMiddleware,
  generalController.getSavedJobs
);
generalRoutes.get(
  '/fetch/appliedJob',
  authMiddleware,
  generalController.getAppliedJobs
);

generalRoutes.get('/courses', generalController.getCourses);
generalRoutes.get('/course/:id', generalController.getSingleCourse);

// Public routes
generalRoutes.get('/blogs', blogController.getBlogs);
generalRoutes.get('/blog/:slug', blogController.getBlogBySlug);

// Public routes
generalRoutes.get('/blog-category', blogController.getCategories);
generalRoutes.get('/blog-category/:slug', blogController.getCategoryBySlug);

generalRoutes.get('/faqs', faqController.getAllFAQs);

// GET /api/search?q=searchTerm
generalRoutes.get('/search', searchController.searchItems);

// GET /api/search/all?q=searchTerm
generalRoutes.get('/search/all', searchController.searchAllItems);

// GET /api/search/jobs?q=searchTerm
generalRoutes.get('/search/jobs', searchController.searchJobs);

export default generalRoutes;
