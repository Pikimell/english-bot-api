export const convertToCron = ({ day, date, time }) => {
  if (date) {
    return convertDateTimeToCron(date, time);
  } else {
    return convertDayTimeToCron(day, time);
  }
};

export const convertDateTimeToCron = (userDate, time) => {
  const reminderDate = new Date(`${userDate}T${time}:00Z`);
  const minutes = reminderDate.getUTCMinutes();
  const hours = reminderDate.getUTCHours();
  const date = reminderDate.getUTCDate();
  const month = reminderDate.getUTCMonth() + 1;
  const year = reminderDate.getUTCFullYear();

  const cronExpression = `${minutes} ${hours} ${date} ${month} ? ${year}`;
  return cronExpression;
};

export const convertDayTimeToCron = (day, time) => {
  const daysMap = {
    Пн: '2',
    Вт: '3',
    Ср: '4',
    Чт: '5',
    Пт: '6',
    Сб: '7',
    Нд: '1',
  };

  if (!daysMap[day]) {
    throw new Error(`Invalid day: ${day}`);
  }

  const [hours, minutes] = time.split(':').map(Number);

  return `${minutes} ${hours - 1} ? * ${daysMap[day]} *`;
};
