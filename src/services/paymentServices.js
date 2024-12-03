import { PaymentCollection } from '../db/models/payment';

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
