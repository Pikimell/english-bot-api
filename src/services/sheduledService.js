import {
  EventBridgeClient,
  PutRuleCommand,
  PutTargetsCommand,
  RemoveTargetsCommand,
  DeleteRuleCommand,
} from '@aws-sdk/client-eventbridge';
import { convertToCron } from '../utils/convertToCorn';
import { GroupCollection } from '../db/models/group';
import { ScheduleCollection } from '../db/models/schedule';

const eventBridge = new EventBridgeClient({ region: 'us-east-2' });

export const addReminder = async ({ groupId, date, day, time }) => {
  const lesson = await ScheduleCollection.create({ groupId, date, day, time });
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
    if (!date || !time) {
      throw new Error(
        'Date and time are required for scheduling a one-time reminder.',
      );
    }

    const ruleName = `english_reminder_${_id}`;

    const cronExpression = convertToCron({ date, day, time });

    const ruleParams = {
      Name: ruleName,
      ScheduleExpression: `cron(${cronExpression})`,
      State: 'ENABLED',
      Description: `English reminder for group ${groupId} on ${
        date || day
      } at ${time}.`,
    };

    await eventBridge.send(new PutRuleCommand(ruleParams));

    const group = await GroupCollection.findById(groupId);
    const { level } = group || {};

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
      `English reminder scheduled for group ${groupId} on ${
        date || day
      } at ${time}`,
    );
  } catch (error) {
    console.error('Error scheduling lesson reminder:', error);
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
