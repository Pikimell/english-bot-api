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

async function onSendRemainder(query) {
  if (!query.data.startsWith('sendRemainder')) return;
  const groupId = query.data.split('/').pop();
  const chatId = getChatId(query);
  if (!isAdmin(chatId)) return;
  const group = await groupServices.getGroupById(groupId);
  const response = await userServices.getAllUsers({ groupId });
  const students = response.data;

  const promises = [];
  for (const { userId } of students) {
    const promise = lessonServices.createLesson({
      groupId,
      userId,
      price: group.price,
      dateTime: new Date(),
    });
    promise.push(promise);
  }

  for (const { userId } of students) {
    const message = `**Welcome😉**
  
Посилання на заняття: 
https://us02web.zoom.us/j/5195311855?pwd=b3dNWUNLRGF5Z0ZjOHdJcHNiTGgxUT09`;
    const promise = bot.sendMessage(userId, message, {
      parse_mode: 'MarkdownV2',
    });
    promises.push(promise);
  }

  await Promise.all(promises);
  deleteMsg(chatId, query.message.message_id);
}

export function initTeacherControllers() {
  console.log('initTeacherControllers');
  bot.onText(TRIGGER.teacher.today, onTodayList);
  bot.on('callback_query', onSendRemainder);
}
