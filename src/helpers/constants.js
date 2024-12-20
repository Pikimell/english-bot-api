import path from 'node:path';
import { env } from '../utils/env.js';
export const TELEGRAM_TOKEN = env('TG_TOKEN');
export const SERVER_URL = env('SERVER_URL');
export const ONE_HOUR = 60 * 60 * 1000;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;
export const ONE_MONTH = ONE_DAY * 31;
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
export const ADMINS = ['433982686'];
export const TIME_ZONE = 2;

export const PAYMENT = {
  PORTMONE: env('PORTMONE'),
  WALLET: env('WALLET'),
  UNLIMIT: env('UNLIMIT'),
};
