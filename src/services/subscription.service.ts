// services/subscription.service.ts
import { Op } from 'sequelize';
import SubscriptionPlan from '../models/subscriptionplan';
import Subscription from '../models/subscription';
import Transaction from '../models/transaction';
import { sendEmail } from '../utils/email';
import { calculateEndDate } from '../utils/date';
import { PaystackService } from './paystack.service';

class SubscriptionService {
  // Subscription Plan Management
  async createPlan(data: {
    name: string;
    description?: string;
    duration: number;
    price: number;
    currency?: string;
    period: 'Monthly' | 'Quarterly' | 'Yearly';
    features?: string[];
  }) {
    return await SubscriptionPlan.create({
      ...data,
      currency: data.currency || 'NGN',
      features: data.features || [],
    });
  }

  async getPlans(isActive = true) {
    return await SubscriptionPlan.findAll({
      where: isActive ? { isActive: true } : {},
      order: [['price', 'ASC']],
    });
  }

  async getPlanById(id: string) {
    return await SubscriptionPlan.findByPk(id);
  }

  async updatePlan(id: string, data: any) {
    const plan = await SubscriptionPlan.findByPk(id);
    if (!plan) throw new Error('Subscription plan not found');

    return await plan.update(data);
  }

  async deletePlan(id: string) {
    const plan = await SubscriptionPlan.findByPk(id);
    if (!plan) throw new Error('Subscription plan not found');

    // Check if any subscriptions exist for this plan
    const subscriptions = await Subscription.count({ where: { planId: id } });
    if (subscriptions > 0) {
      throw new Error('Cannot delete plan with active subscriptions');
    }

    await plan.destroy();
    return true;
  }

  // Subscription Handling
  async createSubscription(data: {
    userId: string;
    planId: string;
    paymentMethod: string;
    isAutoRenew?: boolean;
  }) {
    const plan = await SubscriptionPlan.findByPk(data.planId);
    if (!plan) throw new Error('Subscription plan not found');

    const startDate = new Date();
    const endDate = calculateEndDate(startDate, plan.duration);

    return await Subscription.create({
      userId: data.userId,
      planId: data.planId,
      startDate,
      endDate,
      status: 'pending',
      isAutoRenew: data.isAutoRenew || false,
      paymentMethod: data.paymentMethod,
    });
  }

  async getUserSubscriptions(userId: string) {
    return await Subscription.findAll({
      where: { userId },
      include: [{ model: SubscriptionPlan, as: 'plan' }],
      order: [['createdAt', 'DESC']],
    });
  }

  async getActiveSubscription(userId: string) {
    return await Subscription.findOne({
      where: {
        userId,
        status: 'active',
        endDate: { [Op.gt]: new Date() },
      },
      include: [{ model: SubscriptionPlan, as: 'plan' }],
      order: [['endDate', 'DESC']],
    });
  }

  async cancelSubscription(subscriptionId: string, userId: string) {
    const subscription = await Subscription.findOne({
      where: { id: subscriptionId, userId },
    });

    if (!subscription) throw new Error('Subscription not found');
    if (subscription.status !== 'active')
      throw new Error('Only active subscriptions can be canceled');

    await subscription.update({
      status: 'canceled',
      isAutoRenew: false,
    });

    return subscription;
  }

  // Payment Processing
  async initializePayment(
    user: { id: string; email: string },
    subscriptionId: string,
    amount: number,
    currency: string,
    paymentMethod: string
  ) {
    // In a real app, this would call your payment gateway
    const reference = `PAY-${Date.now()}`;

    const payment = await PaystackService.initializePayment(
      reference,
      amount,
      currency,
      user.email,
      { subscriptionId, userId: user.id }
    );

    await Transaction.create({
      userId: user.id,
      subscriptionId,
      amount,
      currency,
      status: 'pending',
      paymentMethod,
      paymentGateway: 'paystack', // Example
      gatewayReference: reference,
    });

    return {
      ...payment,
      reference,
    };
  }

  async verifyPayment(reference: string) {
    // In a real app, this would verify with your payment gateway
    const transaction = await Transaction.findOne({
      where: { gatewayReference: reference },
    });

    if (!transaction) throw new Error('Transaction not found.');

    // Mock verification - in reality you'd call your payment provider
    const isSuccess = Math.random() > 0.2; // 80% chance of success for demo
    const verification = await PaystackService.verifyPayment(reference);
    if (verification.data.status !== 'success') {
      // Activate subscription
      throw new Error('Transaction yet to be confirmed.');
    }
    await transaction.update({ status: 'success' });

    if (transaction.subscriptionId) {
      const subscription = await Subscription.findByPk(
        transaction.subscriptionId
      );
      if (subscription) {
        await subscription.update({
          status: 'active',
          transactionId: transaction.id,
        });

        // Send confirmation email
        await sendSubscriptionConfirmation(subscription);
      }
    }

    return {
      success: true,
      message: 'Payment confirmed successfully.',
      transaction,
    };
  }

  // Subscription Expiry & Renewal
  async checkExpiredSubscriptions() {
    const now = new Date();
    const expiredSubscriptions = await Subscription.findAll({
      where: {
        status: 'active',
        endDate: { [Op.lt]: now },
      },
    });

    for (const subscription of expiredSubscriptions) {
      if (subscription.isAutoRenew) {
        await this.renewSubscription(subscription.id);
      } else {
        await subscription.update({ status: 'expired' });
        await sendSubscriptionExpiredNotification(subscription);
      }
    }

    return expiredSubscriptions.length;
  }

  async renewSubscription(subscriptionId: string) {
    const subscription = await Subscription.findOne({
      where: { subscriptionId },
      include: [{ model: SubscriptionPlan, as: 'plan' }],
    });

    if (!subscription) throw new Error('Subscription not found');
    if (subscription.status !== 'active')
      throw new Error('Only active subscriptions can be renewed');

    const newStartDate = new Date();
    const newEndDate = calculateEndDate(
      newStartDate,
      // @ts-ignore
      subscription.plan.duration
    );

    // Create a new payment transaction
    const transaction = await Transaction.create({
      subscriptionId: subscription.id,
      userId: subscription.userId,
      // @ts-ignore
      amount: subscription.plan.price,
      // @ts-ignore
      currency: subscription.plan.currency,
      status: 'pending',
      paymentMethod: subscription.paymentMethod,
      paymentGateway: 'paystack',
    });

    // Process payment (in reality you'd call your payment gateway)
    const paymentSuccess = Math.random() > 0.2; // 80% success rate for demo

    if (paymentSuccess) {
      await transaction.update({ status: 'success' });
      await subscription.update({
        startDate: newStartDate,
        endDate: newEndDate,
        transactionId: transaction.id,
      });

      await sendSubscriptionRenewalConfirmation(subscription);
      return { success: true, subscription };
    } else {
      await transaction.update({ status: 'failed' });
      await subscription.update({
        status: 'expired',
        isAutoRenew: false,
      });

      await sendPaymentFailureNotification(subscription);
      return { success: false, subscription };
    }
  }
}

// Helper functions for emails (would be in a separate file)
async function sendSubscriptionConfirmation(subscription: Subscription) {
  // Implementation would use your email service
}

async function sendSubscriptionExpiredNotification(subscription: Subscription) {
  // Implementation would use your email service
}

async function sendSubscriptionRenewalConfirmation(subscription: Subscription) {
  // Implementation would use your email service
}

async function sendPaymentFailureNotification(subscription: Subscription) {
  // Implementation would use your email service
}

export default new SubscriptionService();
