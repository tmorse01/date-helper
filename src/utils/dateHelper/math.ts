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

/**
 * Adds specified number of hours to the date in the specified timezone
 */
export const addHours = (
  date: string | Date,
  hours: number,
  tz?: string
): Dayjs => {
  return withTimezone(date, tz).add(hours, "hour");
};

/**
 * Subtracts specified number of hours from the date in the specified timezone
 */
export const subtractHours = (
  date: string | Date,
  hours: number,
  tz?: string
): Dayjs => {
  return withTimezone(date, tz).subtract(hours, "hour");
};

/**
 * Adds specified number of minutes to the date in the specified timezone
 */
export const addMinutes = (
  date: string | Date,
  minutes: number,
  tz?: string
): Dayjs => {
  return withTimezone(date, tz).add(minutes, "minute");
};

/**
 * Subtracts specified number of minutes from the date in the specified timezone
 */
export const subtractMinutes = (
  date: string | Date,
  minutes: number,
  tz?: string
): Dayjs => {
  return withTimezone(date, tz).subtract(minutes, "minute");
};

/**
 * Adds specified number of milliseconds to the date in the specified timezone
 */
export const addMilliseconds = (
  date: string | Date,
  milliseconds: number,
  tz?: string
): Dayjs => {
  return withTimezone(date, tz).add(milliseconds, "millisecond");
};

/**
 * Subtracts specified number of milliseconds from the date in the specified timezone
 */
export const subtractMilliseconds = (
  date: string | Date,
  milliseconds: number,
  tz?: string
): Dayjs => {
  return withTimezone(date, tz).subtract(milliseconds, "millisecond");
};
