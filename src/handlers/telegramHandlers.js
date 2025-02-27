import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import telegramBot from '../telegram/connect.js';
import { response } from '../utils/response.js';
import { ADMINS, TELEGRAM_TOKEN } from '../helpers/constants.js';
import {
  botSendFile,
  botSendMessage,
  sendMessage,
  telegramTickController,
} from '../services/telegramServices.js';
import { initBot } from '../telegram/init-bot.js';
import { observer } from '../helpers/observer.js';
import { parseMultipartFormData } from '../utils/parseMultipartFormData.js';

export const telegramHandler = async (event, context) => {
  const ctrl = ctrlWrapper(async (event, context) => {
    const body = event.body;

    const { token } = event.pathParameters;

    if (token === TELEGRAM_TOKEN) {
      observer.init();
      telegramBot.processUpdate(body);
      await observer.promise;
    }
    return response(200)({
      ok: true,
      result: true,
    });
  }, initBot);
  return await ctrl(event, context);
};

export const telegramTickHandler = async (event, context) => {
  const ctrl = ctrlWrapper(async (event, context) => {
    await telegramTickController();
    return response(200)({
      ok: true,
      result: true,
    });
  }, initBot);
  return await ctrl(event, context);
};
export const telegramMessageHandler = async (event, context) => {
  const ctrl = ctrlWrapper(async (event, context) => {
    const { chatId, message, ...options } = event.body;
    await botSendMessage(chatId, message, options);
    return response(200)({
      ok: true,
      result: true,
    });
  });
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

export const telegramSendFileHandler = async (event, context) => {
  const ctrl = ctrlWrapper(async (event, context) => {
    const { fields, files } = await parseMultipartFormData(event);

    const chatId = fields.chatId?.[0];
    if (!chatId) {
      return response(400)({ error: 'Не вказано chatId' });
    }

    const file = files.file?.[0];
    if (!file) {
      return response(400)({ error: 'Не надіслано файл' });
    }

    await botSendFile(chatId, file);

    return response(200)({ ok: true, result: true });
  });

  return await ctrl(event, context);
};
