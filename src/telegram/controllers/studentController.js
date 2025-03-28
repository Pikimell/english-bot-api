import { observer } from '../../helpers/observer.js';
import { groupServices } from '../../services/groupServices.js';
import { getPlanByLevel } from '../../services/planServices.js';
import { userServices } from '../../services/userServices.js';
import bot from '../connect.js';
import { USER_MENU } from '../models/user-keyboard.js';
import { generateScheduleMessage } from '../services/dialogs.js';
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
  await bot.sendMessage(chatId, testLessonMessage(), { parse_mode: 'HTML' });
  sendAdminMessage(adminTestLessonMessage(user));
  observer.resolve();
}

async function onCheckLevel(msg) {
  const chatId = getChatId(msg);
  await bot.sendMessage(chatId, 'Оберіть тест для проходження:', {
    reply_markup: {
      inline_keyboard: USER_MENU.testList,
    },
  });
  observer.resolve();
}

async function onBalance(msg) {
  const chatId = getChatId(msg);
  const balance = await userServices.getUserBalance(chatId);
  const message = userBalance(balance);
  await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  observer.resolve();
}

async function onSchedule(msg) {
  const chatId = getChatId(msg);
  const user = await userServices.getUserById(chatId);
  let message;
  if (user.groupId === 'null' || !user.groupId) {
    message = `<b>Ваш розклад наразі недоступний</b> ❌  

Як тільки вас буде додано до групи, ваш розклад автоматично з'явиться тут.  

Дякую за розуміння! 😊`;
  } else {
    const group = await groupServices.getGroupById(user.groupId);
    message = generateScheduleMessage(group.schedule);
  }

  await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  observer.resolve();
}

async function onPriceList(msg) {
  const chatId = getChatId(msg);

  const user = await userServices.getUserById(chatId);
  const planList = await getPlanByLevel(user.level);

  if (planList.length > 0) {
    const keyboard = planList.map((el) => {
      return [
        {
          text: `${el.title} - ${el.price} грн`,
          callback_data: `pay/plan/${el._id}`,
        },
      ];
    });
    await bot.sendMessage(chatId, 'Оберіть варіант:', {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } else {
    const message = `
    <b>Оплата послуг наразі недоступна</b>.
📌 Щойно оплата стане доступною - вам буде надіслане сповіщення!`;

    // bot.sendMessage(ADMINS[0], '', { parse_mode: 'HTML' });// TODO надіслати повідомлення адміну що користувач хоче зробити оплату
    await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  }
  observer.resolve();
}

export function initStudentControllers() {
  console.log('initStudentControllers');
  bot.onText(TRIGGER.student.testLesson, onTestLesson);
  bot.onText(TRIGGER.student.checkLevel, onCheckLevel);
  bot.onText(TRIGGER.student.balance, onBalance);
  bot.onText(TRIGGER.student.priceList, onPriceList);
  bot.onText(TRIGGER.student.schedule, onSchedule);
}
