export const removeDuplicateIDs = <T extends { id: any }>(arr: T[]) => {
  const newArr = arr.reduce((result, item) => {
    const itemExists = result.find((r) => r.id === item.id);
    if (itemExists) return result;
    return result.concat([item]);
  }, [] as T[]);

  return newArr;
};
