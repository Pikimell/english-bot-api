import { LessonCollection } from '../db/models/lesson.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const lessonServices = {
  createLesson: async (data) => {
    const lesson = new LessonCollection(data);
    return await lesson.save();
  },

  getLessonById: async (lessonId) => {
    return await LessonCollection.findById(lessonId);
  },

  getAllLessons: async ({ filter = {}, sort = {}, pagination = {} }) => {
    const { page = 1, perPage = 10 } = pagination;

    const { sortBy = 'createdAt', sortOrder = 'asc' } = sort;

    const limit = perPage;
    const skip = (page - 1) * perPage;

    const lessonsQuery = LessonCollection.find(filter);

    const lessonsCountPromise = LessonCollection.countDocuments(filter);

    const lessonsPromise = lessonsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec();

    const [lessonsCount, lessons] = await Promise.all([
      lessonsCountPromise,
      lessonsPromise,
    ]);

    const paginationData = calculatePaginationData(lessonsCount, page, perPage);

    return {
      data: lessons,
      ...paginationData,
    };
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

  deleteLessonByUser: async (userId) => {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const result = await LessonCollection.findOneAndDelete({
        userId: userId,
        dateTime: { $gte: todayStart, $lte: todayEnd },
      });

      if (!result) {
        console.log('Урок не знайдено для вказаного користувача.');
        return null;
      }

      console.log('Урок успішно видалено:', result);
      return result;
    } catch (error) {
      console.error('Помилка при видаленні уроку:', error);
      throw error;
    }
  },
};
