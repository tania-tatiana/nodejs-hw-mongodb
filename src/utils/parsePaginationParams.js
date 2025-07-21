function parseNumber(value, defaultVlue) {
  if (typeof value === 'undefined') {
    return defaultVlue;
  }
  const parsedValue = parseInt(value);

  if (Number.isNaN(parsedValue) === true) {
    return defaultVlue;
  }
  return parsedValue;
}

export function parsePaginationParams(query) {
  const { page, perPage } = query;
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return { page: parsedPage, perPage: parsedPerPage };
}
