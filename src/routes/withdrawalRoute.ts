import { Router } from 'express';
import {
  createWithdrawalAccount,
  getWithdrawalAccounts,
  getWithdrawalAccountById,
  updateWithdrawalAccount,
  deleteWithdrawalAccount,
  requestWithdrawal,
  approveWithdrawal,
  finalizeWithdrawal,
  fetchWithdrawalRequests,
} from '../controllers/withdrawalController';
import {
  validate,
  withdrawalAccountValidationRules,
  withdrawalRequestValidationRules,
} from '../utils/validations';
import authMiddleware from '../middlewares/authMiddleware';
import authorizeCreatorOrInstitution from '../middlewares/authorizeCreatorOrInstitution';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';

const withdrawalRoutes = Router();

// Account
withdrawalRoutes.post(
  '/account/create',
  authMiddleware,
  authorizeCreatorOrInstitution,
  withdrawalAccountValidationRules(),
  validate,
  createWithdrawalAccount
);
withdrawalRoutes.get(
  '/account/',
  authMiddleware,
  authorizeCreatorOrInstitution,
  getWithdrawalAccounts
);
withdrawalRoutes.get(
  '/account/:id',
  authMiddleware,
  authorizeCreatorOrInstitution,
  getWithdrawalAccountById
);
withdrawalRoutes.put(
  '/account/:id',
  authMiddleware,
  authorizeCreatorOrInstitution,
  updateWithdrawalAccount
);
withdrawalRoutes.delete(
  '/account/:id',
  authMiddleware,
  authorizeCreatorOrInstitution,
  deleteWithdrawalAccount
);

// Request
withdrawalRoutes.post(
  '/request',
  authMiddleware,
  authorizeCreatorOrInstitution,
  withdrawalRequestValidationRules(),
  validate,
  requestWithdrawal
);

// Request
withdrawalRoutes.get('/requests', adminAuthMiddleware, fetchWithdrawalRequests);

// Approve request
withdrawalRoutes.post(
  '/approve-request',
  adminAuthMiddleware,
  approveWithdrawal
);

withdrawalRoutes.post('/finalize', adminAuthMiddleware, finalizeWithdrawal);

export default withdrawalRoutes;
