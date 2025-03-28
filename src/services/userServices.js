import { UserCollection } from '../db/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { lessonServices } from './lessonServices.js';

export const userServices = {
  // Створити нового користувача
  async createUser(data) {
    data.userId = data.userId.toString();
    const user = new UserCollection(data);
    return await user.save();
  },

  // Отримати користувача за ID
  async getUserById(userId) {
    return await UserCollection.findOne({ userId });
  },

  // Отримати всіх користувачів
  async getAllUsers({ filters, sort = {}, pagination = {} }) {
    const { page = 1, perPage = 1000 } = pagination;

    const { sortBy = 'createdAt', sortOrder = 'asc' } = sort;

    const limit = perPage;
    const skip = (page - 1) * perPage;

    const usersQuery = UserCollection.find(filters);

    const usersCountPromise = UserCollection.countDocuments(filters);

    const usersPromise = usersQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec();

    const [usersCount, users] = await Promise.all([
      usersCountPromise,
      usersPromise,
    ]);

    const paginationData = calculatePaginationData(usersCount, page, perPage);

    return {
      data: users,
      ...paginationData,
    };
  },

  // Оновити дані користувача
  async updateUserById(userId, updateData) {
    return await UserCollection.findOneAndUpdate({ userId }, updateData, {
      new: true,
    });
  },

  // Видалити користувача
  async deleteUserById(userId) {
    return await UserCollection.findOneAndDelete({ userId });
  },

  // Знайти користувачів за групою
  async findUserByGroup(groupId) {
    return await UserCollection.find({ groupId });
  },

  // Оновити баланс користувача
  async updateBalance(userId, amount) {
    return await UserCollection.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { new: true },
    );
  },

  // Поставити користувача на паузу (зупинити сповіщення)
  async pauseNotifications(userId) {
    return await UserCollection.findOneAndUpdate(
      { userId },
      { isPaused: true },
      { new: true },
    );
  },

  // Відновити сповіщення для користувача
  async activateNotifications(userId) {
    return await UserCollection.findOneAndUpdate(
      { userId },
      { isPaused: false },
      { new: true },
    );
  },

  // Додати результат тесту користувачу
  async addTestResult(userId, testResult) {
    return await UserCollection.findOneAndUpdate(
      { userId },
      { $push: { testResults: testResult } },
      { new: true },
    );
  },

  // Отримати користувачів з низьким балансом
  async getUsersWithLowBalance(threshold) {
    return await UserCollection.find({ balance: { $lt: threshold } });
  },

  // Закріпити користувача за групою
  async assignToGroup(userId, groupId) {
    return await UserCollection.findOneAndUpdate(
      { userId },
      { groupId },
      { new: true },
    );
  },

  // Відкріпити користувача від групи
  async removeFromGroup(userId) {
    return await UserCollection.findOneAndUpdate(
      { userId },
      { groupId: null },
      { new: true },
    );
  },

  // Оновити контактну інформацію
  async updateContactInfo(userId, contactInfo) {
    return await UserCollection.findOneAndUpdate(
      { userId },
      { contactInfo },
      { new: true },
    );
  },

  // Отримати користувачів за рівнем
  async filterUsersByLevel(level) {
    return await UserCollection.find({ level });
  },

  // Отримати всіх активних користувачів (без паузи)
  async getActiveUsers() {
    return await UserCollection.find({ isPaused: false });
  },

  // Отримати всіх користувачів, які проходять пробний урок
  async getTrialUsers() {
    return await UserCollection.find({ trialUserStatus: 'scheduled' });
  },

  async getUserBalance(userId) {
    const userPromise = await UserCollection.findOne({ userId });
    const lessonsPromise = lessonServices.getLessonsByUser(userId);
    const promises = [userPromise, lessonsPromise];
    const [user, lessons] = await Promise.all(promises);

    const totalSpent = lessons.reduce((sum, el) => {
      return (sum += el.price);
    }, 0);

    const result = {
      userId,
      totalSpent,
      totalBalance: user.balance,
      totalLessons: lessons.length,
      balance: user.balance - totalSpent,
    };

    return result;
  },

  async incrementBalance(userId, amount) {
    try {
      const user = await userServices.getUserById(userId);
      user.balance = user.balance || 0;

      const res = await userServices.updateBalance(userId, +amount);
      return res;
    } catch (error) {
      throw new Error(`Error updating user balance: ${error.message}`);
    }
  },
};
