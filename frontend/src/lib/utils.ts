import { goto } from "$app/navigation";

export const formatAsPercentage = (num: number) =>
  new Intl.NumberFormat("default", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);

export const logout = async () => {
  await fetch("/api/auth/logout");
  goto("/");
};

export const debounce = <F extends (...args: any[]) => void>(
  callback: F,
  wait = 300
) => {
  let timeout: number;

  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
};

export const wait = (durationMs: number) =>
  new Promise((res) => setTimeout(res, durationMs));

export const dateToDateTimeLocalInputString = (date: Date) => {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 16);
};
