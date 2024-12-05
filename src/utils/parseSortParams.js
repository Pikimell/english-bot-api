const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
};
const parseUsersSortBy = (sortBy) => {
  const keysOfUsers = ['userId', 'balance', 'level', 'groupId'];

  if (keysOfUsers.includes(sortBy)) {
    return sortBy;
  }

  return '_id';
};
export const parseUsersSortParams = (query = {}) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseUsersSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};

//!======================================================

const parseLessonsSortBy = (sortBy) => {
  const keysOfLessons = [
    'userId',
    'groupId',
    'minDate',
    'maxDate',
    'notes',
    'price',
  ];

  if (keysOfLessons.includes(sortBy)) {
    return sortBy;
  }

  return '_id';
};
export const parseLessonsSortParams = (query = {}) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseLessonsSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
