import { model, Schema } from 'mongoose';

const groupSchema = new Schema(
  {
    level: { type: String, required: true },
    schedule: [
      {
        day: { type: String, required: true },
        time: { type: String, required: true },
      },
    ],
    price: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true, versionKey: false },
);

groupSchema.index({ level: 1 });

export const GroupCollection = model('Group', groupSchema);
