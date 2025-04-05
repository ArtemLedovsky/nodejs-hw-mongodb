const parseSortBy = (value) => {
  if (!value) {
    return '_id';
  }
  const keys = ['_id', 'name', 'isFavourite', 'createdAt'];
  if (!keys.includes(value)) {
    return '_id';
  }
  return value;
};

const parseSortOrder = (value) => {
  if (!value) return 'asc';

  if (value !== 'asc' && value !== 'desc') return 'asc';

  return value;
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
