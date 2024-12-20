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

  getTodayGroup: async () => {
    const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const dayIndex = new Date().getDay();
    const currentDay = days[dayIndex];

    try {
      const groups = await GroupCollection.find({
        'schedule.day': currentDay,
      });

      const todayGroups = groups
        .map((group) => {
          const todaySchedule = group.schedule.filter(
            (item) => item.day === currentDay,
          );
          return todaySchedule.length > 0
            ? {
                _id: group._id,
                level: group.level,
                price: group.price,
                description: group.description,
                students: group.students,
                lesson: todaySchedule[0],
              }
            : null;
        })
        .filter((group) => group !== null)
        .sort((a, b) => {
          return parseInt(a.lesson.time) - parseInt(b.lesson.time);
        });

      return todayGroups;
    } catch (error) {
      console.error('Error fetching today groups:', error);
      throw new Error('Failed to fetch today groups');
    }
  },
};
