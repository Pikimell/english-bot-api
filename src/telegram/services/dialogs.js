import { deleteMsg, getChatId } from './helpers.js';
import bot from '../connect.js';

export async function PAYMENT_DIALOG(chatId) {
  return new Promise((resolve, reject) => {
    bot.sendMessage(chatId, 'Оберіть спосіб проплати', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'При отриманні', callback_data: 'pay_nalik' }],
          [{ text: 'Оплатити зараз', callback_data: 'pay_now' }],
        ],
      },
    });
    function callback(query) {
      if (getChatId(query.message) !== chatId) return;
      const data = query.data.split('_');
      if (data[0] != 'pay') return;
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
