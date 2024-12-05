const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string';
  if (!isString) return defaultValue;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }
  return parsedNumber;
};

export const parsePaginationParams = (query = {}) => {
  const parsedPage = parseNumber(query.page, 1);
  const parsedPerPage = parseNumber(query.perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
