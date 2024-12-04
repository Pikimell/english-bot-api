import telegramBot from './connect.js';
import { SERVER_URL, TELEGRAM_TOKEN } from '../helpers/constants.js';
const webhookUrl = SERVER_URL;

telegramBot
  .setWebHook(`${webhookUrl}/bot/${TELEGRAM_TOKEN}`)
  .then(() => console.log('Webhook зареєстровано!'))
  .catch((err) => console.error('Помилка реєстрації:', err));