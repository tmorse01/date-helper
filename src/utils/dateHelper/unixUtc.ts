/**
 * Unix and UTC conversion functions
 */
import { dayjs } from "./core";
import type { Dayjs } from "dayjs";

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
export const fromUnixTimestamp = (timestamp: number, tz?: string): Dayjs => {
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
export const toUTC = (date: string | Date): Dayjs => {
  return dayjs(date).utc();
};

/**
 * Converts a UTC date to the specified timezone
 */
export const fromUTC = (date: string | Date, tz: string): Dayjs => {
  return dayjs.utc(date).tz(tz);
};
