/**
 * Date math operation functions
 */
import { withTimezone } from "./core";
import type { Dayjs } from "dayjs";

/**
 * Adds specified number of days to the date in the specified timezone
 */
export const addDays = (
  date: string | Date,
  days: number,
  tz?: string
): Dayjs => {
  return withTimezone(date, tz).add(days, "day");
};

/**
 * Subtracts specified number of days from the date in the specified timezone
 */
export const subtractDays = (
  date: string | Date,
  days: number,
  tz?: string
): Dayjs => {
  return withTimezone(date, tz).subtract(days, "day");
};

/**
 * Adds specified number of months to the date in the specified timezone
 */
export const addMonths = (
  date: string | Date,
  months: number,
  tz?: string
): Dayjs => {
  return withTimezone(date, tz).add(months, "month");
};

/**
 * Subtracts specified number of months from the date in the specified timezone
 */
export const subtractMonths = (
  date: string | Date,
  months: number,
  tz?: string
): Dayjs => {
  return withTimezone(date, tz).subtract(months, "month");
};

/**
 * Adds specified number of years to the date in the specified timezone
 */
export const addYears = (
  date: string | Date,
  years: number,
  tz?: string
): Dayjs => {
  return withTimezone(date, tz).add(years, "year");
};

/**
 * Subtracts specified number of years from the date in the specified timezone
 */
export const subtractYears = (
  date: string | Date,
  years: number,
  tz?: string
): Dayjs => {
  return withTimezone(date, tz).subtract(years, "year");
};
