import axios from 'axios';
import { ADMINS, TELEGRAM_TOKEN, TIME_ZONE } from '../helpers/constants';
import { userServices } from './userServices';
import { paymentServices } from './paymentServices';
import { groupServices } from './groupServices';
const BASE_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export const sendMessage = async (chatId, message, callback) => {
  const data = {
    chat_id: chatId,
    text: message,
  };
  return axios
    .post(`${BASE_URL}/sendMessage`, data)
    .then(callback)
    .catch((err) => {
      console.log(err);
    });
};

export const botSendMessage = async (chatId, message, options, callback) => {
  const data = {
    chat_id: chatId,
    text: message,
    ...options,
  };
  return axios
    .post(`${BASE_URL}/sendMessage`, data)
    .then(callback)
    .catch((err) => {
      console.log(err);
    });
};

export async function sendMessagePayment(userId, amount) {
  const user = await userServices.getUserById(userId);

  const message =
    'Ми успішно отримали Вашу оплату, дякуємо за довіру до наших послуг🫶';

  const message2 = `Щойно вібулась оплата!
Студент: ${user.contactInfo.first_name || 'anonym'}
Нікнейм: @${user.contactInfo.username || 'anonym'}
Вартість: ${amount}
id: ${userId}`;

  paymentServices.createPayment({ userId, amount, method: 'MONOBANK' });
  botSendMessage(userId, message);
  botSendMessage(ADMINS[0], message2);
}

export async function telegramTickController() {
  const date = new Date();
  const hours = date.getUTCHours();
  const groups = await groupServices.getTodayGroup();
  for (const group of groups) {
    if (hours + 1 === parseInt(group.lesson.time)) {
      await sendReminder(group._id, group);
    }
  }
}

async function sendReminder(groupId, info) {
  const userMessage = `<b>НАГАДУВАННЯ</b>
Через годинку заплановано зустріч. 
Посилання буде надіслано автоматично у цей чат!`;

  const res = await userServices.getAllUsers({ filters: { groupId } });
  const users = res.data;
  for (const user of users) {
    await botSendMessage(user.userId, userMessage, { parse_mode: 'HTML' });
  }
  const studentList = users.map((el) => el.contactInfo.first_name).join(', ');
  const adminMessage = `<b>НАГАДУВАННЯ</b>
Рівень: ${info.level}
Початок: ${parseInt(info.lesson.time) + TIME_ZONE}:00
Учні: ${studentList};`;

  for (const admin of ADMINS) {
    await botSendMessage(admin, adminMessage, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Надіслати посилання на Zoom',
              callback_data: `sendRemainder/${groupId}`,
            },
          ],
        ],
      },
    });
  }
}
