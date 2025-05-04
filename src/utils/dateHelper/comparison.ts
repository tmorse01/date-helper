/**
 * Date comparison functions
 */
import { withTimezone } from "./core";

/**
 * Checks if two dates are the same day in the specified timezone
 */
export const isSameDay = (
  date1: string | Date,
  date2: string | Date,
  tz?: string
): boolean => {
  const d1 = withTimezone(date1, tz);
  const d2 = withTimezone(date2, tz);
  return d1.format("YYYY-MM-DD") === d2.format("YYYY-MM-DD");
};

/**
 * Checks if date1 is before date2 in the specified timezone
 */
export const isBefore = (
  date1: string | Date,
  date2: string | Date,
  tz?: string
): boolean => {
  const d1 = withTimezone(date1, tz);
  const d2 = withTimezone(date2, tz);
  return d1.isBefore(d2);
};

/**
 * Checks if date1 is after date2 in the specified timezone
 */
export const isAfter = (
  date1: string | Date,
  date2: string | Date,
  tz?: string
): boolean => {
  const d1 = withTimezone(date1, tz);
  const d2 = withTimezone(date2, tz);
  return d1.isAfter(d2);
};

/**
 * Checks if the date is a weekend (Saturday or Sunday) in the specified timezone
 */
export const isWeekend = (date: string | Date, tz?: string): boolean => {
  const day = withTimezone(date, tz).day();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

/**
 * Checks if the date is a weekday (Monday to Friday) in the specified timezone
 */
export const isWeekday = (date: string | Date, tz?: string): boolean => {
  return !isWeekend(date, tz);
};
