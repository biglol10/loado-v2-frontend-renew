export const hold = async (timeout: number = 0) => {
  return new Promise((res) => setTimeout(res, timeout));
};
