
export const ensureRequiredProps = (obj) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      throw new Error(`required property ${key} not defined`);
    }
  });
};

export default ensureRequiredProps
