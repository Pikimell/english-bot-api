import { ctrlWrapper } from '../../utils/ctrlWrapper.js';
import {
  createLesson,
  getLessonById,
  getAllLessons,
  getLessonsByGroup,
  getLessonsByUser,
  updateLessonById,
  deleteLessonById,
  markAttendance,
} from '../controllers/lessonControllers.js';

export const createLessonHandler = async (event, context) => {
  const ctrl = ctrlWrapper(createLesson);
  return await ctrl(event, context);
};

export const getLessonByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getLessonById);
  return await ctrl(event, context);
};

export const getAllLessonsHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getAllLessons);
  return await ctrl(event, context);
};

export const getLessonsByGroupHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getLessonsByGroup);
  return await ctrl(event, context);
};

export const getLessonsByUserHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getLessonsByUser);
  return await ctrl(event, context);
};

export const updateLessonByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(updateLessonById);
  return await ctrl(event, context);
};

export const deleteLessonByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(deleteLessonById);
  return await ctrl(event, context);
};
