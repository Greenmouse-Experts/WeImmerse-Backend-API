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
import authorizeCreatorOrInstitution from '../middlewares/authorizeCreatorOrInstitution';

const router = Router();

// Subscription Routes (Authenticated users)
router.post(
  '/subscribe',
  authMiddleware,
  authorizeCreatorOrInstitution,
  createSubscriptionValidationRules(),
  validate,
  SubscriptionController.createSubscription
);

router.get(
  '/my-subscriptions',
  authMiddleware,
  authorizeCreatorOrInstitution,
  SubscriptionController.getUserSubscriptions
);

router.get(
  '/my-active-subscription',
  authMiddleware,
  authorizeCreatorOrInstitution,
  SubscriptionController.getActiveSubscription
);

router.post(
  '/cancel/:id',
  authMiddleware,
  authorizeCreatorOrInstitution,
  cancelSubscriptionValidationRules(),
  validate,
  SubscriptionController.cancelSubscription
);

// Payment Routes
router.post(
  '/verify-payment',
  authMiddleware,
  authorizeCreatorOrInstitution,
  verifyPaymentValidationRules(),
  validate,
  SubscriptionController.verifyPayment
);

export default router;
