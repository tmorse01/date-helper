/**
 * Date formatting functions
 */
import { withTimezone } from "./core";

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
export const parseDate = (dateString: string, tz?: string) => {
  return withTimezone(dateString, tz);
};
