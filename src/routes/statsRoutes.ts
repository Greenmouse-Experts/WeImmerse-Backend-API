import { Router } from 'express';
import * as statsController from '../controllers/statsController';
import authMiddleware from '../middlewares/authMiddleware';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';

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

export default router;
