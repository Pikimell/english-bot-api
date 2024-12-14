import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import telegramBot from '../telegram/connect.js';
import { response } from '../utils/response.js';
import { ADMINS, TELEGRAM_TOKEN } from '../helpers/constants.js';
import { sendMessage } from '../services/telegramServices.js';
import { initBot } from '../telegram/init-bot.js';
import { sleep } from '../utils/delay.js';

export const telegramHandler = async (event, context) => {
  const ctrl = ctrlWrapper(async (event, context) => {
    const body = event.body;

    const { token } = event.pathParameters;

    if (token === TELEGRAM_TOKEN) {
      telegramBot.processUpdate(body);
      await sleep(500);
    }
    return response(200)({
      ok: true,
      result: true,
    });
  }, initBot);
  return await ctrl(event, context);
};

export const googleFormHandler = async (event, context) => {
  const ctrl = ctrlWrapper((event, context) => {
    const body = event.body;
    const json = JSON.stringify(body);
    for (const admin of ADMINS) {
      sendMessage(
        admin,
        `Щойно було пройдено тест новим користувачем!\n\n${json}`,
      );
    }
    return response(200)(body);
  });
  return await ctrl(event, context);
};
