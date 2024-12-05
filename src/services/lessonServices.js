import { LessonCollection } from '../db/models/lesson.js';

export const lessonServices = {
  createLesson: async (data) => {
    const lesson = new LessonCollection(data);
    return await lesson.save();
  },

  getLessonById: async (lessonId) => {
    return await LessonCollection.findById(lessonId);
  },

  getAllLessons: async (filter = {}) => {
    return await LessonCollection.find(filter);
  },

  getLessonsByGroup: async (groupId) => {
    return await LessonCollection.find({ groupId });
  },

  getLessonsByUser: async (userId) => {
    return await LessonCollection.find({ userId });
  },

  updateLessonById: async (lessonId, updateData) => {
    return await LessonCollection.findByIdAndUpdate(lessonId, updateData, {
      new: true,
    });
  },

  deleteLessonById: async (lessonId) => {
    return await LessonCollection.findByIdAndDelete(lessonId);
  },
};
