import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import telegramBot from '../telegram/connect.js';
import { response } from '../utils/response.js';
import { ADMINS, TELEGRAM_TOKEN } from '../helpers/constants.js';
import { sendMessage } from '../services/telegramServices.js';

export const telegramHandler = async (event, context) => {
  const ctrl = ctrlWrapper((event, context) => {
    const { token } = event.pathParams;
    const body = event.body;
    if (token === TELEGRAM_TOKEN) {
      console.log(body);
      telegramBot.processUpdate(body);
    }
    return response(200)(body);
  });
  return await ctrl(event, context);
};
export const googleFormHandler = async (event, context) => {
  const ctrl = ctrlWrapper((event, context) => {
    const body = event.body;

    for (const admin of ADMINS) {
      sendMessage(admin, 'Щойно було пройдено тест новим користувачем!');
    }
    return response(200)(body);
  });
  return await ctrl(event, context);
};
