import { getPlanByLevel } from '../../services/planServices.js';
import { userServices } from '../../services/userServices.js';
import bot from '../connect.js';
import { USER_MENU } from '../models/user-keyboard.js';
import { getChatId, sendAdminMessage } from '../services/helpers.js';
import {
  adminTestLessonMessage,
  testLessonMessage,
  userBalance,
} from '../services/messages.js';
import { TRIGGER } from '../services/trigger.js';

async function onTestLesson(msg) {
  const chatId = getChatId(msg);
  const user = {
    userId: chatId,
    first_name: msg.from.first_name,
    username: msg.from.username,
  };
  bot.sendMessage(chatId, testLessonMessage(), { parse_mode: 'HTML' });
  sendAdminMessage(adminTestLessonMessage(user));
}

async function onCheckLevel(msg) {
  const chatId = getChatId(msg);
  bot.sendMessage(chatId, 'Оберіть тест для проходження:', {
    reply_markup: {
      inline_keyboard: USER_MENU.testList,
    },
  });
}

async function onBalance(msg) {
  const chatId = getChatId(msg);
  const balance = await userServices.getUserBalance(chatId);
  const message = userBalance(balance);
  bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
}

async function onSchedule(msg) {
  const chatId = getChatId(msg);
}

async function onPriceList(msg) {
  const chatId = getChatId(msg);

  const user = await userServices.getUserById(chatId);

  if (user.level) {
    const planList = await getPlanByLevel(user.level);
    const keyboard = planList.map((el) => {
      return [
        {
          text: `${el.title} - ${el.price} грн`,
          callback_data: `pay/plan/${el._id}`,
        },
      ];
    });
    bot.sendMessage(chatId, 'Оберіть варіант:', {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } else {
    const message = `
    <b>Оплата послуг наразі недоступна</b>.
Спочатку необхідно визначити ваш рівень знань.
📌 Будь ласка, <b>запишіться на пробне заняття</b> та пройдіть тест для визначення рівня знань.`;

    bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  }
}

export function initStudentControllers() {
  bot.onText(TRIGGER.student.testLesson, onTestLesson);
  bot.onText(TRIGGER.student.checkLevel, onCheckLevel);
  bot.onText(TRIGGER.student.balance, onBalance);
  bot.onText(TRIGGER.student.priceList, onPriceList);
  bot.onText(TRIGGER.student.schedule, onSchedule);
}
