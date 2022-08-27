const PREFIX = 'temp';

export const generateTempID = () => {
  const random = String(Math.random());
  return PREFIX + random;
};

export const isTempID = (id: string) => {
  return id.startsWith(PREFIX);
};
