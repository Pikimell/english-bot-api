import { getPlanById } from '../../services/planServices.js';

import bot from '../connect.js';
import { getValue, paymentDialog } from '../services/dialogs.js';
import { getChatId } from '../services/helpers.js';
import { sendInvoice } from '../services/payment.js';
import { getPayLink } from '../services/wallet.js';

async function onSelectPlan(query) {
  if (!query.data.startsWith('pay/plan')) return;
  const planId = query.data.split('/').pop();
  const chatId = getChatId(query);
  const keyboard = [
    [
      {
        text: 'На тиждень (2 ур)',
        callback_data: `pay/lessons/${planId}/${2}`,
      },
    ],
    [
      {
        text: 'На місяць (8 ур)',
        callback_data: `pay/lessons/${planId}/${8}`,
      },
    ],
    [{ text: 'Свій варіант', callback_data: `pay/lessons/${planId}/n` }],
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
  const planId = arr.pop();
  const chatId = getChatId(query);
  const plan = await getPlanById(planId);

  if (!count) {
    count = await getValue(
      chatId,
      'Надішліть у чат кількість уроків яку бажаєте оплатити: (1-100)',
    );

    count = Number(count) || 1;
  }

  selectPaymentMethod({ chatId, plan, count });
}

async function selectPaymentMethod({ chatId, plan, count }) {
  const totalPrice = count * plan.price * 100;
  const prices = [
    {
      label: `Кількість уроків - ${count} | ${plan.title}`,
      amount: totalPrice,
    },
  ];

  const data = { chatId, plan, count, totalPrice, prices };
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
  bot.on('callback_query', onSelectPlan);
  bot.on('callback_query', onSelectLessons);
  bot.on('successful_payment', onUserPaid);
}

async function telegramPay({ chatId, prices, plan, totalPrice, count }) {
  sendInvoice(prices, {
    chatId,
    planId: plan._id,
    count,
    totalPrice: totalPrice / 100,
  });
}
async function tonWalletPay({ chatId, prices, plan, totalPrice, count }) {
  const { res, status } = await getPayLink({ userId: chatId });
  console.log(res);

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
