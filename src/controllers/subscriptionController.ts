// controllers/subscription.controller.ts
import { Request, Response } from 'express';
import SubscriptionService from '../services/subscription.service';
import {
  createSubscriptionPlanValidationRules,
  updateSubscriptionPlanValidationRules,
  createSubscriptionValidationRules,
  cancelSubscriptionValidationRules,
  verifyPaymentValidationRules,
} from '../utils/validations';

class SubscriptionController {
  // Subscription Handling
  async createSubscription(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // Assuming user ID is in the request
      const email = (req as any).user.email;

      const activeSubscription =
        await SubscriptionService.getActiveSubscription(userId);

      if (activeSubscription) {
        throw new Error('You already have an active subscription.');
      }

      const subscription = await SubscriptionService.createSubscription({
        userId,
        ...req.body,
      });

      // Initialize payment
      const plan = await SubscriptionService.getPlanById(req.body.planId);
      if (!plan) throw new Error('Plan not found');

      const payment = await SubscriptionService.initializePayment(
        { id: userId, email },
        subscription.id,
        plan.price,
        plan.currency,
        req.body.paymentMethod
      );

      res.status(201).json({
        message: 'Subscription initiated successfully.',
        subscription,
        payment,
      });
    } catch (error: any) {
      res.status(400).json({ status: false, message: error.message });
    }
  }

  async getUserSubscriptions(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const subscriptions = await SubscriptionService.getUserSubscriptions(
        userId
      );
      res.json({ status: true, data: subscriptions });
    } catch (error: any) {
      res.status(400).json({ status: false, message: error.message });
    }
  }

  async getActiveSubscription(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const subscription = await SubscriptionService.getActiveSubscription(
        userId
      );
      res.json({ status: true, data: subscription });
    } catch (error: any) {
      res.status(400).json({ status: false, message: error.message });
    }
  }

  async cancelSubscription(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const subscription = await SubscriptionService.cancelSubscription(
        req.params.id,
        userId
      );
      res.json({
        status: true,
        message: 'Subscription cancelled successfully.',
        data: subscription,
      });
    } catch (error: any) {
      res.status(400).json({ status: false, message: error.message });
    }
  }

  // Payment Processing
  async verifyPayment(req: Request, res: Response) {
    try {
      const result = await SubscriptionService.verifyPayment(
        req.body.reference
      );
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ status: false, message: error.message });
    }
  }
}

export default new SubscriptionController();
