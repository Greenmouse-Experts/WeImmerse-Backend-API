import { Router } from 'express';
import * as purchaseController from '../controllers/purchaseController';
import {
  initiatePurchaseValidationRules,
  verifyPaymentValidationRules,
  webhookValidationRules,
  validate,
  initiateMultiPurchaseValidationRules,
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

// Purchase routes
purchaseRoutes.post(
  '/initiate-trx',
  authMiddleware,
  initiateMultiPurchaseValidationRules(),
  validate,
  purchaseController.initiatePurchaseV2
);

purchaseRoutes.post(
  '/verify-trx',
  authMiddleware,
  verifyPaymentValidationRules(),
  validate,
  purchaseController.verifyPaymentV2
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
