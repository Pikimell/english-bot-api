import { groupServices } from '../../services/groupServices.js';
import { deleteMsg, getChatId, isAdmin } from '../services/helpers.js';
import { TRIGGER } from '../services/trigger.js';
import bot from '../connect.js';
import { userServices } from '../../services/userServices.js';
import { lessonServices } from '../../services/lessonServices.js';

const onTodayList = async (msg) => {
  const chatId = getChatId(msg);

  if (!isAdmin(chatId)) return;
  const groups = await groupServices.getTodayGroup();

  for (const group of groups) {
    const res = await userServices.getAllUsers({
      filters: { groupId: group._id },
    });
    const users = res.data;
    console.log(users);
  }
};

async function onSendReminder(query) {
  if (!query.data.startsWith('sendReminder')) return;
  const groupId = query.data.split('/').pop();
  const chatId = getChatId(query);
  if (!isAdmin(chatId)) return;
  const group = await groupServices.getGroupById(groupId);
  const response = await userServices.getAllUsers({ filters: { groupId } });
  const students = response.data;

  const promises = [];
  for (const { userId } of students) {
    const promise = lessonServices.createLesson({
      groupId,
      userId,
      price: group.price,
      dateTime: new Date(),
    });
    promises.push(promise);
  }

  let counter = 0;
  for (const { userId } of students) {
    const message = `***Welcome😉***
  
Посилання на заняття: 
https://us02web.zoom.us/j/5195311855?pwd=b3dNWUNLRGF5Z0ZjOHdJcHNiTGgxUT09`;
    const promise = bot.sendMessage(userId, counter + message, {
      parse_mode: 'Markdown',
    });
    const promise1 = bot.sendMessage(userId, JSON.stringify(students));
    promises.push(promise, promise1);
    counter++;
  }

  await Promise.all(promises).catch(() => {});
  deleteMsg(chatId, query.message.message_id);
}

export function initTeacherControllers() {
  console.log('initTeacherControllers');
  bot.onText(TRIGGER.teacher.today, onTodayList);
  bot.on('callback_query', onSendReminder);
}
