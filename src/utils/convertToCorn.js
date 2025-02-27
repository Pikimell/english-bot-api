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
