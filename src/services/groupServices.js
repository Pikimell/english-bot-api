import { GroupCollection } from '../db/models/group.js';

export const groupServices = {
  createGroup: async (data) => {
    const group = new GroupCollection(data);
    return await group.save();
  },
  getSchedule: async () => {
    const groups = await GroupCollection.find();
    const schedule = {};

    for (const group of groups) {
      for (const item of group.schedule) {
        const { day, time } = item;
        schedule[day] = schedule[day] || [];
        if (!schedule[day].includes(time)) schedule[day].push(time);
      }
    }
    return schedule;
  },

  getGroupById: async (groupId) => {
    return await GroupCollection.findById(groupId);
  },

  getAllGroups: async (filter = {}) => {
    return await GroupCollection.find(filter);
  },

  updateGroupById: async (groupId, updateData) => {
    if (updateData.students && updateData.students < 0) {
      updateData.students = 0;
    }
    return await GroupCollection.findByIdAndUpdate(groupId, updateData, {
      new: true,
    });
  },

  deleteGroupById: async (groupId) => {
    // TODO delete group for students
    return await GroupCollection.findByIdAndDelete(groupId);
  },
};
