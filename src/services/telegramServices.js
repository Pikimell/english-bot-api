import axios from 'axios';
import { TELEGRAM_TOKEN } from '../helpers/constants';
const BASE_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export const sendMessage = async (chatId, message, callback) => {
  const data = {
    chat_id: chatId,
    text: message,
  };
  axios
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
  axios
    .post(`${BASE_URL}/sendMessage`, data)
    .then(callback)
    .catch((err) => {
      console.log(err);
    });
};
