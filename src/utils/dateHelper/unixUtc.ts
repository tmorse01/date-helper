/**
 * Unix and UTC conversion functions
 */
import { dayjs } from "./core";
import type { Dayjs } from "dayjs";

/**
 * Converts the date to a Unix timestamp (seconds since epoch) in the specified timezone
 */
export const toUnixTimestamp = (date: string | Date, tz?: string): number => {
  // Validate input
  if (!date) {
    throw new Error("Invalid date: must be a valid date string or Date object");
  }
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
export const fromUnixTimestamp = (timestamp: number, tz?: string): Dayjs => {
  // Validate input
  if (typeof timestamp !== "number") {
    throw new Error("Invalid timestamp: must be a number");
  }
  if (tz === "UTC") {
    // Unix timestamps are seconds since epoch in UTC
    // Convert directly to UTC time without adjusting for local timezone
    return dayjs.unix(timestamp).utc();
  } else if (tz) {
    // For other timezones, convert from UTC to that timezone
    return dayjs.unix(timestamp).tz(tz);
  }

  // Default to local timezone
  return dayjs.unix(timestamp);
};

/**
 * Converts the date to UTC
 */
export const toUTC = (date: string | Date): Dayjs => {
  // Check if the input is a date-only string (YYYY-MM-DD)
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    // For date-only strings, treat them as UTC dates without time conversion
    return dayjs.utc(date);
  }
  // For other formats, convert from local time to UTC
  return dayjs(date).utc();
};

/**
 * Converts a UTC date to the specified timezone
 */
export const fromUTC = (date: string | Date, tz: string): Dayjs => {
  return dayjs.utc(date).tz(tz);
};
