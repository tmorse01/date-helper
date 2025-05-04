/**
 * Date parts extraction functions
 */
import { withTimezone } from "./core";

/**
 * Gets the year from the date in the specified timezone
 */
export const getYear = (date: string | Date, tz?: string): number => {
  return withTimezone(date, tz).year();
};

/**
 * Gets the month (1-12) from the date in the specified timezone
 */
export const getMonth = (date: string | Date, tz?: string): number => {
  return withTimezone(date, tz).month() + 1; // dayjs months are 0-11, convert to 1-12
};

/**
 * Gets the day of week (0-6, Sunday-Saturday) from the date in the specified timezone
 */
export const getDay = (date: string | Date, tz?: string): number => {
  return withTimezone(date, tz).day();
};

/**
 * Gets the month name from the date in the specified timezone and locale
 */
export const getMonthName = (
  date: string | Date,
  tz?: string,
  locale?: string
): string => {
  const d = withTimezone(date, tz);
  if (locale) {
    // Set locale if provided
    return d.locale(locale).format("MMMM");
  }
  return d.format("MMMM");
};

/**
 * Gets the day name from the date in the specified timezone and locale
 */
export const getDayName = (
  date: string | Date,
  tz?: string,
  locale?: string
): string => {
  const d = withTimezone(date, tz);
  if (locale) {
    // Set locale if provided
    return d.locale(locale).format("dddd");
  }
  return d.format("dddd");
};
