import { Request, Response } from 'express';
import TransactionService from '../services/transaction.service';
import logger from '../middlewares/logger';
import { ForbiddenError } from '../utils/ApiError';
import { PaystackService } from '../services/paystack.service';
import Transaction from '../models/transaction';

export const initiatePurchase = async (req: Request, res: Response) => {
  try {
    const {
      productType,
      productId,
      paymentMethod,
      amount,
      currency,
      shippingAddress,
    } = req.body;
    const userId = (req.user as any).id;

    const transaction = await TransactionService.initiatePurchase({
      userId,
      productType,
      productId,
      paymentMethod,
      amount,
      currency,
      shippingAddress,
    });

    res.status(201).json({
      status: true,
      message: 'Purchase initiated successfully',
      data: transaction,
    });
  } catch (error: any) {
    logger.error('Error initiating purchase:', error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { reference } = req.body;
    const userId = (req.user as any).id;

    const transaction = await TransactionService.verifyPayment(
      reference,
      userId
    );

    res.status(200).json({
      status: true,
      message: 'Payment verified successfully',
      data: transaction,
    });
  } catch (error: any) {
    logger.error('Error verifying payment:', error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const initiatePurchaseV2 = async (req: Request, res: Response) => {
  try {
    const {
      productType,
      productId,
      paymentMethod,
      amount,
      currency,
      shippingAddress,
      items,
      couponCode,
    } = req.body;
    const userId = (req.user as any).id;

    // const transaction = await TransactionService.initiatePurchase({
    //   userId,
    //   productType,
    //   productId,
    //   paymentMethod,
    //   amount,
    //   currency,
    //   shippingAddress,
    // });
    const transaction = await TransactionService.initiateMultiItemPurchase({
      userId,
      items,
      couponCode,
      paymentMethod,
      currency,
      shippingAddress,
    });

    res.status(201).json({
      status: true,
      message: 'Purchase initiated successfully',
      data: transaction,
    });
  } catch (error: any) {
    logger.error('Error initiating purchase:', error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const verifyPaymentV2 = async (req: Request, res: Response) => {
  try {
    const { reference } = req.body;
    const userId = (req.user as any).id;

    const transaction = await TransactionService.completeMultiItemPurchase(
      reference,
      userId
    );

    res.status(200).json({
      status: true,
      message: 'Payment verified successfully',
      data: transaction,
    });
  } catch (error: any) {
    logger.error('Error verifying payment:', error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const getPurchaseHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { page = 1, limit = 10 } = req.query;

    const history = await TransactionService.getPurchaseHistory(
      userId,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.status(200).json({
      status: true,
      message: 'Purchase history retrieved successfully',
      data: history,
    });
  } catch (error: any) {
    logger.error('Error fetching purchase history:', error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const getPurchaseDetails = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const userId = (req.user as any).id;

    const transaction = await TransactionService.getPurchaseDetails(
      paymentId,
      userId
    );

    res.status(200).json({
      status: true,
      message: 'Purchase details retrieved successfully',
      data: transaction,
    });
  } catch (error: any) {
    logger.error('Error fetching purchase details:', error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const paymentWebhook = async (req: Request, res: Response) => {
  try {
    // Verify the webhook signature for security
    const signature = req.headers['x-paystack-signature'] as string;
    if (!signature) {
      throw new ForbiddenError('Missing webhook signature');
    }

    const isValid = PaystackService.verifyWebhookSignature(
      JSON.stringify(req.body),
      signature
    );

    if (!isValid) {
      throw new ForbiddenError('Invalid webhook signature');
    }

    // Process the webhook
    const result = await TransactionService.processWebhook(req.body);

    res.status(200).json({
      status: true,
      message: 'Webhook processed successfully',
      data: result,
    });
  } catch (error: any) {
    logger.error('Error processing webhook:', {
      error: error.message,
      body: req.body,
      headers: req.headers,
    });

    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || 'Internal server error',
    });
  }
};
