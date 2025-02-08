import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { notificationController } from '../controllers/paymentControllers.js';
import { sendRemaindController } from '../controllers/lessonControllers.js';

export const notificationHandler = async (event, context) => {
  const ctrl = ctrlWrapper(notificationController);
  return await ctrl(event, context);
};

export const notificationTestHandler = async (event, context) => {
  return {
    statusCode: 200,
    body: '{}',
  };
};

export const sendRemainderHandler = async (event, context) => {
  const ctrl = ctrlWrapper(sendRemaindController);
  return await ctrl(event, context);
};
