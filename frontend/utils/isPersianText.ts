export const isPersianText = (text: string): boolean => {
  const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u0870-\u089F\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return persianRegex.test(text);
}