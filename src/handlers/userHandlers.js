import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  updateBalance,
  addTestResult,
  getUsersWithLowBalance,
  assignToGroup,
  removeFromGroup,
  updateUserLevel,
} from '../controllers/userControllers.js';

export const getUserHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getUser);
  return await ctrl(event, context);
};

export const createUserHandler = async (event, context) => {
  const ctrl = ctrlWrapper(createUser);
  return await ctrl(event, context);
};

export const updateUserHandler = async (event, context) => {
  const ctrl = ctrlWrapper(updateUser);
  return await ctrl(event, context);
};

export const deleteUserHandler = async (event, context) => {
  const ctrl = ctrlWrapper(deleteUser);
  return await ctrl(event, context);
};

export const getAllUsersHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getAllUsers);
  return await ctrl(event, context);
};

export const updateBalanceHandler = async (event, context) => {
  const ctrl = ctrlWrapper(updateBalance);
  return await ctrl(event, context);
};

export const addTestResultHandler = async (event, context) => {
  const ctrl = ctrlWrapper(addTestResult);
  return await ctrl(event, context);
};

export const getUsersWithLowBalanceHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getUsersWithLowBalance);
  return await ctrl(event, context);
};

export const assignToGroupHandler = async (event, context) => {
  const ctrl = ctrlWrapper(assignToGroup);
  return await ctrl(event, context);
};
export const updateUserLevelHandler = async (event, context) => {
  const ctrl = ctrlWrapper(updateUserLevel);
  return await ctrl(event, context);
};
export const removeFromGroupHandler = async (event, context) => {
  const ctrl = ctrlWrapper(removeFromGroup);
  return await ctrl(event, context);
};
