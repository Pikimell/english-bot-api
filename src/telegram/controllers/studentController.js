import bot from '../connect.js';
import { getChatId, sendAdminMessage } from '../services/helpers.js';
import {
  adminTestLessonMessage,
  testLessonMessage,
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
}
async function onBalance(msg) {
  const chatId = getChatId(msg);
}
async function onSchedule(msg) {
  const chatId = getChatId(msg);
}
async function onPriceList(msg) {
  const chatId = getChatId(msg);
}

export function initStudentControllers() {
  bot.onText(TRIGGER.student.testLesson, onTestLesson);
  bot.onText(TRIGGER.student.checkLevel, onCheckLevel);
  bot.onText(TRIGGER.student.balance, onBalance);
  bot.onText(TRIGGER.student.priceList, onSchedule);
  bot.onText(TRIGGER.student.schedule, onPriceList);
}
