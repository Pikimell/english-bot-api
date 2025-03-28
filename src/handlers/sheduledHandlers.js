import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  addReminderController,
  removeReminderController,
  removeGroupReminderController,
} from '../controllers/scheduledController.js';

export const addReminderHandler = async (event, context) => {
  const ctrl = ctrlWrapper(addReminderController);
  return await ctrl(event, context);
};

export const removeReminderHandler = async (event, context) => {
  const ctrl = ctrlWrapper(removeReminderController);
  return await ctrl(event, context);
};

export const removeGroupReminderHandler = async (event, context) => {
  const ctrl = ctrlWrapper(removeGroupReminderController);
  return await ctrl(event, context);
};
