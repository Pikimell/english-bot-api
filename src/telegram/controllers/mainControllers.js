import bot from '../connect.js';

function answerCallback(query) {
  bot.answerCallbackQuery({ callback_query_id: query.id, text: 'Ok' });
}
export function initMainControllers() {
  console.log('initMainControllers');
  bot.on('callback_query', answerCallback);
}
