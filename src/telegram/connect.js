import TelegramBot from 'node-telegram-bot-api';
import { TELEGRAM_TOKEN } from '../helpers/constants.js';
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
export default bot;
