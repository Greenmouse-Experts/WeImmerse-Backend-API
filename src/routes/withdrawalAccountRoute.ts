import { Router } from 'express';
import {
  createWithdrawalAccount,
  getWithdrawalAccounts,
  getWithdrawalAccountById,
  updateWithdrawalAccount,
  deleteWithdrawalAccount,
} from '../controllers/withdrawalAccountController';
import {
  validate,
  withdrawalAccountValidationRules,
} from '../utils/validations';
import authMiddleware from '../middlewares/authMiddleware';

const withdrawalAccountRoutes = Router();

withdrawalAccountRoutes.post(
  '/create',
  authMiddleware,
  withdrawalAccountValidationRules(),
  validate,
  createWithdrawalAccount
);
withdrawalAccountRoutes.get('/', authMiddleware, getWithdrawalAccounts);
withdrawalAccountRoutes.get('/:id', authMiddleware, getWithdrawalAccountById);
withdrawalAccountRoutes.put('/:id', authMiddleware, updateWithdrawalAccount);
withdrawalAccountRoutes.delete('/:id', authMiddleware, deleteWithdrawalAccount);

export default withdrawalAccountRoutes;
