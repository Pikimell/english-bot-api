import Axios from 'axios';
import { v4 as randomId } from 'uuid';
import { PAYMENT } from '../../helpers/constants.js';
const API_KEY = PAYMENT.WALLET;

const axios = Axios.create({
  headers: {
    'Wpay-Store-Api-Key': API_KEY,
  },
});

async function createOrder(userId, price, description) {
  const BASE_URL = 'https://pay.wallet.tg/wpay/store-api/v1/order';
  const orderId = randomId();

  const body = {
    amount: {
      currencyCode: 'USD',
      amount: price,
    },
    autoConversionCurrency: 'USDT',
    description,
    returnUrl: 'https://t.me/EnglilshBot',
    failReturnUrl: 'https://t.me/wallet',
    customData: `userId=${userId}&orderId=${orderId}`,
    externalId: orderId,
    timeoutSeconds: 10800,
    customerTelegramUserId: +userId,
  };

  const response = await axios.post(BASE_URL, body);

  return response.data.data;
}

async function checkStatus(orderId) {
  const BASE_URL = 'https://pay.wallet.tg/wpay/store-api/v1/order/preview';
  const params = { id: orderId };
  const promise = new Promise((resolve) => {
    setInterval(() => {
      axios.get(BASE_URL, { params }).then(({ data: { data } }) => {
        if (data.status === 'PAID') resolve(true);
      });
    }, 1000);
  });

  return promise;
}

export async function getPayLink({
  userId,
  price = 0.01,
  description = 'Description',
}) {
  try {
    const res = await createOrder(userId, price, description);
    const status = checkStatus(res.id);
    return { res, status };
  } catch (err) {
    console.log(err);
  }
}

/* 
{
  id: '2d5d0b50-07e3-4584-9d3d-90d02d9a7a03',
  userId: 433982686,
  name: 'Volodymyr',
  phoneNumber: '380996196534',
  address: 'In store',
  price: 2000,
  type: 'order',
  products: [ '666dd875e3a0b68edce63e9f' ],
  initDate: '16.06.2024 17:38',
  isActive: true
}
*/
