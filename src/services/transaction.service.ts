import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import Transaction, { ProductType } from '../models/transaction';
import DigitalAsset from '../models/digitalasset';
import PhysicalAsset from '../models/physicalasset';
import Course, { CourseStatus } from '../models/course';
import User from '../models/user';
import UserDigitalAsset from '../models/userdigitalasset';
import PhysicalAssetOrder from '../models/physicalassetorder';
import CourseEnrollment from '../models/courseenrollment';
import {
  PaymentType,
  PaymentStatus,
  PaymentMethod,
} from '../models/transaction';
import { PaystackService } from './paystack.service';
import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
  BadRequestError,
} from '../utils/ApiError';
import logger from '../middlewares/logger';
import { sendMail } from './mail.service';
import { emailTemplates } from '../utils/messages';

class TransactionService {
  /**
   * Initiate a new purchase transaction
   */
  static async initiatePurchase({
    userId,
    productType,
    productId,
    paymentMethod = PaymentMethod.PAYSTACK,
    amount,
    currency = 'NGN',
    shippingAddress,
  }: {
    userId: string;
    productType: string;
    productId: string;
    paymentMethod?: PaymentMethod;
    amount: number;
    currency?: string;
    shippingAddress?: any;
  }) {
    // Verify the product exists and is available for purchase
    const { product, creator } = await this.verifyProduct(
      productType,
      productId,
      amount,
      currency,
      userId
    );

    // Generate transaction reference
    const reference = `TXN-${uuidv4()}`;

    // Create transaction record
    const transaction = await Transaction.create({
      productId,
      userId,
      amount,
      currency,
      paymentMethod,
      paymentType: productType as PaymentType,
      paymentGateway: 'paystack',
      gatewayReference: reference,
      status: PaymentStatus.PENDING,
      metadata: {
        productName: this.getProductName(productType, product),
        creatorId: creator!.id,
        shippingAddress,
      },
    });

    try {
      // Get user email for payment processing
      const user = await User.findByPk(userId);
      if (!user) throw new NotFoundError('User not found');

      // Initialize payment with payment processor
      const paymentLink = await PaystackService.initializePayment(
        reference,
        amount,
        currency,
        user.email,
        {
          transactionId: transaction.id,
          userId,
          productType,
          productId,
        }
      );

      return {
        ...transaction.toJSON(),
        paymentLink,
      };
    } catch (error) {
      // Update transaction status if initialization fails
      await transaction.update({ status: PaymentStatus.FAILED });
      logger.error('Payment initialization failed:', error);
      throw error;
    }
  }

