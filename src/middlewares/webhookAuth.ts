// src/middlewares/webhookAuth.ts
import { Request, Response, NextFunction } from 'express';
import { PaystackService } from '../services/paystack.service';
import { ForbiddenError } from '../utils/ApiError';

export const webhookAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.headers['x-paystack-signature'];
  if (!signature) {
    throw new ForbiddenError('Missing webhook signature');
  }

  const isValid = PaystackService.verifyWebhookSignature(
    JSON.stringify(req.body),
    signature as string
  );

  if (!isValid) {
    throw new ForbiddenError('Invalid webhook signature');
  }

  next();
};
