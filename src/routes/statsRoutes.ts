import { Router } from 'express';
import * as statsController from '../controllers/statsController';
import authMiddleware from '../middlewares/authMiddleware';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';
import authorizeInstitution from '../middlewares/authorizeInstitution';

const router = Router();

router.get(
  '/creator/landing',
  authMiddleware,
  statsController.getCreatorStatistics
);

router.get(
  '/admin/landing',
  adminAuthMiddleware,
  statsController.getAdminStats
);

router.get('/user/landing', authMiddleware, statsController.getUserStatistics);

router.get(
  '/institution/landing',
  authMiddleware,
  authorizeInstitution,
  statsController.getInstitutionStatistics
);

export default router;
