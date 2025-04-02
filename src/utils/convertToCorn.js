export const convertToCron = ({ day, date, time }) => {
  if (date) {
    return convertDateTimeToCron(date, time);
  } else {
    return convertDayTimeToCron(day, time);
  }
};

export const convertDateTimeToCron = (userDate, time) => {
  const [hours, minutes] = time.split(':');
  const date = new Date(userDate);

  const minute = String(minutes).padStart(2, '0');
  const hour = String(hours - 1 - 1).padStart(2, '0');
  const day = String(date.getUTCDate());
  const month = String(date.getUTCMonth() + 1);

  // Формат AWS cron: "minute hour day month ? *"
  const cronExpression = `cron(${minute} ${hour} ${day} ${month} ? *)`;

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

  return `cron(${minutes} ${hours - 1 - 1} ? * ${daysMap[day]} *)`;
};
