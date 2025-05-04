/**
 * Advanced Date Helper using dayjs with timezone support
 */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import weekOfYearPlugin from "dayjs/plugin/weekOfYear";
import quarterOfYearPlugin from "dayjs/plugin/quarterOfYear";
import isoWeekPlugin from "dayjs/plugin/isoWeek";
import isLeapYearPlugin from "dayjs/plugin/isLeapYear";
import localeData from "dayjs/plugin/localeData";

// Import common locales
import "dayjs/locale/es";
import "dayjs/locale/fr";
import "dayjs/locale/de";
import "dayjs/locale/ja";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetweenPlugin);
dayjs.extend(weekOfYearPlugin);
dayjs.extend(quarterOfYearPlugin);
dayjs.extend(isoWeekPlugin);
dayjs.extend(isLeapYearPlugin);
dayjs.extend(localeData);

/**
 * Helper function to ensure consistent handling of optional timezone
 */
const withTimezone = (date: string | Date, tz?: string): dayjs.Dayjs => {
  const d = dayjs(date);
  if (!tz) {
    // Use local timezone if not specified
    return d;
  }
  return d.tz(tz);
};

// 1. Basic Formatting

/**
 * Formats the date to YYYY-MM-DD or provided format in the specified timezone
 */
export const formatDate = (
  date: string | Date,
  format = "YYYY-MM-DD",
  tz?: string
): string => {
  return withTimezone(date, tz).format(format);
};

/**
 * Formats the date to YYYY-MM-DD HH:mm:ss in the specified timezone
 */
export const formatDateTime = (date: string | Date, tz?: string): string => {
  return withTimezone(date, tz).format("YYYY-MM-DD HH:mm:ss");
};

/**
 * Parses date string into a dayjs object in optional timezone
 */
export const parseDate = (dateString: string, tz?: string): dayjs.Dayjs => {
  return withTimezone(dateString, tz);
};

// 2. Comparison Functions

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

// 3. Math Functions

/**
 * Adds specified number of days to the date in the specified timezone
 */
export const addDays = (
  date: string | Date,
  days: number,
  tz?: string
): dayjs.Dayjs => {
  return withTimezone(date, tz).add(days, "day");
};

/**
 * Subtracts specified number of days from the date in the specified timezone
 */
export const subtractDays = (
  date: string | Date,
  days: number,
  tz?: string
): dayjs.Dayjs => {
  return withTimezone(date, tz).subtract(days, "day");
};

/**
 * Adds specified number of months to the date in the specified timezone
 */
export const addMonths = (
  date: string | Date,
  months: number,
  tz?: string
): dayjs.Dayjs => {
  return withTimezone(date, tz).add(months, "month");
};

/**
 * Subtracts specified number of months from the date in the specified timezone
 */
export const subtractMonths = (
  date: string | Date,
  months: number,
  tz?: string
): dayjs.Dayjs => {
  return withTimezone(date, tz).subtract(months, "month");
};

/**
 * Adds specified number of years to the date in the specified timezone
 */
export const addYears = (
  date: string | Date,
  years: number,
  tz?: string
): dayjs.Dayjs => {
  return withTimezone(date, tz).add(years, "year");
};

/**
 * Subtracts specified number of years from the date in the specified timezone
 */
export const subtractYears = (
  date: string | Date,
  years: number,
  tz?: string
): dayjs.Dayjs => {
  return withTimezone(date, tz).subtract(years, "year");
};

// 4. Parts Extraction

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

// 5. Ranges

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
export const startOfDay = (date: string | Date, tz?: string): dayjs.Dayjs => {
  return withTimezone(date, tz).startOf("day");
};

/**
 * Gets the end of the day for the given date in the specified timezone
 */
export const endOfDay = (date: string | Date, tz?: string): dayjs.Dayjs => {
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
): dayjs.Dayjs => {
  let d = withTimezone(date, tz);
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
): dayjs.Dayjs => {
  return startOfWeek(date, tz, weekStart).add(6, "day").endOf("day");
};

/**
 * Gets the start of the month for the given date in the specified timezone
 */
export const startOfMonth = (date: string | Date, tz?: string): dayjs.Dayjs => {
  return withTimezone(date, tz).startOf("month");
};

/**
 * Gets the end of the month for the given date in the specified timezone
 */
export const endOfMonth = (date: string | Date, tz?: string): dayjs.Dayjs => {
  return withTimezone(date, tz).endOf("month");
};

// 6. ISO/Fiscal

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
export const startOfQuarter = (
  date: string | Date,
  tz?: string
): dayjs.Dayjs => {
  return withTimezone(date, tz).startOf("quarter");
};

/**
 * Gets the end of the quarter for the given date in the specified timezone
 */
export const endOfQuarter = (date: string | Date, tz?: string): dayjs.Dayjs => {
  return withTimezone(date, tz).endOf("quarter");
};

// 7. Unix & UTC

/**
 * Converts the date to a Unix timestamp (seconds since epoch) in the specified timezone
 */
export const toUnixTimestamp = (date: string | Date, tz?: string): number => {
  // For UTC explicitly or dates already in UTC format, use UTC conversion
  if (tz === "UTC") {
    return dayjs.utc(date).unix();
  }

  // Handle timezone conversion if specified
  if (tz) {
    return dayjs.tz(date, tz).unix();
  }

  // Default behavior - use local timezone
  return dayjs(date).unix();
};

/**
 * Creates a dayjs object from a Unix timestamp (seconds since epoch) in the specified timezone
 */
export const fromUnixTimestamp = (
  timestamp: number,
  tz?: string
): dayjs.Dayjs => {
  // Create a UTC date from the timestamp
  const utcDate = dayjs.unix(timestamp).utc();

  // Convert to specified timezone if provided
  if (tz === "UTC") {
    return utcDate;
  } else if (tz) {
    return utcDate.tz(tz);
  }

  // Default to local timezone
  return utcDate.local();
};

/**
 * Converts the date to UTC
 */
export const toUTC = (date: string | Date): dayjs.Dayjs => {
  return dayjs(date).utc();
};

/**
 * Converts a UTC date to the specified timezone
 */
export const fromUTC = (date: string | Date, tz: string): dayjs.Dayjs => {
  return dayjs.utc(date).tz(tz);
};
