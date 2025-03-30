// middlewares/subscription.middleware.ts
import { Request, Response, NextFunction } from 'express';
import SubscriptionService from '../services/subscription.service';

export function hasActiveSubscription(feature?: string | any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const subscription = await SubscriptionService.getActiveSubscription(
        userId
      );

      if (!subscription) {
        return res.status(403).json({
          message: 'Active subscription required to access this feature',
        });
      }

      // Check for specific feature if provided
      if (feature) {
        const plan = await SubscriptionService.getPlanById(subscription.planId);
        if (!plan?.features.includes(feature)) {
          return res.status(403).json({
            message: 'Your subscription plan does not include this feature',
          });
        }
      }

      (req as any).subscription = subscription;
      next();
    } catch (error) {
      next(error);
    }
  };
}
