import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import telegramBot from '../telegram/connect.js';
import { response } from '../utils/response.js';
import { TELEGRAM_TOKEN } from '../helpers/constants.js';

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
