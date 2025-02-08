export const convertDayTimeToCron = (day, time) => {
  const daysMap = {
    Monday: '2',
    Tuesday: '3',
    Wednesday: '4',
    Thursday: '5',
    Friday: '6',
    Saturday: '7',
    Sunday: '1',
  };

  if (!daysMap[day]) {
    throw new Error(`Invalid day: ${day}`);
  }

  const [hours, minutes] = time.split(':').map(Number);

  return `${minutes} ${hours} * * ${daysMap[day]}`;
};