  /**
   * Verify a payment transaction
   */
  static async verifyPayment(reference: string, userId: string) {
    // Find transaction record
    const transaction = await Transaction.findOne({
      where: { gatewayReference: reference, userId },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    // Skip if already completed
    if (transaction.status === PaymentStatus.COMPLETED) {
      return transaction;
    }

    try {
      // Verify with payment processor
      const verification = await PaystackService.verifyPayment(reference);

      if (verification.data.status === 'abandoned') {
        throw new BadRequestError('Purchase has not been paid for yet!');
      }

      // Update transaction status based on verification
      let newStatus = PaymentStatus.FAILED;
      if (verification.data.status === 'success') {
        newStatus = PaymentStatus.COMPLETED;
      }

      await transaction.update({ status: newStatus });

      // If transaction is successful, complete the purchase
      if (newStatus === PaymentStatus.COMPLETED) {
        await this.completePurchase(transaction);
      }

      return transaction;
    } catch (error) {
      logger.error('Payment verification failed:', error);
      throw error;
    }
  }

  /**
   * Get purchase history for a user
   */
  static async getPurchaseHistory(userId: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Transaction.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return {
      total: count,
      page,
      limit,
      data: rows,
    };
  }

  /**
   * Get details of a specific purchase
   */
  static async getPurchaseDetails(transactionId: string, userId: string) {
    const transaction = await Transaction.findOne({
      where: { id: transactionId, userId },
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    return transaction;
  }

  /**
   * Process payment webhook notifications
   */
  static async processWebhook(payload: any) {
    const { event, data } = payload;

    // We only process successful charge events
    if (event !== 'charge.success') {
      logger.info('Skipping non-charge webhook event', { event });
      return { processed: false, reason: 'Non-charge event' };
    }

    const { reference, status, amount, metadata } = data;

    // Find transaction record
    const transaction = await Transaction.findOne({
      where: { gatewayReference: reference },
    });

    if (!transaction) {
      logger.error('Transaction not found for webhook', { reference });
      throw new NotFoundError('Transaction not found');
    }

    // Skip if already completed
    if (transaction.status === PaymentStatus.COMPLETED) {
      logger.info('Transaction already completed', {
        transactionId: transaction.id,
      });
      return {
        processed: false,
        reason: 'Transaction already completed',
        transactionId: transaction.id,
      };
    }

    // Convert amount from kobo to Naira (or equivalent)
    const amountInMajor = amount / 100;

    // Validate amount matches
    if (amountInMajor !== transaction.amount) {
      logger.error('Amount mismatch in webhook', {
        expected: transaction.amount,
        received: amountInMajor,
        transactionId: transaction.id,
      });
      throw new ForbiddenError('Amount mismatch');
    }

    // Update transaction status based on verification
    const newStatus =
      status === 'success' ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;

    await transaction.update({
      status: newStatus,
      metadata: {
        ...transaction.metadata,
        webhookData: data,
        processedAt: new Date().toISOString(),
      },
    });

    // If transaction is successful, complete the purchase
    if (newStatus === PaymentStatus.COMPLETED) {
      await this.completePurchase(transaction);

      logger.info('Purchase completed successfully', {
        transactionId: transaction.id,
        productType: transaction.paymentType,
        productId: transaction.productId,
      });
    }

    return {
      processed: true,
      transactionId: transaction.id,
      status: newStatus,
      productType: transaction.paymentType,
      productId: transaction.productId,
    };
  }

  /**
   * Verify product availability and pricing
   */
  private static async verifyProduct(
    productType: string,
    productId: string,
    amount: number,
    currency: string,
    userId: string
  ) {
    let product;
    let creator;

    switch (productType) {
      case 'digital_asset':
        product = (await DigitalAsset.findOne({
          where: { id: productId, status: 'published' },
          include: [{ association: 'user' }],
        })) as DigitalAsset & { user: User };

        if (!product)
          throw new NotFoundError('Digital asset not found or not available');

        // Check existing ownership
        const existingOwnership = await UserDigitalAsset.findOne({
          where: { userId, assetId: productId },
        });
        if (existingOwnership)
          throw new ConflictError('You already own this digital asset');

        if (product.pricingType === 'One-Time-Purchase') {
          if (!product.currency || !product.amount) {
            throw new ForbiddenError(
              'Digital asset not properly configured for purchase'
            );
          }
          if (product.currency !== currency || product.amount !== amount) {
            throw new ForbiddenError('Invalid payment amount or currency');
          }
        } else if (product.pricingType === 'Free' && amount !== 0) {
          throw new ForbiddenError('This is a free asset');
        }
        creator = product.user;
        break;

      case 'physical_asset':
        product = (await PhysicalAsset.findOne({
          where: { id: productId, status: 'published' },
          include: [{ association: 'user' }],
        })) as PhysicalAsset & { user: User };

        if (!product)
          throw new NotFoundError('Physical asset not found or not available');
        if (!product.currency || !product.amount) {
          throw new ForbiddenError(
            'Physical asset not properly configured for purchase'
          );
        }
        if (product.currency !== currency || product.amount !== amount) {
          throw new ForbiddenError('Invalid payment amount or currency');
        }
        creator = product.user;
        break;

      case 'course':
        product = await Course.findOne({
          where: { id: productId, status: CourseStatus.LIVE, published: true },
          include: [{ association: 'creator' }],
        });

        if (!product)
          throw new NotFoundError('Course not found or not available');

        // Check existing enrollment
        const existingEnrollment = await CourseEnrollment.findOne({
          where: { userId, courseId: productId },
        });
        if (existingEnrollment)
          throw new ConflictError('You are already enrolled in this course');

        if (product.price === 0 && amount !== 0) {
          throw new ForbiddenError('This is a free course');
        } else if (product.price > 0) {
          if (!product.currency)
            throw new ForbiddenError('Course not properly configured');
          if (product.currency !== currency || product.price !== amount) {
            throw new ForbiddenError('Invalid payment amount or currency');
          }
        }
        creator = product.creator;
        break;

      default:
        throw new NotFoundError('Invalid product type');
    }

    return { product, creator };
  }

  /**
   * Complete the purchase process after successful payment
   */
  private static async completePurchase(transaction: Transaction) {
    // Grant access based on product type
    switch (transaction.paymentType) {
      case ProductType.DIGITAL_ASSET:
        await UserDigitalAsset.create({
          userId: transaction.userId,
          assetId: transaction.productId,
          transactionId: transaction.id,
          accessGrantedAt: new Date(),
        });
        break;

      case ProductType.PHYSICAL_ASSET:
        await PhysicalAssetOrder.create({
          userId: transaction.userId,
          assetId: transaction.productId,
          transactionId: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          shippingAddress: transaction.metadata.shippingAddress || {},
          status: 'processing',
        });
        break;

      case ProductType.COURSE:
        await CourseEnrollment.create({
          userId: transaction.userId,
          courseId: transaction.productId,
          enrolledAt: new Date(),
          transactionId: transaction.id,
        });
        break;
    }

    // Send purchase confirmation email
    await this.sendPurchaseConfirmation(transaction);
  }

  /**
   * Send purchase confirmation email
   */
  private static async sendPurchaseConfirmation(transaction: Transaction) {
    try {
      const user = await User.findByPk(transaction.userId);
      if (!user) return;

      let productName = '';
      let productTypeName = '';

      switch (transaction.paymentType) {
        case ProductType.DIGITAL_ASSET:
          productTypeName = 'Digital Asset';
          const digitalAsset = await DigitalAsset.findByPk(
            transaction.productId!
          );
          productName = digitalAsset?.assetName || 'Digital Asset';
          break;
        case ProductType.PHYSICAL_ASSET:
          productTypeName = 'Physical Asset';
          const physicalAsset = await PhysicalAsset.findByPk(
            transaction.productId!
          );
          productName = physicalAsset?.assetName || 'Physical Asset';
          break;
        case ProductType.COURSE:
          productTypeName = 'Course';
          const course = await Course.findByPk(transaction.productId!);
          productName = course?.title || 'Course';
          break;
      }

      const emailContent = emailTemplates.sendPurchaseConfirmation({
        user,
        productName,
        productType: productTypeName,
        amount: transaction.amount,
        currency: transaction.currency,
        transactionId: transaction.id,
        paymentMethod: transaction.paymentMethod,
      });

      await sendMail(
        user.email,
        `Purchase Confirmation - ${productName}`,
        emailContent
      );
    } catch (error) {
      logger.error('Error sending purchase confirmation email:', error);
    }
  }

  /**
   * Helper to get product name based on type
   */
  private static getProductName(productType: string, product: any): string {
    switch (productType) {
      case 'digital_asset':
        return product.assetName;
      case 'physical_asset':
        return product.assetName;
      case 'course':
        return product.title || 'Course';
      default:
        return 'Product';
    }
  }

  /**
   * Refund a transaction
   */
  static async refundTransaction(transactionId: string, userId: string) {
    const transaction = await Transaction.findOne({
      where: { id: transactionId, userId },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    if (transaction.status !== PaymentStatus.COMPLETED) {
      throw new ForbiddenError('Only completed transactions can be refunded');
    }

    try {
      // Process refund with payment processor
      const refund = await PaystackService.initiateRefund(
        transaction.gatewayReference!,
        transaction.amount
      );

      // Update transaction status
      await transaction.update({
        status: PaymentStatus.REFUNDED,
        metadata: {
          ...transaction.metadata,
          refundReference: refund.data.transaction.reference,
        },
      });

      // Reverse the purchase based on product type
      await this.reversePurchase(transaction);

      return transaction;
    } catch (error) {
      logger.error('Refund failed:', error);
      throw error;
    }
  }

  /**
   * Reverse a purchase (used for refunds)
   */
  private static async reversePurchase(transaction: Transaction) {
    switch (transaction.paymentType) {
      case ProductType.DIGITAL_ASSET:
        await UserDigitalAsset.destroy({
          where: {
            userId: transaction.userId,
            assetId: transaction.productId,
            transactionId: transaction.id,
          },
        });
        break;

      case ProductType.COURSE:
        await CourseEnrollment.destroy({
          where: {
            userId: transaction.userId,
            courseId: transaction.productId,
            transactionId: transaction.id,
          },
        });
        break;

      case ProductType.PHYSICAL_ASSET:
        // For physical assets, we typically can't reverse the shipment
        // but we can mark the order as refunded
        await PhysicalAssetOrder.update(
          { status: 'refunded' },
          {
            where: {
              userId: transaction.userId,
              assetId: transaction.productId,
              transactionId: transaction.id,
            },
          }
        );
        break;
    }
  }
}

export default TransactionService;
