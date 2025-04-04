import { Router } from 'express';
import * as purchaseController from '../controllers/purchaseController';
import {
  initiatePurchaseValidationRules,
  verifyPaymentValidationRules,
  webhookValidationRules,
  validate,
} from '../utils/validations';
import authMiddleware from '../middlewares/authMiddleware';
import { webhookAuth } from '../middlewares/webhookAuth';

const purchaseRoutes = Router();

// Purchase routes
purchaseRoutes.post(
  '/initiate',
  authMiddleware,
  initiatePurchaseValidationRules(),
  validate,
  purchaseController.initiatePurchase
);

purchaseRoutes.post(
  '/verify',
  authMiddleware,
  verifyPaymentValidationRules(),
  validate,
  purchaseController.verifyPayment
);

purchaseRoutes.get(
  '/history',
  authMiddleware,
  purchaseController.getPurchaseHistory
);

purchaseRoutes.get(
  '/details/:paymentId',
  authMiddleware,
  purchaseController.getPurchaseDetails
);

// Webhook route (no auth needed)
purchaseRoutes.post(
  '/webhook',
  webhookAuth,
  webhookValidationRules(),
  validate,
  purchaseController.paymentWebhook
);

export default purchaseRoutes;
