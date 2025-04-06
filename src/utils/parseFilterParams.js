import createHttpError from 'http-errors';

const parseIsFavourite = (value) => {
  if (typeof value === 'undefined') return;
  if (value === 'false') return false;
  if (value === 'true') return true;
};

const parseType = (value) => {
  if (!value) return;
  const keys = ['work', 'personal', 'home'];
  if (!keys.includes(value)) {
    throw new createHttpError(
      400,
      "Contact type should be one of: 'work', 'personal','home'",
    );
  }

  return value;
};

export const parseFilterParams = (query) => {
  const { isFavourite, type } = query;
  const parsedIsFavourite = parseIsFavourite(isFavourite);
  const parsedType = parseType(type);

  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedType,
  };
};
