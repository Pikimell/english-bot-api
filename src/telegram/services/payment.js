import { PAYMENT } from '../../helpers/constants.js';
import bot from '../connect.js';

async function createBotPayment(INVOICE, chatId) {
  bot.sendInvoice(
    chatId,
    INVOICE.title,
    INVOICE.desc,
    INVOICE.payload,
    INVOICE.token,
    INVOICE.currency,
    INVOICE.prices,
    {
      need_shipping_address: false,
      need_name: false,
      provider_data: JSON.stringify(INVOICE.data),
    },
  );
}

export async function sendInvoice(prices, info) {
  const INVOICE = {
    title: 'Оплата пакету послуг',
    desc: 'Після оплати вам буде надіслано чек а баланс буде оновлено',
    payload: `${info.chatId}`,
    token: PAYMENT.PORTMONE,
    currency: 'UAH',
    prices,
    data: info,
  };
  createBotPayment(INVOICE, info.chatId);
}
