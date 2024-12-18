import bot from '../connect.js';
// import { deleteMsg } from '../services/helpers.js';

function answerCallback(query) {
  bot.answerCallbackQuery({ callback_query_id: query.id, text: 'Ok' });
  // deleteMsg(query.from.id, query.message.message_id);
}
export function initMainControllers() {
  console.log('initMainControllers');
  bot.on('callback_query', answerCallback);
}
