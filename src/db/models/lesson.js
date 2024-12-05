import { model, Schema } from 'mongoose';

const lessonSchema = new Schema(
  {
    userId: { type: String, required: true },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    dateTime: { type: Date, required: true },
    notes: { type: String },
    price: { type: Number },
  },
  { timestamps: true, versionKey: false },
);

lessonSchema.index({ userId: 1 });
lessonSchema.index({ groupId: 1 });
lessonSchema.index({ dateTime: 1 });

export const LessonCollection = model('Lesson', lessonSchema);
