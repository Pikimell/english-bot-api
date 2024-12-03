import { GroupCollection } from '../db/models/group';

export const groupServices = {
  createGroup: async (data) => {
    const group = new GroupCollection(data);
    return await group.save();
  },

  getGroupById: async (groupId) => {
    return await GroupCollection.findById(groupId);
  },

  getAllGroups: async (filter = {}) => {
    return await GroupCollection.find(filter);
  },

  updateGroupById: async (groupId, updateData) => {
    return await GroupCollection.findByIdAndUpdate(groupId, updateData, {
      new: true,
    });
  },

  deleteGroupById: async (groupId) => {
    return await GroupCollection.findByIdAndDelete(groupId);
  },
};
