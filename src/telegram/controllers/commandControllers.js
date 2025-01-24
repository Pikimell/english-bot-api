import { observer } from '../../helpers/observer.js';
import { userServices } from '../../services/userServices.js';
import bot from '../connect.js';
import { USER_MENU } from '../models/user-keyboard.js';
import { getChatId, sendAdminMessage } from '../services/helpers.js';
import { FIRST_MESSAGE, newUserMessage } from '../services/messages.js';

async function onStart(msg) {
  const chatId = getChatId(msg);

  const user = {
    userId: msg.from.id,
    contactInfo: {
      username: msg.from.username,
      first_name: msg.from.first_name,
      language_code: msg.from.language_code,
    },
  };
  const oldUser = await userServices.getUserById(user.userId);

  if (!oldUser) {
    userServices.createUser(user).catch(() => {});

    await bot.sendMessage(chatId, FIRST_MESSAGE, {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Поділитися контактом',
              request_contact: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    // sendAdminMessage(newUserMessage(user));
  } else {
    const keyboard = oldUser.level
      ? USER_MENU.secondScreen
      : USER_MENU.firstScreen;

    await bot.sendMessage(chatId, 'Раді твоєму поверненню☺️', {
      reply_markup: { keyboard },
    });
  }

  observer.resolve();
}

async function onShareContact(msg) {
  const { phone_number } = msg.contact;
  const chatId = getChatId(msg);
  const user = await userServices.updateUserById(chatId, {
    phoneNumber: phone_number,
  });

  const keyboard = user.level ? USER_MENU.secondScreen : USER_MENU.firstScreen;
  sendAdminMessage(newUserMessage(user));
  await bot.sendMessage(chatId, 'Дякую за надану інформацію.', {
    reply_markup: { keyboard },
  });
}

export function initCommandControllers() {
  console.log('initCommandControllers');

  bot.onText(/\/start/, onStart);
  bot.on('contact', onShareContact);
}
