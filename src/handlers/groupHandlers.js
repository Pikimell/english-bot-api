import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createGroup,
  getGroupById,
  getAllGroups,
  updateGroupById,
  deleteGroupById,
  addStudentToGroup,
  removeStudentFromGroup,
  getScheduleController,
  updateGroupScheduleById,
} from '../controllers/groupControllers.js';

export const createGroupHandler = async (event, context) => {
  const ctrl = ctrlWrapper(createGroup);
  return await ctrl(event, context);
};

export const getGroupByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getGroupById);
  return await ctrl(event, context);
};

export const getAllGroupsHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getAllGroups);
  return await ctrl(event, context);
};

export const updateGroupByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(updateGroupById);
  return await ctrl(event, context);
};
export const updateGroupScheduleByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(updateGroupScheduleById);
  return await ctrl(event, context);
};

export const deleteGroupByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(deleteGroupById);
  return await ctrl(event, context);
};

export const addStudentToGroupHandler = async (event, context) => {
  const ctrl = ctrlWrapper(addStudentToGroup);
  return await ctrl(event, context);
};

export const removeStudentFromGroupHandler = async (event, context) => {
  const ctrl = ctrlWrapper(removeStudentFromGroup);
  return await ctrl(event, context);
};

export const getScheduleHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getScheduleController);
  return await ctrl(event, context);
};
