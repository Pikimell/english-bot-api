import { groupServices } from '../services/groupServices';
import {
  deleteGroupReminder,
  scheduleGroupReminder,
} from '../services/sheduledService';
import { response } from '../utils/response';

export const createGroup = async (event) => {
  const data = event.body;
  const newGroup = await groupServices.createGroup(data);
  return response(201)(newGroup);
};

export const getGroupById = async (event) => {
  const { id } = event.pathParameters;
  const group = await groupServices.getGroupById(id);

  if (!group) {
    return response(404)({ message: 'Group not found' });
  }

  return response(200)(group);
};

export const getAllGroups = async (e) => {
  const filters = e.queryStringParameters;
  const groups = await groupServices.getAllGroups(filters);
  return response(200)(groups);
};

export const getScheduleController = async (e) => {
  const groups = await groupServices.getSchedule();
  return response(200)(groups);
};

export const updateGroupById = async (event) => {
  const { id } = event.pathParameters;
  const updateData = event.body;

  const updatedGroup = await groupServices.updateGroupById(id, updateData);

  if (!updatedGroup) {
    return response(404)({ message: 'Group not found' });
  }

  return response(200)(updatedGroup);
};

export const deleteGroupById = async (event) => {
  const { id } = event.pathParameters;
  const deletedGroup = await groupServices.deleteGroupById(id);

  if (!deletedGroup) {
    return response(404)({ message: 'Group not found' });
  }

  return response(200)({ message: 'Group deleted successfully' });
};

export const addStudentToGroup = async (event) => {
  const { id } = event.pathParameters;
  const { userId } = event.body;

  const updatedGroup = await groupServices.addStudentToGroup(id, userId);

  if (!updatedGroup) {
    return response(404)({ message: 'Group not found' });
  }

  return response(200)(updatedGroup);
};

export const removeStudentFromGroup = async (event) => {
  const { id } = event.pathParameters;
  const { userId } = event.body;

  const updatedGroup = await groupServices.removeStudentFromGroup(id, userId);

  if (!updatedGroup) {
    return response(404)({ message: 'Group not found' });
  }

  return response(200)(updatedGroup);
};
