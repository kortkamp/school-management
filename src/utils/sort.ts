export const sortByField = (source: any[], field: string) => {
  return source.sort((a, b) => (a[field] > b[field] ? 1 : -1));
};

export const sortByDate = (source: any[], field: string) => {
  return source.sort((a, b) => b[field] - a[field]);
};
