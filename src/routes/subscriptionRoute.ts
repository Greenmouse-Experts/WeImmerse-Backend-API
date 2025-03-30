// routes/subscription.routes.ts
import { Router } from 'express';
import SubscriptionController from '../controllers/subscriptionController';
import {
  createSubscriptionPlanValidationRules,
  updateSubscriptionPlanValidationRules,
  createSubscriptionValidationRules,
  cancelSubscriptionValidationRules,
  verifyPaymentValidationRules,
  validate,
} from '../utils/validations';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// Subscription Routes (Authenticated users)
router.post(
  '/subscribe',
  authMiddleware,
  createSubscriptionValidationRules(),
  validate,
  SubscriptionController.createSubscription
);

router.get(
  '/my-subscriptions',
  authMiddleware,
  SubscriptionController.getUserSubscriptions
);

router.get(
  '/my-active-subscription',
  authMiddleware,
  SubscriptionController.getActiveSubscription
);

router.post(
  '/cancel/:id',
  authMiddleware,
  cancelSubscriptionValidationRules(),
  validate,
  SubscriptionController.cancelSubscription
);

// Payment Routes
router.post(
  '/verify-payment',
  authMiddleware,
  verifyPaymentValidationRules(),
  validate,
  SubscriptionController.verifyPayment
);

export default router;
