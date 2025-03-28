import { GroupCollection } from '../db/models/group.js';
import { ScheduleCollection } from '../db/models/schedule.js';
import { removeGroupReminder } from './scheduledService.js';

export const groupServices = {
  createGroup: async (data) => {
    const group = new GroupCollection(data);
    return await group.save();
  },
  getSchedule: async () => {
    const items = await ScheduleCollection.find();
    const schedule = {};

    for (const item of items) {
      const { day, time } = item;
      if (!day || !time) continue;
      schedule[day] = schedule[day] || [];
      if (!schedule[day].includes(time)) {
        schedule[day].push(time);
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
    await removeGroupReminder(groupId);
    return await GroupCollection.findByIdAndDelete(groupId);
  },

  getTodayGroup: async () => {
    const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const dayIndex = new Date().getDay();
    const currentDay = days[dayIndex];

    try {
      const scheduleItems = await ScheduleCollection.find({ day: currentDay });

      const groupMap = new Map();

      for (const item of scheduleItems) {
        const hasGroup = groupMap.get(item.groupId.toString());
        if (hasGroup) continue;

        const group = await GroupCollection.findById(item.groupId);
        if (!group) continue;

        groupMap.set(group._id.toString(), {
          _id: group._id,
          level: group.level,
          price: group.price,
          description: group.description,
          students: group.students,
          lesson: {
            day: item.day,
            time: item.time,
          },
        });
      }

      const todayGroups = Array.from(groupMap.values()).sort(
        (a, b) => parseInt(a.lesson.time) - parseInt(b.lesson.time),
      );

      return todayGroups;
    } catch (error) {
      console.error('Error fetching today groups:', error);
      throw new Error('Failed to fetch today groups');
    }
  },
};
