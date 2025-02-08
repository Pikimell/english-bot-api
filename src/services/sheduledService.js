import {
  EventBridgeClient,
  PutRuleCommand,
  PutTargetsCommand,
  RemoveTargetsCommand,
  DeleteRuleCommand,
} from '@aws-sdk/client-eventbridge';
import { convertDayTimeToCron } from '../utils/convertToCorn';
import { GroupCollection } from '../db/models/group';

export const scheduleLessonReminder = async (group) => {
  const { schedule = [] } = group;
  const groupId = group._id;

  for (const item of schedule) {
    try {
      const { time, day, _id } = item;

      if (!time || !day) {
        throw new Error(
          'Lesson time and day are required for scheduling a reminder.',
        );
      }
      const ruleName = `lesson_reminder_${_id}`;
      const cronExpression = convertDayTimeToCron(day, time);

      const ruleParams = {
        Name: ruleName,
        ScheduleExpression: `cron(${cronExpression})`,
        State: 'ENABLED',
        Description: `Weekly reminder for group ${groupId} on ${day} at ${time}.`,
      };

      await eventBridge.send(new PutRuleCommand(ruleParams));

      // Прив'язуємо до правила Lambda-функцію, яка надсилатиме нагадування
      const targetParams = {
        Rule: ruleName,
        Targets: [
          {
            Id: '1',
            Arn: 'arn:aws:lambda:us-east-2:884252207764:function:english-bot-api-dev-sendReminder',
            Input: JSON.stringify({ time, groupId, day }),
          },
        ],
      };

      await eventBridge.send(new PutTargetsCommand(targetParams));

      console.log(
        `Weekly reminder scheduled for group ${groupId} on ${day} at ${time}`,
      );
    } catch (error) {
      console.error('Error scheduling lesson reminder:', error);
      throw new Error(`Error scheduling lesson reminder: ${error.message}`);
    }
  }
};

export const deleteLessonReminder = async (groupId) => {
  const group = await GroupCollection.findById(groupId);

  const schedule = group.schedule;

  for (const item of schedule) {
    const { _id } = item;
    try {
      const ruleName = `lesson_reminder_${_id}`;

      await eventBridge.send(
        new RemoveTargetsCommand({
          Rule: ruleName,
          Ids: ['1'],
        }),
      );

      // Видаляємо саме правило
      await eventBridge.send(
        new DeleteRuleCommand({
          Name: ruleName,
        }),
      );

      console.log(`Reminder for lesson ${lessonId} has been deleted.`);
    } catch (error) {
      console.error('Error deleting lesson reminder:', error);
    }
  }
};
