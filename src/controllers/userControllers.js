import { botSendMessage } from '../services/telegramServices';
import { userServices } from '../services/userServices';
import { USER_MENU } from '../telegram/models/user-keyboard';
import { response } from '../utils/response'; // Утиліта для уніфікованої відповіді

// Отримати користувача за ID
export const getUser = async (event) => {
  const { id } = event.pathParameters;
  const user = await userServices.getUserById(id);

  if (!user) {
    return response(404)({ message: 'User not found' });
  }

  return response(200)(user);
};

// Створити нового користувача
export const createUser = async (event) => {
  const data = event.body;
  const newUser = await userServices.createUser(data);
  return response(201)(newUser);
};

// Оновити користувача
export const updateUser = async (event) => {
  const { id } = event.pathParameters;
  const updateData = event.body;

  const updatedUser = await userServices.updateUserById(id, updateData);

  if (!updatedUser) {
    return response(404)({ message: 'User not found' });
  }

  return response(200)(updatedUser);
};
// Оновити користувача
export const updateUserLevel = async (event) => {
  const { id, level } = event.pathParameters;
  const updatedUser = await userServices.updateUserById(id, { level });

  if (!updatedUser) {
    return response(404)({ message: 'User not found' });
  }
  const message = `<b>Ваш рівень було оновлено</b>
Вітаю, ви маєте рівень - ${updatedUser.level}`;
  botSendMessage(updatedUser.userId, message, {
    reply_markup: { keyboard: USER_MENU.secondScreen },
    parse_mode: 'HTML',
  });

  return response(200)(updatedUser);
};

// Видалити користувача
export const deleteUser = async (event) => {
  const { id } = event.pathParameters;
  const deletedUser = await userServices.deleteUserById(id);

  if (!deletedUser) {
    return response(404)({ message: 'User not found' });
  }

  return response(200)({ message: 'User deleted successfully' });
};

// Отримати всіх користувачів
export const getAllUsers = async () => {
  const users = await userServices.getAllUsers();
  return response(200)(users);
};

// Оновити баланс користувача
export const updateBalance = async (event) => {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const updatedUser = await userServices.updateBalance(id, amount);

  if (!updatedUser) {
    return response(404)({ message: 'User not found' });
  }

  return response(200)(updatedUser);
};

// Додати результат тесту користувачу
export const addTestResult = async (event) => {
  const { id } = event.pathParameters;
  const testResult = event.body;

  const updatedUser = await userServices.addTestResult(id, testResult);

  if (!updatedUser) {
    return response(404)({ message: 'User not found' });
  }

  return response(200)(updatedUser);
};

// Отримати всіх користувачів із низьким балансом
export const getUsersWithLowBalance = async (event) => {
  const { threshold } = event.queryStringParameters;

  const users = await userServices.getUsersWithLowBalance(Number(threshold));
  return response(200)(users);
};

// Прив’язати користувача до групи
export const assignToGroup = async (event) => {
  const { id } = event.pathParameters;
  const { groupId } = event.body;

  const updatedUser = await userServices.assignToGroup(id, groupId);

  if (!updatedUser) {
    return response(404)({ message: 'User not found' });
  }

  return response(200)(updatedUser);
};

// Відкріпити користувача від групи
export const removeFromGroup = async (event) => {
  const { id } = event.pathParameters;

  const updatedUser = await userServices.removeFromGroup(id);

  if (!updatedUser) {
    return response(404)({ message: 'User not found' });
  }

  return response(200)(updatedUser);
};
