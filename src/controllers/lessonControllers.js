import { lessonServices } from '../services/lessonServices';
import { parseLessonFilterParams } from '../utils/parseFilterParams';
import { parsePaginationParams } from '../utils/parsePaginationParams';
import { parseLessonsSortParams } from '../utils/parseSortParams';
import { response } from '../utils/response';

export const createLesson = async (event) => {
  const data = event.body;
  const newLesson = await lessonServices.createLesson(data);
  return response(201)(newLesson);
};

export const getLessonById = async (event) => {
  const { id } = event.pathParameters;
  const lesson = await lessonServices.getLessonById(id);

  if (!lesson) {
    return response(404)({ message: 'Lesson not found' });
  }

  return response(200)(lesson);
};

export const getAllLessons = async (event) => {
  const query = event.queryStringParameters;
  const filters = parseLessonFilterParams(query);
  const sort = parseLessonsSortParams(query);
  const pagination = parsePaginationParams(query);

  const lessons = await lessonServices.getAllLessons({
    filters,
    sort,
    pagination,
  });
  return response(200)(lessons);
};

export const getLessonsByGroup = async (event) => {
  const { groupId } = event.pathParameters;
  const lessons = await lessonServices.getLessonsByGroup(groupId);
  return response(200)(lessons);
};

export const getLessonsByUser = async (event) => {
  const { userId } = event.pathParameters;
  const lessons = await lessonServices.getLessonsByUser(userId);
  return response(200)(lessons);
};

export const updateLessonById = async (event) => {
  const { id } = event.pathParameters;
  const updateData = event.body;

  const updatedLesson = await lessonServices.updateLessonById(id, updateData);

  if (!updatedLesson) {
    return response(404)({ message: 'Lesson not found' });
  }

  return response(200)(updatedLesson);
};

export const deleteLessonById = async (event) => {
  const { id } = event.pathParameters;
  const deletedLesson = await lessonServices.deleteLessonById(id);

  if (!deletedLesson) {
    return response(404)({ message: 'Lesson not found' });
  }

  return response(200)({ message: 'Lesson deleted successfully' });
};

export const deleteLessonByUser = async (event) => {
  const { userId } = event.pathParameters;
  const deletedLesson = await lessonServices.deleteLessonByUser(userId);

  if (!deletedLesson) {
    return response(404)({ message: 'Lesson not found' });
  }

  return response(200)({ message: 'Lesson deleted successfully' });
};

export const sendRemaindController = async (event, context) => {
  const { time, comments, userId, _id } = event;
  const lesson = { time, comments, userId, _id };
  const data = await sendRemainder(lesson);
  return response(200)(data);
};

export const initSheduleLessonController = async (event, context) => {
  const data = await initSheduleLesson();
  return response(200)(data);
};
