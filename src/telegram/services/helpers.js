import { ADMINS } from '../../helpers/constants.js';
import bot from '../connect.js';
export function isAdmin(id) {
  return ADMINS.includes(`${id}`);
}

export function getChatId(obj = {}) {
  return `${obj?.chat?.id || obj?.from?.id}`;
}

export function deleteMsg(chatId, msgId) {
  return bot.deleteMessage(chatId, msgId);
}

export async function addQueryListener(event, callback, chatId) {
  return new Promise(async (resolve, reject) => {
    bot.addListener(event, async function onCallback(msg) {
      if (getChatId(msg) !== chatId) return;
      const res = await callback(msg);
      resolve(res);
      bot.removeListener(event, onCallback);
    });
  });
}

export async function sendAdminMessage(message) {
  for (const admin of ADMINS) {
    await bot.sendMessage(admin, message, {
      parse_mode: 'HTML',
    });
  }
}
