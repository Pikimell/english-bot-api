export const parseUserFilterParams = (query = {}) => {
  const keys = [
    'userId',
    'balance',
    'level',
    'groupId',
    'isPaused',
    'showNotification',
  ];

  const filters = {};
  for (const key of keys) {
    if (query[key] !== undefined) {
      filters[key] = query = [key];
    }
  }

  return filters;
};
export const parseLessonFilterParams = (query = {}) => {
  const keys = ['userId', 'groupId', 'minDate', 'maxDate', 'notes', 'price'];

  const filters = {};
  for (const key of keys) {
    if (query[key] !== undefined) {
      filters[key] = query = [key];
    }
  }

  return filters;
};
