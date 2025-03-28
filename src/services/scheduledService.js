import {
  EventBridgeClient,
  PutRuleCommand,
  PutTargetsCommand,
  RemoveTargetsCommand,
  DeleteRuleCommand,
} from '@aws-sdk/client-eventbridge';
import { convertToCron } from '../utils/convertToCorn.js';
import { GroupCollection } from '../db/models/group.js';
import { ScheduleCollection } from '../db/models/schedule.js';
const days = {
  Пн: 1,
  Вт: 2,
  Ср: 3,
  Чт: 4,
  Пт: 5,
  Сб: 6,
  Нд: 7,
};

const eventBridge = new EventBridgeClient({ region: 'us-east-2' });

export const getAllReminders = async (filters = {}) => {
  const query = {};

  // query.date = { $gte: new Date() };
  if (filters.groupId) query.groupId = filters.groupId;
  if (filters.day) query.day = filters.day;
  if (filters.date) query.date = filters.date;
  if (filters.time) query.time = filters.time;

  const reminders = await ScheduleCollection.find(query);

  return reminders.sort((a, b) => {
    const day1 = days[a.day] || 0;
    const day2 = days[b.day] || 0;
    if (day1 !== day2) return day1 - day2;

    const time1 = parseInt(a.time);
    const time2 = parseInt(b.time);
    return time1 - time2;
  });
};

export const addReminder = async ({ groupId, date, day, time }) => {
  const lesson = await ScheduleCollection.create({
    groupId,
    date,
    day,
    time,
  });
  await scheduleLessonReminder(lesson);
  return lesson;
};

export const removeReminder = async (id) => {
  await ScheduleCollection.findByIdAndDelete(id);
  await deleteOneTimeReminder(id);
};

export const removeGroupReminder = async (groupId) => {
  const items = await ScheduleCollection.find({ groupId });
  const promises = [];

  for (const elem of items) {
    const promise = removeReminder(elem._id);
    promises.push(promise);
  }

  return Promise.all(promises);
};

const scheduleLessonReminder = async ({ _id, groupId, day, date, time }) => {
  try {
    // Валідність дати і часу — лише для одноразових (якщо є date)
    if (!(date || day) || !time) {
      throw new Error(
        'Date and time are required for scheduling a one-time reminder.',
      );
    }

    const ruleName = `english_reminder_${_id}`;

    // Отримаємо ScheduleExpression: або at(...) або cron(...)
    const scheduleExpression = convertToCron({ date, day, time });

    // Створення правила
    const ruleParams = {
      Name: ruleName,
      ScheduleExpression: scheduleExpression, // <-- без шаблонних рядків!
      State: 'ENABLED',
      Description: `English reminder for group ${groupId} on ${
        date || day
      } at ${time}.`,
    };

    await eventBridge.send(new PutRuleCommand(ruleParams));

    // Отримаємо рівень групи
    const group = await GroupCollection.findById(groupId);
    if (!group) {
      throw new Error(`Group with ID ${groupId} not found.`);
    }

    const { level } = group;

    // Додавання цілі (lambda)
    const targetParams = {
      Rule: ruleName,
      Targets: [
        {
          Id: '1',
          Arn: 'arn:aws:lambda:us-east-2:884252207764:function:english-bot-api-dev-sendReminder',
          Input: JSON.stringify({
            groupId,
            info: { level, lesson: { time } },
          }),
        },
      ],
    };

    await eventBridge.send(new PutTargetsCommand(targetParams));

    console.log(
      `✅ Scheduled reminder for group ${groupId} on ${date || day} at ${time}`,
    );
  } catch (error) {
    console.error('❌ Error scheduling lesson reminder:', error.message);
  }
};

const deleteOneTimeReminder = async (id) => {
  try {
    const ruleName = `english_reminder_${id}`;

    await eventBridge.send(
      new RemoveTargetsCommand({
        Rule: ruleName,
        Ids: ['1'],
      }),
    );

    await eventBridge.send(
      new DeleteRuleCommand({
        Name: ruleName,
      }),
    );

    console.log(`English reminder deleted(rule: ${ruleName})`);
  } catch (error) {
    console.error('Error deleting one-time reminder:', error);
  }
};
