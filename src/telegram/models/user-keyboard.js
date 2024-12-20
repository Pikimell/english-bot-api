import { TRIGGER } from '../services/trigger.js';

export const USER_MENU = {
  firstScreen: [
    [{ text: TRIGGER.student.testLesson }],
    [{ text: TRIGGER.student.checkLevel }],
    [{ text: TRIGGER.student.balance }],
  ],
  secondScreen: [
    [{ text: TRIGGER.student.balance }],
    [{ text: TRIGGER.student.schedule }],
    [{ text: TRIGGER.student.priceList }],
  ],
  testList: [
    [{ text: 'Базовий тест', url: 'https://forms.gle/1QHGBBk6rJ6wH5YSA' }],
    [
      { text: 'Екзамен А1', url: 'https://forms.gle/1QHGBBk6rJ6wH5YSA' },
      { text: 'Екзамен А2', url: 'https://forms.gle/1QHGBBk6rJ6wH5YSA' },
    ],
    [
      { text: 'Екзамен B1', url: 'https://forms.gle/1QHGBBk6rJ6wH5YSA' },
      { text: 'Екзамен B2', url: 'https://forms.gle/1QHGBBk6rJ6wH5YSA' },
    ],
    [
      { text: 'Екзамен C1', url: 'https://forms.gle/1QHGBBk6rJ6wH5YSA' },
      { text: 'Екзамен C2', url: 'https://forms.gle/1QHGBBk6rJ6wH5YSA' },
    ],
  ],
};
export const lessonUsersMenu = (users) => {};
