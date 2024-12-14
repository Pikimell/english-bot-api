import axios from 'axios';
import { ADMINS, TELEGRAM_TOKEN } from '../helpers/constants';
import { userServices } from './userServices';
import { paymentServices } from './paymentServices';
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
