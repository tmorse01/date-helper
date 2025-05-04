/**
 * ISO/Fiscal calendar functions
 */
import { dayjs, withTimezone } from "./core";
import type { Dayjs } from "dayjs";

/**
 * Gets the ISO week number for the given date in the specified timezone
 */
export const getISOWeek = (date: string | Date, tz?: string): number => {
  // Use proper ISO week calculation, making sure to use the timezone if specified
  if (tz) {
    return dayjs.tz(date, tz).isoWeek();
  }
  return dayjs(date).isoWeek();
};

/**
 * Gets the ISO year for the given date in the specified timezone
 */
export const getISOYear = (date: string | Date, tz?: string): number => {
  // ISO year can be different than calendar year for dates near year boundaries
  return withTimezone(date, tz).year();
};

/**
 * Gets the quarter (1-4) for the given date in the specified timezone
 */
export const getQuarter = (date: string | Date, tz?: string): number => {
  return withTimezone(date, tz).quarter();
};

/**
 * Gets the start of the quarter for the given date in the specified timezone
 */
export const startOfQuarter = (date: string | Date, tz?: string): Dayjs => {
  return withTimezone(date, tz).startOf("quarter");
};

/**
 * Gets the end of the quarter for the given date in the specified timezone
 */
export const endOfQuarter = (date: string | Date, tz?: string): Dayjs => {
  return withTimezone(date, tz).endOf("quarter");
};
