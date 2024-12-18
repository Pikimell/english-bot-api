import axios from 'axios';
import { env } from '../utils/env.js';
import { PaymentCollection } from '../db/models/payment.js';
const MONO_KEY = env('MONO_DEV_KEY');

export const paymentServices = {
  createPayment: async (data) => {
    const payment = new PaymentCollection(data);
    return await payment.save();
  },

  getPaymentById: async (paymentId) => {
    return await PaymentCollection.findById(paymentId);
  },

  getAllPayments: async (filter = {}) => {
    return await PaymentCollection.find(filter);
  },

  getPaymentsByUser: async (userId) => {
    return await PaymentCollection.find({ userId });
  },

  updatePaymentStatus: async (paymentId, status) => {
    return await PaymentCollection.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true },
    );
  },
};

const monoApi = axios.create({
  headers: {
    'X-Token': MONO_KEY,
  },
});

export async function createPaymentUrl(invoice) {
  const { amount, userId } = invoice;
  const params = new URLSearchParams({ userId });
  const url = 'https://api.monobank.ua/api/merchant/invoice/create';

  const data = {
    amount,
    redirectUrl: `https://main.dh94uy1nr9p88.amplifyapp.com/`,
    webHookUrl: `https://hg5yk1jxxc.execute-api.us-east-2.amazonaws.com/dev/notification?${params}`,
  };

  const res = await monoApi.post(url, data);
  return res.data;
}

export async function savePayment(userId, amount) {
  try {
    const payment = new PaymentCollection({
      userId,
      amount,
    });

    const savedPayment = await payment.save();

    return savedPayment;
  } catch (error) {
    console.error('Error saving payment:', error);
    throw new Error('Unable to save payment');
  }
}

export async function getPayments(startDate, endDate, userId) {
  try {
    const filter = {};

    if (userId) {
      filter.userId = userId;
    }
    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        const date = new Date(startDate);
        filter.createdAt.$gte = date.toISOString();
      }

      if (endDate) {
        const endDateObj = new Date(endDate);
        const lastDayOfMonth = new Date(
          endDateObj.getFullYear(),
          endDateObj.getMonth() + 1,
          0,
        );

        filter.createdAt.$lte = lastDayOfMonth.toISOString();
      }
    }

    const payments = await PaymentCollection.find(filter);

    return payments;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw new Error('Unable to fetch payments');
  }
}
