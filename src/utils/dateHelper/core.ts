/**
 * Core utilities for date helper library
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
export const withTimezone = (date: string | Date, tz?: string): dayjs.Dayjs => {
  const d = dayjs(date);
  if (!tz) {
    // Use local timezone if not specified
    return d;
  }
  return d.tz(tz);
};

export { dayjs };
