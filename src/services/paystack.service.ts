import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export const verifyBankAccount = async (
  accountNumber: string,
  bankCode: string
) => {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
      }
    );

    console.log(response.data.s);

    if (!response.data.status) {
      throw new Error('Invalid bank details provided.');
    }

    return response.data.data; // Contains verified account details
  } catch (error: any) {
    console.error('Paystack verification error:', error);
    throw new Error(
      error.response?.data?.message || 'Bank verification failed.'
    );
  }
};

/**
 * Create transfer recipient
 * @param name
 * @param email
 * @param accountNumber
 * @param bankCode
 * @returns
 */
export const createTransferRecipient = async (
  name: string,
  email: string,
  accountNumber: string,
  bankCode: string
) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transferrecipient`,
      {
        type: 'nuban',
        name,
        email,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: 'NGN',
      },
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
      }
    );
    return response.data.data.recipient_code;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to create recipient'
    );
  }
};

/**
 * Initiate transfer
 * @param amount
 * @param recipientCode
 * @param reason
 * @returns
 */
export const initiateTransfer = async (
  amount: number,
  recipientCode: string,
  reason: string
) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transfer`,
      {
        source: 'balance',
        amount: amount * 100,
        recipient: recipientCode,
        reason,
      },
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to initiate transfer'
    );
  }
};

/**
 * Finalize transfer
 * @param transfer_code
 * @param otp
 * @returns
 */
export const finalizeTransfer = async (transfer_code: string, otp: string) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transfer/finalize_transfer`,
      {
        transfer_code,
        otp,
      },
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to finalize transfer'
    );
  }
};
