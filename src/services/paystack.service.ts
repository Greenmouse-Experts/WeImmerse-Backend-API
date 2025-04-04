import axios from 'axios';
import Transaction from '../models/transaction';
import Subscription from '../models/subscription';
import logger from '../middlewares/logger';
import * as crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface PaymentInitiationResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface PaymentVerificationResponse {
  status: boolean;
  message: string;
  data: {
    amount: number;
    currency: string;
    transaction_date: string;
    status: string;
    reference: string;
    metadata: any;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
    };
  };
}

interface Bank {
  name: string;
  code: string;
  country: string;
  currency: string;
}

interface RefundResponse {
  status: boolean;
  message: string;
  data: {
    transaction: {
      id: number;
      domain: string;
      reference: string;
      amount: number;
      currency: string;
      status: string;
    };
    integration: number;
    deducted_amount: number;
    channel: string | null;
    customer_note: string | null;
    merchant_note: string | null;
    refunded_at: string;
  };
}

export class PaystackService {
  /**
   * Initialize payment for subscription
   */
  static async initializePayment(
    reference: string,
    amount: number,
    currency: string,
    userEmail: string,
    metadata?: any
  ): Promise<PaymentInitiationResponse> {
    try {
      // Convert amount to kobo (smallest currency unit)
      const amountInKobo = Math.round(amount * 100);

      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email: userEmail,
          amount: amountInKobo,
          reference,
          currency: currency || 'NGN',
          metadata,
          channels: this.getPaymentChannels(process.env.DEFAULT_COUNTRY!),
          callback_url: this.getCallbackUrl(process.env.DEFAULT_COUNTRY!),
        },
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Paystack initialization error:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Payment initialization failed'
      );
    }
  }

  /**
   * Verify payment status
   */
  static async verifyPayment(
    reference: string
  ): Promise<PaymentVerificationResponse> {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Paystack verification error:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Payment verification failed'
      );
    }
  }

  /**
   * Create recurring payment authorization
   */
  static async createRecurringAuthorization(
    email: string,
    amount: number,
    reference: string,
    data: { paymentAuthorizationCode: string; currency: string; id: string }
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email,
          amount: Math.round(amount * 100),
          reference,
          authorization_code: data.paymentAuthorizationCode,
          currency: data.currency || 'NGN',
          metadata: {
            subscriptionId: data.id,
            isRecurring: true,
          },
        },
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Paystack recurring auth error:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Recurring authorization failed'
      );
    }
  }

  /**
   * Charge recurring payment
   */
  static async chargeRecurringPayment(
    authorizationCode: string,
    email: string,
    amount: number,
    reference: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/charge_authorization`,
        {
          authorization_code: authorizationCode,
          email,
          amount: Math.round(amount * 100),
          reference,
          currency: 'NGN',
        },
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Paystack charge error:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Recurring charge failed'
      );
    }
  }

  /**
   * Get list of supported banks by country
   */
  static async getBanks(country: string = 'nigeria'): Promise<Bank[]> {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/bank?country=${country}`,
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Paystack banks error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch banks');
    }
  }

  /**
   * Verify bank account details
   */
  static async verifyBankAccount(
    accountNumber: string,
    bankCode: string
  ): Promise<any> {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );

      if (!response.data.status) {
        throw new Error('Invalid bank details provided.');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Paystack verification error:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Bank verification failed.'
      );
    }
  }

  /**
   * Create transfer recipient
   */
  static async createTransferRecipient(
    name: string,
    accountNumber: string,
    bankCode: string,
    currency: string = 'NGN'
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transferrecipient`,
        {
          type: 'nuban',
          name,
          account_number: accountNumber,
          bank_code: bankCode,
          currency,
        },
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );

      return response.data.data.recipient_code;
    } catch (error: any) {
      console.error('Paystack recipient error:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Failed to create recipient'
      );
    }
  }

  /**
   * Initiate transfer
   */
  static async initiateTransfer(
    amount: number,
    recipientCode: string,
    reason: string,
    currency: string = 'NGN'
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transfer`,
        {
          source: 'balance',
          amount: Math.round(amount * 100),
          recipient: recipientCode,
          reason,
          currency,
        },
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Paystack transfer error:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Failed to initiate transfer'
      );
    }
  }

  /**
   * Finalize transfer with OTP
   */
  static async finalizeTransfer(
    transferCode: string,
    otp: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transfer/finalize_transfer`,
        {
          transfer_code: transferCode,
          otp,
        },
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Paystack finalize error:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Failed to finalize transfer'
      );
    }
  }

  /**
   * Get region-specific payment channels
   */
  private static getPaymentChannels(region: string): string[] {
    const channels: Record<string, string[]> = {
      NG: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
      GH: ['card', 'mobile_money'],
      US: ['card', 'bank'],
      UK: ['card', 'bank'],
    };

    return channels[region] || ['card', 'bank'];
  }

  /**
   * Get region-specific callback URL
   */
  private static getCallbackUrl(region: string): string {
    const urls: Record<string, string> = {
      NG: `${process.env.BASE_URL}/api/payments/ng/callback`,
      GH: `${process.env.BASE_URL}/api/payments/gh/callback`,
      US: `${process.env.BASE_URL}/api/payments/us/callback`,
      UK: `${process.env.BASE_URL}/api/payments/uk/callback`,
    };

    return urls[region] || `${process.env.BASE_URL}/api/payments/callback`;
  }

  /**
   * Initialize a refund for a transaction
   * @param reference - The original transaction reference
   * @param amount - Amount to refund (in the original currency)
   * @param reason - Optional reason for the refund
   */
  static async initiateRefund(
    reference: string,
    amount: number,
    reason?: string
  ): Promise<RefundResponse> {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/refund`,
        {
          transaction: reference,
          amount: amount * 100, // Convert to smallest currency unit (kobo for NGN)
          ...(reason && { merchant_note: reason }),
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Paystack refund initialization failed:', {
        reference,
        amount,
        error: error.response?.data || error.message,
      });

      throw new Error(
        error.response?.data?.message || 'Failed to initiate refund'
      );
    }
  }

  static verifyWebhookSignature(body: string, signature: string): boolean {
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    return hash === signature;
  }
}
