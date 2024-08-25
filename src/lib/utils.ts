import { goto } from "$app/navigation";

/**
 * Formats a number as a percentage with a maximum of 2 decimal places.
 * @param num - The number to format as a percentage.
 * @returns The number formatted as a percentage.
 */
export const formatAsPercentage = (num: number) =>
  new Intl.NumberFormat("default", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);

/** Logs the current user out. */
export const logout = async () => {
  await fetch("/api/auth/logout");
  goto("/");
};

/**
 * Debounces a function, making it so that it can't be called more than once within a given duration.
 * Useful for limiting API requests.
 * @param callback - The function to be debounced.
 * @param wait - The debounce time in milliseconds. Defaults to 300.
 * @returns The debounced function.
 */
export const debounce = <F extends (...args: any[]) => void>(
  callback: F,
  wait = 300,
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
};

/**
 * Generic sleep function.
 * Useful for simulating network latency. Don't use in the final product, though.
 * @param durationMs - The duration to wait in milliseconds.
 * @returns A promise that resolves after the given duration.
 */
export const wait = (durationMs: number) =>
  new Promise((res) => setTimeout(res, durationMs));

/**
 * Converts a javascript Date object into the format of a <input type="time-local"> value.
 * @param date - A javascript Date object.
 * @returns The date object in the format of a <input type="time-local"> value.
 */
export const dateToDateTimeLocalInputString = (date: Date) => {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 16);
};

/**
 * Calculates the number of sets won by each team given an array of points scored by each team each set
 * @param points - The points array containing the number of points scored by each team in each set
 * @returns An object representing the number of sets won by each team
 */
export const calculateSetsWon = (points: { our: number; opp: number }[]) => {
  let ourSets = 0;
  let oppSets = 0;

  for (const { our, opp } of points) {
    if (our > opp) ourSets += 1;
    else if (opp > our) oppSets += 1;
  }

  return {
    our: ourSets,
    opp: oppSets,
  };
};
