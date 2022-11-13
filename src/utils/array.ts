export const removeDuplicateIDs = <T extends { id: any }>(oldArray: T[]) => {
  const newArray = oldArray.reduce((result, item) => {
    const itemExists = result.find((r) => r.id === item.id);
    if (itemExists) return result;
    return result.concat([item]);
  }, [] as T[]);
  return newArray;
};

export const removeDuplicated = <T extends { id?: any }>(myArray: T[], key: keyof T = 'id') => {
  return myArray.filter((item, index) => {
    return index === myArray.findIndex((a) => a[key] === item[key]);
  });
};
