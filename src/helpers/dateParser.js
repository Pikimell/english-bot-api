export function parseTime(hour) {
  hour = parseInt(hour);
  hour += window.USER_TIME ?? 2;
  if (hour < 0) hour += 24;
  if (hour >= 24) hour -= 24;
  hour = hour.toString().padStart(2, '0');
  return hour;
}

export function getTimeZone() {
  const currentYear = new Date().getFullYear();
  const januaryDate = new Date(currentYear, 0, 1);

  const offsetInMinutes = januaryDate.getTimezoneOffset();
  const offsetInHours = -offsetInMinutes / 60;
  return offsetInHours;
}
