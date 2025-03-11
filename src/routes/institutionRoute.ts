// src/routes/institutionRoute.ts
import { Router } from 'express';
import * as institutionController from '../controllers/institutionController';
import authMiddleware from '../middlewares/authMiddleware';
import authorizeInstitution from '../middlewares/authorizeInstitution';
import { validate } from '../utils/validations';
import {
  addJobValidationRules,
  postJobValidationRules,
} from '../utils/validations/creatorValidations';

const institutionRoutes = Router();

// JOB

institutionRoutes.get(
  '/job/categories',
  authMiddleware,
  authorizeInstitution,
  institutionController.jobCategories
);
institutionRoutes.post(
  '/job/add',
  authMiddleware,
  authorizeInstitution,
  addJobValidationRules(),
  validate,
  institutionController.addJob
);
institutionRoutes.put(
  '/job/post',
  authMiddleware,
  authorizeInstitution,
  postJobValidationRules(),
  validate,
  institutionController.postJob
);
institutionRoutes.get(
  '/jobs',
  authMiddleware,
  authorizeInstitution,
  institutionController.getJobs
);
institutionRoutes.get(
  '/job/:id/details',
  authMiddleware,
  authorizeInstitution,
  institutionController.getJob
);
institutionRoutes.patch(
  '/job/close',
  authMiddleware,
  authorizeInstitution,
  institutionController.closeJob
);
institutionRoutes.delete(
  '/job/delete',
  authMiddleware,
  authorizeInstitution,
  institutionController.deleteJob
);
institutionRoutes.post(
  '/job/repost',
  authMiddleware,
  authorizeInstitution,
  institutionController.repostJob
);
institutionRoutes.get(
  '/job/applicants',
  authMiddleware,
  authorizeInstitution,
  institutionController.getJobApplicants
);
institutionRoutes.get(
  '/job/view/applicant',
  authMiddleware,
  authorizeInstitution,
  institutionController.viewApplicant
);
institutionRoutes.patch(
  '/job/reject/applicant',
  authMiddleware,
  authorizeInstitution,
  institutionController.rejectApplicant
);
institutionRoutes.post(
  '/job/download/applicant/resume',
  authMiddleware,
  authorizeInstitution,
  institutionController.downloadApplicantResume
);

export default institutionRoutes;
