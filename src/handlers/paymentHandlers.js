import { ctrlWrapper } from '../../utils/ctrlWrapper.js';
import {
  createPayment,
  getPaymentById,
  getAllPayments,
  updatePaymentStatus,
  deletePaymentById,
} from '../controllers/paymentControllers.js';

export const createPaymentHandler = async (event, context) => {
  const ctrl = ctrlWrapper(createPayment);
  return await ctrl(event, context);
};

export const getPaymentByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getPaymentById);
  return await ctrl(event, context);
};

export const getAllPaymentsHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getAllPayments);
  return await ctrl(event, context);
};

export const updatePaymentStatusHandler = async (event, context) => {
  const ctrl = ctrlWrapper(updatePaymentStatus);
  return await ctrl(event, context);
};

export const deletePaymentByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(deletePaymentById);
  return await ctrl(event, context);
};
