function parseType(value) {
  if (
    typeof value === 'undefined' ||
    !['work', 'home', 'personal'].includes(value)
  ) {
    return undefined;
  }
  return value;
}

function parseIsFavourite(value) {
  if (typeof value === 'undefined') {
    return undefined;
  }
  //   const result = value === 'true' ? true : false;
  //   return result;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

export function parseFilterParams(query) {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return { type: parsedType, isFavourite: parsedIsFavourite };
}
