export const FIRST_MESSAGE = `Вітаємо у боті!`;

export function newUserMessage({ userId, contactInfo: info }) {
  return `<b>Завітав новий котик!</b>
UserId: ${userId}
UserName: @${info.username}
FirstName: ${info.first_name || 'Анонім'}
`;
}

export function testLessonMessage() {
  return `<b>Запит успішно надіслано!</b> 🎉

Дякуємо за запис на <b>пробне заняття</b> з англійської мови! 🗣️  
Ми з нетерпінням чекаємо на зустріч з вами.

Я зв’яжусь із вами найближчим часом, щоб <b>узгодити зручну дату та час</b> для заняття.

Якщо у вас виникли запитання, будь ласка, звертайтесь. Ми завжди раді допомогти! 😊

З найкращими побажаннями,  
Ваш <b>викладач англійської</b>.`;
}

export function adminTestLessonMessage({ userId, username, first_name }) {
  return `<b>Новий запис на тестове заняття!</b> 🎉

<b>Інформація про студента:</b>  
👤 <b>Ім'я:</b> ${first_name} 
📞 <b>Контакт:</b> @${username}  
🕒 <b>Айді: ${userId}</b>

Будь ласка, зв'яжіться зі студентом, щоб узгодити зручний час для тестового заняття.  

<b>Ваш Telegram-бот</b>.`;
}

export function userBalance(userBalance) {
  const { totalSpent, totalLessons, balance } = userBalance;
  const message = `<b>Ваш баланс:</b>
💰 <b>Поточний баланс:</b> ${balance} грн
📚 <b>Кількість уроків:</b> ${totalLessons}
💸 <b>Загальна сума витрат:</b> ${totalSpent} грн
`;
  return message;
}
