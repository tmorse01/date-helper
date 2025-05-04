/**
 * Date ranges and intervals functions
 */
import { withTimezone } from "./core";
import type { Dayjs } from "dayjs";

/**
 * Checks if the date is between start and end dates in the specified timezone
 * Inclusive by default (matching the dayjs behavior)
 */
export const isBetween = (
  date: string | Date,
  start: string | Date,
  end: string | Date,
  tz?: string
): boolean => {
  const d = withTimezone(date, tz);
  const s = withTimezone(start, tz);
  const e = withTimezone(end, tz);
  return d.isBetween(s, e, null, "[]"); // '[]' means inclusive on both ends
};

/**
 * Calculates the number of days between two dates in the specified timezone
 */
export const daysBetween = (
  date1: string | Date,
  date2: string | Date,
  tz?: string
): number => {
  const d1 = withTimezone(date1, tz).startOf("day");
  const d2 = withTimezone(date2, tz).startOf("day");
  return Math.abs(d1.diff(d2, "day"));
};

/**
 * Gets the start of the day for the given date in the specified timezone
 */
export const startOfDay = (date: string | Date, tz?: string): Dayjs => {
  return withTimezone(date, tz).startOf("day");
};

/**
 * Gets the end of the day for the given date in the specified timezone
 */
export const endOfDay = (date: string | Date, tz?: string): Dayjs => {
  return withTimezone(date, tz).endOf("day");
};

/**
 * Gets the start of the week for the given date in the specified timezone
 * with optional weekStart parameter (0 = Sunday, 1 = Monday, etc.)
 */
export const startOfWeek = (
  date: string | Date,
  tz?: string,
  weekStart = 0
): Dayjs => {
  const d = withTimezone(date, tz);
  const day = d.day();
  const diff = (day < weekStart ? 7 : 0) + day - weekStart;
  return d.subtract(diff, "day").startOf("day");
};

/**
 * Gets the end of the week for the given date in the specified timezone
 * with optional weekStart parameter (0 = Sunday, 1 = Monday, etc.)
 */
export const endOfWeek = (
  date: string | Date,
  tz?: string,
  weekStart = 0
): Dayjs => {
  return startOfWeek(date, tz, weekStart).add(6, "day").endOf("day");
};

/**
 * Gets the start of the month for the given date in the specified timezone
 */
export const startOfMonth = (date: string | Date, tz?: string): Dayjs => {
  return withTimezone(date, tz).startOf("month");
};

/**
 * Gets the end of the month for the given date in the specified timezone
 */
export const endOfMonth = (date: string | Date, tz?: string): Dayjs => {
  return withTimezone(date, tz).endOf("month");
};
