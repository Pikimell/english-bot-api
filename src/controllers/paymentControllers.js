import { ADMINS } from '../helpers/constants.js';
import {
  createPaymentUrl,
  paymentServices,
} from '../services/paymentServices.js';
import {
  sendMessage,
  sendMessagePayment,
} from '../services/telegramServices.js';
import { userServices } from '../services/userServices.js';
import { response } from '../utils/response.js';

export const createPayment = async (event) => {
  const data = event.body;

  const newPayment = await createPaymentUrl(data);
  return response(201)(newPayment);
};

export const getPaymentById = async (event) => {
  const { id } = event.pathParameters;
  const payment = await paymentServices.getPaymentById(id);

  if (!payment) {
    return response(404)({ message: 'Payment not found' });
  }

  return response(200)(payment);
};

export const getAllPayments = async () => {
  const payments = await paymentServices.getAllPayments();
  return response(200)(payments);
};

export const updatePaymentStatus = async (event) => {
  const { id } = event.pathParameters;
  const { status } = event.body;

  const updatedPayment = await paymentServices.updatePaymentStatus(id, status);

  if (!updatedPayment) {
    return response(404)({ message: 'Payment not found' });
  }

  return response(200)(updatedPayment);
};

export const deletePaymentById = async (event) => {
  const { id } = event.pathParameters;
  const deletedPayment = await paymentServices.deletePaymentById(id);

  if (!deletedPayment) {
    return response(404)({ message: 'Payment not found' });
  }

  return response(200)({ message: 'Payment deleted successfully' });
};

export const notificationController = async (event, context) => {
  try {
    const { status, amount } = event.body;
    const { userId } = event.queryStringParameters;

    if (status !== 'success') {
      return response(204)(null);
    }

    const p1 = userServices.incrementBalance(userId, amount / 100);
    const p2 = sendMessagePayment(userId, amount / 100);
    const [res] = await Promise.all([p1, p2]);

    return response(200)(res);
  } catch (err) {
    sendMessage(ADMINS[0], 'ERROR PAYMENT, but PAID');
  }

  return response(200)(null);
};
