import { groupServices } from '../../services/groupServices.js';

import bot from '../connect.js';
import { getValue, paymentDialog } from '../services/dialogs.js';
import { getChatId } from '../services/helpers.js';
import { sendInvoice } from '../services/payment.js';
import { getPayLink } from '../services/wallet.js';

export async function onSelectPlan(query, groupId) {
  const chatId = getChatId(query);
  const keyboard = [
    [
      {
        text: 'На тиждень (2 ур)',
        callback_data: `pay/lessons/${groupId}/${2}`,
      },
    ],
    [
      {
        text: 'На місяць (8 ур)',
        callback_data: `pay/lessons/${groupId}/${8}`,
      },
    ],
    [{ text: 'Свій варіант', callback_data: `pay/lessons/${groupId}/n` }],
  ];

  bot.sendMessage(chatId, 'Оберіть бажану кількість: ', {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
}

async function onSelectLessons(query) {
  if (!query.data.startsWith('pay/lessons')) return;
  const arr = query.data.split('/');

  let count = +arr.pop();
  const groupId = arr.pop();
  const chatId = getChatId(query);
  const group = await groupServices.getGroupById(groupId);
  const price = group.price;

  if (!count) {
    count = await getValue(
      chatId,
      'Надішліть у чат кількість уроків яку бажаєте оплатити: (1-100)',
    );

    count = Number(count) || 1;
  }

  selectPaymentMethod({ chatId, price, count });
}

async function selectPaymentMethod({ chatId, price, count }) {
  const totalPrice = count * price * 100;
  const prices = [
    {
      label: `Кількість уроків - ${count}`,
      amount: totalPrice,
    },
  ];

  const data = { chatId, count, totalPrice, prices };
  const method = await paymentDialog(chatId);
  switch (method) {
    case 'MONO':
      break;
    case 'TRC20':
      break;
    case 'portmone':
      telegramPay(data);
      break;
    case 'wallet':
      tonWalletPay(data);
      break;
  }
}

async function onUserPaid(query) {
  console.log(query); // TODO написати обробчик успішної оплати через телеграм бот
}

export function initPaymentControllers() {
  console.log('initPaymentControllers');

  bot.on('callback_query', onSelectLessons);
  bot.on('successful_payment', onUserPaid);
}

async function telegramPay({ chatId, prices, totalPrice, count }) {
  sendInvoice(prices, {
    chatId,
    count,
    totalPrice: totalPrice / 100,
  });
}
async function tonWalletPay({ chatId, prices, plan, totalPrice, count }) {
  const { res, status } = await getPayLink({ userId: chatId });
  console.log(res, status);

  bot.sendMessage(chatId, 'Оплата пакету послуг', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `Оплатити ${Math.round(totalPrice / 41)}.00$`,
            url: res.directPayLink,
          },
        ],
      ],
    },
  });
}
