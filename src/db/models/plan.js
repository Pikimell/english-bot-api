import { model, Schema } from 'mongoose';

const planSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    level: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
  },
  { timestamps: true, versionKey: false },
);

export const PlanCollection = model('Plan', planSchema);
