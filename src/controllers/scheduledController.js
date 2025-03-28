import { response } from '../utils/response.js';
import * as scheduledService from '../services/scheduledService.js';

export const addReminderController = async (event) => {
  const data = event.body;
  const reminder = await scheduledService.addReminder(data);
  return response(201)(reminder);
};

export const removeReminderController = async (event) => {
  const { id } = event.pathParameters;
  const result = await scheduledService.removeReminder(id);
  return response(200)(result);
};

export const removeGroupReminderController = async (event) => {
  const { groupId } = event.pathParameters;
  const result = await scheduledService.removeGroupReminder(groupId);
  return response(200)(result);
};

export const getAllRemindersController = async (event) => {
  const filters = event.queryStringParameters || {};
  const result = await scheduledService.getAllReminders(filters);
  return response(200)(result);
};
