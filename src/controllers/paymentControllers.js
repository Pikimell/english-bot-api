import { paymentServices } from '../services/paymentServices';
import { response } from '../utils/response';

export const createPayment = async (event) => {
  const data = event.body;
  const newPayment = await paymentServices.createPayment(data);
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
