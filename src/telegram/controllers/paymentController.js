import { ADMINS } from '../../helpers/constants.js';
import { observer } from '../../helpers/observer.js';
import { createPaymentUrl } from '../../services/paymentServices.js';
import { getPlanById } from '../../services/planServices.js';
import bot from '../connect.js';
import { getValue, paymentDialog } from '../services/dialogs.js';
import { deleteMsg, getChatId } from '../services/helpers.js';
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
  deleteMsg(chatId, query.message.message_id);
  observer.resolve();
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

  deleteMsg(chatId, query.message.message_id);
  await selectPaymentMethod({ chatId, plan, count });
  observer.resolve();
}

async function selectPaymentMethod({ chatId, plan, count }) {
  const totalPrice = count * plan.price * 100;
  const prices = [
    {
      label: `Кількість уроків - ${count} | ${plan.title}`,
      amount: totalPrice,
    },
  ];

  const data = { chatId, count, totalPrice, prices };
  const method = await paymentDialog(chatId);
  switch (method) {
    case 'mono':
      await monoPay(data);
      break;
    case 'cash':
      await cashPay(data);
      break;
    case 'TRC20':
      break;
    case 'portmone':
      await telegramPay(data);
      break;
    case 'wallet':
      await tonWalletPay(data);
      break;
  }
  observer.resolve();
}

async function onUserPaid(query) {
  console.log(query); // TODO написати обробчик успішної оплати через телеграм бот
}

export function initPaymentControllers() {
  console.log('initPaymentControllers');

  bot.on('callback_query', onSelectPlan);
  bot.on('callback_query', onSelectLessons);
  bot.on('successful_payment', onUserPaid);
}

async function monoPay({ chatId, totalPrice }) {
  const data = await createPaymentUrl({
    userId: chatId,
    amount: totalPrice,
  });
  await bot.sendMessage(chatId, 'Виконайте оплату:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: `Apple Pay (${totalPrice / 100}грн)`, url: data.pageUrl }],
      ],
    },
  });
  observer.resolve();
}

async function cashPay({ chatId, totalPrice }) {
  const baseUrl = 'https://send.monobank.ua/jar/57jsqghQxo';
  const url = `${baseUrl}?amount=${totalPrice / 100}&comment=${chatId}`;
  await bot.sendMessage(chatId, 'Виконайте оплату:', {
    reply_markup: {
      inline_keyboard: [[{ text: `MonoBank (${totalPrice / 100}грн)`, url }]],
    },
  });

  for (const admin of ADMINS) {
    await bot.sendMessage(
      admin,
      `${chatId} виконує оплату переказом на карту!`,
    );
  }

  observer.resolve();
}
async function telegramPay({ chatId, prices, totalPrice, count }) {
  sendInvoice(prices, {
    chatId,
    count,
    totalPrice: totalPrice / 100,
  });
}
async function tonWalletPay({ chatId, totalPrice }) {
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
