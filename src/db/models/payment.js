import { model, Schema } from 'mongoose';

const paymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    method: { type: String, required: true },
    status: {
      type: String,
      enum: ['successful', 'failed'],
      default: 'successful',
    },
  },
  { timestamps: true, versionKey: false },
);

paymentSchema.index({ userId: 1 });
paymentSchema.index({ date: -1 }); // Сортування за датою у спадному порядку

export const PaymentCollection = model('Payment', paymentSchema);
