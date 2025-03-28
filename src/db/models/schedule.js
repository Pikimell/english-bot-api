import { Schema, model } from 'mongoose';

const scheduleSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'groups',
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: false,
    },
    day: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const ScheduleCollection = model('schedules', scheduleSchema);
