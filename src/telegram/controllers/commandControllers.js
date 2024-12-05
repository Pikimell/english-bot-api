import { userServices } from '../../services/userServices.js';
import bot from '../connect.js';
import { USER_MENU } from '../models/user-keyboard.js';
import { getChatId, sendAdminMessage } from '../services/helpers.js';
import { FIRST_MESSAGE, newUserMessage } from '../services/messages.js';

function onStart(msg) {
  const chatId = getChatId(msg);

  const user = {
    userId: msg.from.id,
    contactInfo: {
      username: msg.from.username,
      first_name: msg.from.first_name,
      language_code: msg.from.language_code,
    },
  };
  userServices.createUser(user).catch(() => {});
  bot.sendMessage(chatId, FIRST_MESSAGE, {
    reply_markup: {
      keyboard: USER_MENU.firstScreen,
    },
  });
  sendAdminMessage(newUserMessage(user));
}

export function initCommandControllers() {
  bot.onText(/\/start/, onStart);
}
