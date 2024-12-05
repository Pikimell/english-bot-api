import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    level: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
    isPaused: { type: Boolean, default: false },
    showNotification: { type: Boolean, default: true },
    contactInfo: {
      username: { type: String },
      first_name: { type: String },
      email: { type: String },
      phone: { type: String },
      language_code: { type: String },
    },
    testResults: [
      {
        testId: { type: String },
        score: { type: Number },
        date: { type: Date },
      },
    ],
    trialLessonStatus: {
      type: String,
      enum: ['not_taken', 'scheduled', 'completed'],
      default: 'not_taken',
    },
    notificationsSettings: {
      lessonReminders: { type: Boolean, default: true },
      paymentReminders: { type: Boolean, default: true },
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.index({ userId: 1 });
userSchema.index({ groupId: 1 });

export const UserCollection = model('User', userSchema);
