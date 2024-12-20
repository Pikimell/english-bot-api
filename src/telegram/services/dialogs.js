import { deleteMsg, getChatId } from './helpers.js';
import bot from '../connect.js';
import { TIME_ZONE } from '../../helpers/constants.js';

export async function paymentDialog(chatId) {
  return new Promise((resolve, reject) => {
    bot.sendMessage(chatId, 'Оберіть спосіб оплати', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'ApplePay', callback_data: 'paymentMethod_mono' }],
          [{ text: 'Portmone', callback_data: 'paymentMethod_portmone' }],
          [{ text: 'Ton Wallet', callback_data: 'paymentMethod_wallet' }],
          [{ text: 'TRC20', callback_data: 'paymentMethod_TRC20' }],
          [{ text: 'Monobank', callback_data: 'paymentMethod_MONO' }],
        ],
      },
    });
    function callback(query) {
      if (getChatId(query.message) !== chatId) return;
      const data = query.data.split('_');
      if (data[0] != 'paymentMethod') return;
      resolve(data[1]);
      deleteMsg(chatId, query.message.message_id);
      bot.removeListener('callback_query', callback);
    }
    bot.addListener('callback_query', callback);
  });
}

export async function getUserNameDialog(chatId) {
  return new Promise((resolve, reject) => {
    bot.sendMessage(chatId, "Введіть ваше ім'я...");
    bot.addListener('message', callback);
    async function callback(msg) {
      if (getChatId(msg) !== chatId) return;
      resolve(msg.text);
      bot.removeListener('message', callback);
    }
  });
}

export async function getComment(chatId) {
  return new Promise(async (resolve, reject) => {
    await bot.sendMessage(
      chatId,
      'Надішліть ваше повідомлення! Воно буде прикріплене до замовлення.',
    );
    bot.addListener('message', async function onMessage(msg) {
      if (getChatId(msg) !== chatId) return;
      const message = msg.text || '';
      resolve(message);
      bot.removeListener('message', onMessage);
    });
  });
}

export async function checkAnswer(chatId, text = 'Все вірно?') {
  return new Promise((resolve, reject) => {
    bot.sendMessage(chatId, text, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Так', callback_data: 'answer_yes' }],
          [{ text: 'Ні', callback_data: 'answer_no' }],
        ],
      },
      parse_mode: 'MarkdownV2',
    });
    function callback(query) {
      if (getChatId(query.message) !== chatId) return;
      const data = query.data.split('_');
      if (data[0] != 'answer') throw new Error('Error answer');
      deleteMsg(chatId, query.message.message_id);
      bot.removeListener('callback_query', callback);
      resolve(data[1] === 'yes');
    }
    bot.addListener('callback_query', callback);
  });
}

export async function getSpam(chatId, msgT = 'Надішліть ваше повідомлення!') {
  return new Promise(async (resolve, reject) => {
    await bot.sendMessage(chatId, msgT);
    bot.addListener('message', async function onMessage(msg) {
      if (getChatId(msg) !== chatId) return;
      const message = msg.message_id || '';
      resolve(message);
      bot.removeListener('message', onMessage);
    });
  });
}

export async function getValue(chatId, text) {
  return new Promise(async (resolve, reject) => {
    await bot.sendMessage(chatId, text);
    bot.addListener('message', async function onMessage(msg) {
      if (getChatId(msg) !== chatId) return;
      resolve(msg?.text || '');
      bot.removeListener('message', onMessage);
    });
  });
}

export async function getMessage(
  chatId,
  msgT = 'Надішліть ваше повідомлення!',
) {
  return new Promise(async (resolve, reject) => {
    await bot.sendMessage(chatId, msgT);
    bot.addListener('message', async function onMessage(msg) {
      if (getChatId(msg) !== chatId) return;
      resolve(msg);
      bot.removeListener('message', onMessage);
    });
  });
}

export function generateScheduleMessage(schedule) {
  if (!schedule || schedule.length === 0) {
    return '<b>Ваш розклад наразі відсутній</b> ❌\nБудь ласка, зверніться до адміністратора.';
  }

  let message = '<b>Ваш розклад:</b>\n\n';

  schedule.forEach((entry) => {
    message += `• <b>${entry.day}</b> о <b>${
      parseInt(entry.time) + TIME_ZONE
    }:00</b>\n`;
  });

  return message;
}
