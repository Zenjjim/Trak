export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const formatDateInObject = (array) => {
  return array.map((e) => {
    const a = e;
    Object.entries(e).forEach((k) => {
      if (k[1] instanceof Date) {
        a[k[0]] = k[1].toISOString().substring(0, 10);
      } else if (Array.isArray(k[1])) {
        a[k[0]] = formatDateInObject(k[1]);
      }
    });
    return a;
  });
};
