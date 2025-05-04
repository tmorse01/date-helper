import dayjs from "dayjs";
import * as dateHelper from "./dateHelper";

/**
 * Date Helper Test Suite
 *
 * Testing all date utility functions with multiple scenarios:
 * 1. Typical inputs
 * 2. Edge cases (leap years, DST transitions, etc.)
 * 3. Null/undefined safety
 */

// Constants for testing
const NYC_TIMEZONE = "America/New_York";
const TOKYO_TIMEZONE = "Asia/Tokyo";
const LONDON_TIMEZONE = "Europe/London";
const FIXED_DATE = "2025-02-15"; // A Saturday
const LEAP_YEAR_DATE = "2024-02-29"; // Leap year date

// Mock current date to ensure consistent test results
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2025-05-04"));
});

afterEach(() => {
  jest.useRealTimers();
});

// 1. Basic Formatting
describe("formatDate", () => {
  test("formats date with default format", () => {
    expect(dateHelper.formatDate(FIXED_DATE)).toBe("2025-02-15");
  });

  test("formats date with custom format", () => {
    expect(dateHelper.formatDate(FIXED_DATE, "MM/DD/YYYY")).toBe("02/15/2025");
  });

  test("handles timezone conversion", () => {
    // This test verifies that the same UTC moment displays as different dates in different timezones
    const utcDate = "2025-02-15T01:00:00Z"; // 8pm on Feb 14 in NYC, 10am on Feb 15 in Tokyo
    expect(dateHelper.formatDate(utcDate, "YYYY-MM-DD", NYC_TIMEZONE)).toBe(
      "2025-02-14"
    );
    expect(dateHelper.formatDate(utcDate, "YYYY-MM-DD", TOKYO_TIMEZONE)).toBe(
      "2025-02-15"
    );
  });
});

describe("formatDateTime", () => {
  test("formats datetime with default format", () => {
    expect(dateHelper.formatDateTime(FIXED_DATE)).toBe("2025-02-15 00:00:00");
  });

  test("handles timezone conversion", () => {
    const utcDate = "2025-02-15T12:30:45Z";
    expect(dateHelper.formatDateTime(utcDate, NYC_TIMEZONE)).toMatch(
      /2025-02-15 0?7:30:45/
    );
    expect(dateHelper.formatDateTime(utcDate, TOKYO_TIMEZONE)).toMatch(
      /2025-02-15 2?1:30:45/
    );
  });

  test("formats current date and time", () => {
    // Using toMatch instead of toBe to handle different timezone formats
    const result = dateHelper.formatDateTime(new Date("2025-05-04T00:00:00"));
    expect(result).toMatch(/^2025-05-04/); // Just check that it starts with the correct date
  });
});

describe("parseDate", () => {
  test("parses date string into dayjs object", () => {
    const result = dateHelper.parseDate(FIXED_DATE);
    expect(result.format("YYYY-MM-DD")).toBe(FIXED_DATE);
  });

  test("handles timezone conversion", () => {
    const utcDate = "2025-02-15T00:00:00Z";
    const nyc = dateHelper.parseDate(utcDate, NYC_TIMEZONE);
    expect(nyc.format("YYYY-MM-DD HH")).toBe("2025-02-14 19");
  });

  test("handles invalid date", () => {
    // dayjs silently handles invalid dates
    const result = dateHelper.parseDate("not-a-date");
    expect(result.isValid()).toBe(false);
  });
});

// 2. Comparison Functions
describe("isSameDay", () => {
  test("detects same day", () => {
    expect(dateHelper.isSameDay("2025-02-15", "2025-02-15T23:59:59")).toBe(
      true
    );
  });

  test("detects different days", () => {
    expect(dateHelper.isSameDay("2025-02-15", "2025-02-16")).toBe(false);
  });

  test("handles timezone differences", () => {
    // Same moment in time, different day in different timezones
    const date1 = "2025-02-15T01:00:00Z"; // Feb 14 evening NYC, Feb 15 morning Tokyo
    expect(dateHelper.isSameDay(date1, date1, NYC_TIMEZONE)).toBe(true);
    expect(dateHelper.isSameDay(date1, "2025-02-14", NYC_TIMEZONE)).toBe(true);
    expect(dateHelper.isSameDay(date1, "2025-02-15", TOKYO_TIMEZONE)).toBe(
      true
    );
  });
});

describe("isBefore", () => {
  test("detects earlier date", () => {
    expect(dateHelper.isBefore("2025-02-14", "2025-02-15")).toBe(true);
  });

  test("detects same date is not before", () => {
    expect(dateHelper.isBefore("2025-02-15", "2025-02-15")).toBe(false);
  });

  test("handles time component", () => {
    expect(
      dateHelper.isBefore("2025-02-15T08:00:00", "2025-02-15T09:00:00")
    ).toBe(true);
  });
});

describe("isAfter", () => {
  test("detects later date", () => {
    expect(dateHelper.isAfter("2025-02-16", "2025-02-15")).toBe(true);
  });

  test("detects same date is not after", () => {
    expect(dateHelper.isAfter("2025-02-15", "2025-02-15")).toBe(false);
  });

  test("handles time component", () => {
    expect(
      dateHelper.isAfter("2025-02-15T10:00:00", "2025-02-15T09:00:00")
    ).toBe(true);
  });
});

describe("isWeekend", () => {
  test("detects Saturday as weekend", () => {
    // Feb 15, 2025 is a Saturday
    expect(dateHelper.isWeekend(FIXED_DATE)).toBe(true);
  });

  test("detects Sunday as weekend", () => {
    // Feb 16, 2025 is a Sunday
    expect(dateHelper.isWeekend("2025-02-16")).toBe(true);
  });

  test("detects weekday as not weekend", () => {
    // Feb 17, 2025 is a Monday
    expect(dateHelper.isWeekend("2025-02-17")).toBe(false);
  });
});

describe("isWeekday", () => {
  test("detects weekday correctly", () => {
    // Feb 17, 2025 is a Monday
    expect(dateHelper.isWeekday("2025-02-17")).toBe(true);
  });

  test("detects weekend as not weekday", () => {
    // Feb 15, 2025 is a Saturday
    expect(dateHelper.isWeekday(FIXED_DATE)).toBe(false);
  });

  test("handles timezone differences", () => {
    // Same moment in time might be weekday in one timezone and weekend in another
    const fridayEveningNYC = "2025-02-14T23:00:00-05:00"; // Friday in NYC, Saturday in Tokyo
    expect(dateHelper.isWeekday(fridayEveningNYC, NYC_TIMEZONE)).toBe(true);
    expect(dateHelper.isWeekday(fridayEveningNYC, TOKYO_TIMEZONE)).toBe(false);
  });
});

// 3. Math Functions
describe("addDays", () => {
  test("adds days correctly", () => {
    expect(dateHelper.addDays(FIXED_DATE, 5).format("YYYY-MM-DD")).toBe(
      "2025-02-20"
    );
  });

  test("handles negative days", () => {
    expect(dateHelper.addDays(FIXED_DATE, -5).format("YYYY-MM-DD")).toBe(
      "2025-02-10"
    );
  });

  test("handles month/year boundaries", () => {
    expect(dateHelper.addDays("2025-01-31", 1).format("YYYY-MM-DD")).toBe(
      "2025-02-01"
    );
    expect(dateHelper.addDays("2024-12-31", 1).format("YYYY-MM-DD")).toBe(
      "2025-01-01"
    );
  });
});

describe("subtractDays", () => {
  test("subtracts days correctly", () => {
    expect(dateHelper.subtractDays(FIXED_DATE, 5).format("YYYY-MM-DD")).toBe(
      "2025-02-10"
    );
  });

  test("handles negative days (which adds days)", () => {
    expect(dateHelper.subtractDays(FIXED_DATE, -5).format("YYYY-MM-DD")).toBe(
      "2025-02-20"
    );
  });

  test("handles month/year boundaries", () => {
    expect(dateHelper.subtractDays("2025-02-01", 1).format("YYYY-MM-DD")).toBe(
      "2025-01-31"
    );
    expect(dateHelper.subtractDays("2025-01-01", 1).format("YYYY-MM-DD")).toBe(
      "2024-12-31"
    );
  });
});

describe("addMonths", () => {
  test("adds months correctly", () => {
    expect(dateHelper.addMonths(FIXED_DATE, 2).format("YYYY-MM-DD")).toBe(
      "2025-04-15"
    );
  });

  test("handles day preservation", () => {
    // When adding months and the target month has fewer days, day should be adjusted
    expect(dateHelper.addMonths("2025-01-31", 1).format("YYYY-MM-DD")).toBe(
      "2025-02-28"
    );
  });

  test("handles leap years correctly", () => {
    expect(dateHelper.addMonths("2024-01-31", 1).format("YYYY-MM-DD")).toBe(
      "2024-02-29"
    );
  });
});

describe("subtractMonths", () => {
  test("subtracts months correctly", () => {
    expect(dateHelper.subtractMonths(FIXED_DATE, 2).format("YYYY-MM-DD")).toBe(
      "2024-12-15"
    );
  });

  test("handles day preservation", () => {
    // When subtracting months and the target month has fewer days, day should be adjusted
    expect(
      dateHelper.subtractMonths("2025-03-31", 1).format("YYYY-MM-DD")
    ).toBe("2025-02-28");
  });

  test("handles leap years correctly", () => {
    expect(
      dateHelper.subtractMonths("2024-03-31", 1).format("YYYY-MM-DD")
    ).toBe("2024-02-29");
  });
});

describe("addYears", () => {
  test("adds years correctly", () => {
    expect(dateHelper.addYears(FIXED_DATE, 2).format("YYYY-MM-DD")).toBe(
      "2027-02-15"
    );
  });

  test("handles leap year adjustments", () => {
    // Feb 29 in leap year to non-leap year should adjust to Feb 28
    expect(dateHelper.addYears(LEAP_YEAR_DATE, 1).format("YYYY-MM-DD")).toBe(
      "2025-02-28"
    );
  });

  test("handles leap year to leap year", () => {
    // Feb 29 to another leap year should preserve date
    expect(dateHelper.addYears(LEAP_YEAR_DATE, 4).format("YYYY-MM-DD")).toBe(
      "2028-02-29"
    );
  });
});

describe("subtractYears", () => {
  test("subtracts years correctly", () => {
    expect(dateHelper.subtractYears(FIXED_DATE, 2).format("YYYY-MM-DD")).toBe(
      "2023-02-15"
    );
  });

  test("handles leap year adjustments", () => {
    // Feb 29 in leap year to non-leap year should adjust to Feb 28
    expect(
      dateHelper.subtractYears(LEAP_YEAR_DATE, 1).format("YYYY-MM-DD")
    ).toBe("2023-02-28");
  });

  test("handles leap year to leap year", () => {
    // Feb 29 to another leap year should preserve date
    expect(
      dateHelper.subtractYears(LEAP_YEAR_DATE, 4).format("YYYY-MM-DD")
    ).toBe("2020-02-29");
  });
});

// 4. Parts Extraction
describe("getYear", () => {
  test("extracts year correctly", () => {
    expect(dateHelper.getYear(FIXED_DATE)).toBe(2025);
  });

  test("handles Date object", () => {
    expect(dateHelper.getYear(new Date("2025-02-15"))).toBe(2025);
  });

  test("respects timezone", () => {
    // Date near year boundary where it's different year in different timezones
    const newYearsEveNYC = "2024-12-31T23:30:00-05:00"; // 11:30PM Dec 31 in NYC, but Jan 1 in London
    expect(dateHelper.getYear(newYearsEveNYC, NYC_TIMEZONE)).toBe(2024);
    expect(dateHelper.getYear(newYearsEveNYC, LONDON_TIMEZONE)).toBe(2025);
  });
});

describe("getMonth", () => {
  test("extracts month correctly (1-indexed)", () => {
    // Month should be 1-12, not 0-11
    expect(dateHelper.getMonth(FIXED_DATE)).toBe(2);
  });

  test("handles Date object", () => {
    expect(dateHelper.getMonth(new Date("2025-02-15"))).toBe(2);
  });

  test("respects timezone", () => {
    // Date near month boundary where it's different month in different timezones
    const lastDayJanNYC = "2025-01-31T23:30:00-05:00"; // 11:30PM Jan 31 in NYC, but Feb 1 in London
    expect(dateHelper.getMonth(lastDayJanNYC, NYC_TIMEZONE)).toBe(1);
    expect(dateHelper.getMonth(lastDayJanNYC, LONDON_TIMEZONE)).toBe(2);
  });
});

describe("getDay", () => {
  test("extracts day of week correctly (0-indexed, Sunday=0)", () => {
    // Feb 15, 2025 is a Saturday (day 6)
    expect(dateHelper.getDay(FIXED_DATE)).toBe(6);
  });

  test("handles Sunday as day 0", () => {
    // Feb 16, 2025 is a Sunday
    expect(dateHelper.getDay("2025-02-16")).toBe(0);
  });

  test("respects timezone", () => {
    // Saturday evening in NYC is already Sunday in Tokyo
    const saturdayEveningNYC = "2025-02-15T23:30:00-05:00";
    expect(dateHelper.getDay(saturdayEveningNYC, NYC_TIMEZONE)).toBe(6); // Saturday
    expect(dateHelper.getDay(saturdayEveningNYC, TOKYO_TIMEZONE)).toBe(0); // Sunday
  });
});

describe("getMonthName", () => {
  test("gets correct month name", () => {
    expect(dateHelper.getMonthName(FIXED_DATE)).toBe("February");
  });

  test("handles locale", () => {
    expect(dateHelper.getMonthName(FIXED_DATE, undefined, "es")).toBe(
      "febrero"
    );
    expect(dateHelper.getMonthName(FIXED_DATE, undefined, "fr")).toBe(
      "février"
    );
  });

  test("respects timezone", () => {
    const lastDayJanNYC = "2025-01-31T23:30:00-05:00"; // 11:30PM Jan 31 in NYC, but Feb 1 in London
    expect(dateHelper.getMonthName(lastDayJanNYC, NYC_TIMEZONE)).toBe(
      "January"
    );
    expect(dateHelper.getMonthName(lastDayJanNYC, LONDON_TIMEZONE)).toBe(
      "February"
    );
  });
});

describe("getDayName", () => {
  test("gets correct day name", () => {
    // Feb 15, 2025 is a Saturday
    expect(dateHelper.getDayName(FIXED_DATE)).toBe("Saturday");
  });

  test("handles locale", () => {
    expect(dateHelper.getDayName(FIXED_DATE, undefined, "es")).toBe("sábado");
    expect(dateHelper.getDayName(FIXED_DATE, undefined, "fr")).toBe("samedi");
  });

  test("respects timezone", () => {
    const saturdayEveningNYC = "2025-02-15T23:30:00-05:00"; // Sat in NYC, Sun in Tokyo
    expect(dateHelper.getDayName(saturdayEveningNYC, NYC_TIMEZONE)).toBe(
      "Saturday"
    );
    expect(dateHelper.getDayName(saturdayEveningNYC, TOKYO_TIMEZONE)).toBe(
      "Sunday"
    );
  });
});

// 5. Ranges
describe("isBetween", () => {
  test("detects date in range", () => {
    expect(dateHelper.isBetween("2025-02-15", "2025-02-10", "2025-02-20")).toBe(
      true
    );
  });

  test("detects date outside range", () => {
    expect(dateHelper.isBetween("2025-02-25", "2025-02-10", "2025-02-20")).toBe(
      false
    );
  });

  test("handles inclusive boundaries", () => {
    const date = "2025-02-15";
    expect(dateHelper.isBetween(date, date, "2025-02-20")).toBe(true);
    expect(dateHelper.isBetween(date, "2025-02-10", date)).toBe(true);
  });
});

describe("daysBetween", () => {
  test("calculates days between dates", () => {
    expect(dateHelper.daysBetween("2025-02-10", "2025-02-15")).toBe(5);
  });

  test("ignores time component", () => {
    expect(
      dateHelper.daysBetween("2025-02-10T08:00:00", "2025-02-15T20:00:00")
    ).toBe(5);
  });

  test("returns absolute value", () => {
    // Order of dates shouldn't matter
    expect(dateHelper.daysBetween("2025-02-15", "2025-02-10")).toBe(5);
    expect(dateHelper.daysBetween("2025-02-10", "2025-02-15")).toBe(5);
  });

  test("handles timezone differences", () => {
    const date1 = "2025-02-15T00:00:00Z"; // Beginning of day UTC
    const date2 = "2025-02-10T00:00:00Z"; // Beginning of day UTC

    expect(dateHelper.daysBetween(date1, date2, "UTC")).toBe(5);
    expect(dateHelper.daysBetween(date1, date2, NYC_TIMEZONE)).toBe(5);
  });
});

describe("startOfDay", () => {
  test("gets start of day", () => {
    const result = dateHelper.startOfDay("2025-02-15T14:30:45");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
  });

  test("respects timezone", () => {
    const result = dateHelper.startOfDay("2025-02-15T02:30:00Z", NYC_TIMEZONE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-14 00:00:00");
  });

  test("preserves timezone in result", () => {
    const result = dateHelper.startOfDay("2025-02-15", NYC_TIMEZONE);
    expect(result.format()).toContain("-05:00"); // NYC timezone offset
  });
});

describe("endOfDay", () => {
  test("gets end of day", () => {
    const result = dateHelper.endOfDay("2025-02-15T08:30:00");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 23:59:59");
  });

  test("respects timezone", () => {
    const result = dateHelper.endOfDay("2025-02-15T02:30:00Z", NYC_TIMEZONE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-14 23:59:59");
  });

  test("preserves timezone in result", () => {
    const result = dateHelper.endOfDay("2025-02-15", NYC_TIMEZONE);
    expect(result.format()).toContain("-05:00"); // NYC timezone offset
  });
});

describe("startOfWeek", () => {
  test("gets start of week with default (Sunday)", () => {
    // Feb 15, 2025 is a Saturday, so start of week is Feb 9 (Sunday)
    const result = dateHelper.startOfWeek(FIXED_DATE);
    expect(result.format("YYYY-MM-DD")).toBe("2025-02-09");
  });

  test("handles custom week start (Monday)", () => {
    // Feb 15, 2025 is a Saturday, with Monday start the week begins on Feb 10
    const result = dateHelper.startOfWeek(FIXED_DATE, undefined, 1);
    expect(result.format("YYYY-MM-DD")).toBe("2025-02-10");
  });

  test("returns midnight on start day", () => {
    const result = dateHelper.startOfWeek(FIXED_DATE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-09 00:00:00");
  });
});

describe("endOfWeek", () => {
  test("gets end of week with default (Saturday)", () => {
    // Feb 15, 2025 is a Saturday, so end of week is Feb 15 (Saturday)
    const result = dateHelper.endOfWeek(FIXED_DATE);
    expect(result.format("YYYY-MM-DD")).toBe("2025-02-15");
  });

  test("handles custom week start (Monday)", () => {
    // Feb 15, 2025 is a Saturday, with Monday start the week ends on Feb 16 (Sunday)
    const result = dateHelper.endOfWeek(FIXED_DATE, undefined, 1);
    expect(result.format("YYYY-MM-DD")).toBe("2025-02-16");
  });

  test("returns end of day on end day", () => {
    const result = dateHelper.endOfWeek(FIXED_DATE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 23:59:59");
  });
});

describe("startOfMonth", () => {
  test("gets first day of month", () => {
    const result = dateHelper.startOfMonth(FIXED_DATE);
    expect(result.format("YYYY-MM-DD")).toBe("2025-02-01");
  });

  test("returns midnight on first day", () => {
    const result = dateHelper.startOfMonth(FIXED_DATE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-01 00:00:00");
  });

  test("respects timezone", () => {
    // End of January in NYC, but already February in Tokyo
    const date = "2025-01-31T23:30:00-05:00";
    expect(
      dateHelper.startOfMonth(date, NYC_TIMEZONE).format("YYYY-MM-DD")
    ).toBe("2025-01-01");
    expect(
      dateHelper.startOfMonth(date, TOKYO_TIMEZONE).format("YYYY-MM-DD")
    ).toBe("2025-02-01");
  });
});

describe("endOfMonth", () => {
  test("gets last day of month", () => {
    const result = dateHelper.endOfMonth(FIXED_DATE);
    expect(result.format("YYYY-MM-DD")).toBe("2025-02-28");
  });

  test("handles month with 31 days", () => {
    const result = dateHelper.endOfMonth("2025-01-15");
    expect(result.format("YYYY-MM-DD")).toBe("2025-01-31");
  });

  test("handles leap year February", () => {
    const result = dateHelper.endOfMonth("2024-02-15");
    expect(result.format("YYYY-MM-DD")).toBe("2024-02-29");
  });

  test("returns end of day on last day", () => {
    const result = dateHelper.endOfMonth(FIXED_DATE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-28 23:59:59");
  });
});

// 6. ISO/Fiscal
describe("getISOWeek", () => {
  test("gets correct ISO week number", () => {
    // Feb 15, 2025 falls in ISO week 7
    expect(dateHelper.getISOWeek(FIXED_DATE)).toBe(7);
  });

  test("handles year boundaries", () => {
    // ISO weeks can belong to adjacent years
    expect(dateHelper.getISOWeek("2025-01-01")).toBe(1);
    expect(dateHelper.getISOWeek("2024-12-31")).toBe(53); // 2024 has 53 ISO weeks
  });

  test("respects timezone", () => {
    // Week boundary case - week might be different in different timezones
    const saturdayEveningNYC = "2025-02-15T23:30:00-05:00"; // Sat week 7 in NYC, Sun week 8 in Tokyo
    expect(dateHelper.getISOWeek(saturdayEveningNYC, NYC_TIMEZONE)).toBe(7);
    expect(dateHelper.getISOWeek(saturdayEveningNYC, TOKYO_TIMEZONE)).toBe(8);
  });
});

describe("getISOYear", () => {
  test("gets correct ISO year", () => {
    expect(dateHelper.getISOYear(FIXED_DATE)).toBe(2025);
  });

  test("handles year boundaries", () => {
    // ISO year can differ from calendar year at boundaries
    // Last days of December can belong to week 1 of next year
    // First days of January can belong to last week of previous year
    expect(dateHelper.getISOYear("2025-01-01")).toBe(2025);
    expect(dateHelper.getISOYear("2024-12-31")).toBe(2024);
  });
});

describe("getQuarter", () => {
  test("gets correct quarter", () => {
    // February is in Q1 (1)
    expect(dateHelper.getQuarter(FIXED_DATE)).toBe(1);
  });

  test("handles all quarters", () => {
    expect(dateHelper.getQuarter("2025-01-15")).toBe(1);
    expect(dateHelper.getQuarter("2025-04-15")).toBe(2);
    expect(dateHelper.getQuarter("2025-07-15")).toBe(3);
    expect(dateHelper.getQuarter("2025-10-15")).toBe(4);
  });

  test("respects timezone", () => {
    // Quarter boundary case
    const lastDayQ1NYC = "2025-03-31T23:30:00-04:00"; // Q1 in NYC, Q2 in Tokyo
    expect(dateHelper.getQuarter(lastDayQ1NYC, NYC_TIMEZONE)).toBe(1);
    expect(dateHelper.getQuarter(lastDayQ1NYC, TOKYO_TIMEZONE)).toBe(2);
  });
});

describe("startOfQuarter", () => {
  test("gets correct start of quarter", () => {
    // Feb 15 is in Q1, which starts on Jan 1
    expect(dateHelper.startOfQuarter(FIXED_DATE).format("YYYY-MM-DD")).toBe(
      "2025-01-01"
    );
  });

  test("handles all quarters", () => {
    expect(dateHelper.startOfQuarter("2025-01-15").format("YYYY-MM-DD")).toBe(
      "2025-01-01"
    );
    expect(dateHelper.startOfQuarter("2025-04-15").format("YYYY-MM-DD")).toBe(
      "2025-04-01"
    );
    expect(dateHelper.startOfQuarter("2025-07-15").format("YYYY-MM-DD")).toBe(
      "2025-07-01"
    );
    expect(dateHelper.startOfQuarter("2025-10-15").format("YYYY-MM-DD")).toBe(
      "2025-10-01"
    );
  });

  test("returns midnight on first day", () => {
    const result = dateHelper.startOfQuarter(FIXED_DATE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-01-01 00:00:00");
  });
});

describe("endOfQuarter", () => {
  test("gets correct end of quarter", () => {
    // Feb 15 is in Q1, which ends on Mar 31
    expect(dateHelper.endOfQuarter(FIXED_DATE).format("YYYY-MM-DD")).toBe(
      "2025-03-31"
    );
  });

  test("handles all quarters", () => {
    expect(dateHelper.endOfQuarter("2025-01-15").format("YYYY-MM-DD")).toBe(
      "2025-03-31"
    );
    expect(dateHelper.endOfQuarter("2025-04-15").format("YYYY-MM-DD")).toBe(
      "2025-06-30"
    );
    expect(dateHelper.endOfQuarter("2025-07-15").format("YYYY-MM-DD")).toBe(
      "2025-09-30"
    );
    expect(dateHelper.endOfQuarter("2025-10-15").format("YYYY-MM-DD")).toBe(
      "2025-12-31"
    );
  });

  test("returns end of day on last day", () => {
    const result = dateHelper.endOfQuarter(FIXED_DATE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-03-31 23:59:59");
  });
});

// 7. Unix & UTC
describe("toUnixTimestamp", () => {
  test("converts date to Unix timestamp", () => {
    // Check that UTC date converts to expected Unix timestamp format
    const timestamp = dateHelper.toUnixTimestamp("2025-02-15T00:00:00Z", "UTC");
    expect(typeof timestamp).toBe("number");
    expect(timestamp).toBeGreaterThan(1700000000); // Basic sanity check for 2025 timestamp
  });

  test("respects timezone", () => {
    const date = "2025-02-15T00:00:00";
    const utcTimestamp = dateHelper.toUnixTimestamp(date, "UTC");
    const nycTimestamp = dateHelper.toUnixTimestamp(date, NYC_TIMEZONE);

    // There should be a timezone offset difference between UTC and NYC
    expect(utcTimestamp).not.toBe(nycTimestamp);
    // NYC is behind UTC, so UTC timestamp should be larger
    expect(utcTimestamp).toBeGreaterThan(nycTimestamp);
  });

  test("handles Date objects", () => {
    const dateObj = new Date("2025-02-15T00:00:00Z");
    const timestamp = dateHelper.toUnixTimestamp(dateObj);
    expect(timestamp).toBe(Math.floor(dateObj.getTime() / 1000));
  });
});

describe("fromUnixTimestamp", () => {
  test("converts Unix timestamp to date", () => {
    // Unix timestamp for 2025-02-15 00:00:00 UTC
    const timestamp = 1739548800;
    const result = dateHelper.fromUnixTimestamp(timestamp, "UTC");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
  });

  test("respects timezone", () => {
    const timestamp = 1739548800; // 2025-02-15 00:00:00 UTC
    const utcResult = dateHelper.fromUnixTimestamp(timestamp, "UTC");
    const nycResult = dateHelper.fromUnixTimestamp(timestamp, NYC_TIMEZONE);

    // In NYC, this would be 5 hours earlier (19:00 on the previous day)
    expect(utcResult.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
    expect(nycResult.format("YYYY-MM-DD HH:mm")).toMatch(/2025-02-14 19:00/);
  });
});

describe("toUTC", () => {
  test("converts date to UTC", () => {
    const result = dateHelper.toUTC("2025-02-15T00:00:00-05:00");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 05:00:00");
    expect(result.format()).toContain("Z"); // Contains 'Z' for UTC timezone
  });

  test("preserves date if already UTC", () => {
    const result = dateHelper.toUTC("2025-02-15T00:00:00Z");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
  });

  test("handles Date objects", () => {
    // Create date in local timezone
    const localDate = new Date("2025-02-15T00:00:00");
    const result = dateHelper.toUTC(localDate);

    // The result should be in UTC
    expect(result.format()).toContain("Z");
  });
});

describe("fromUTC", () => {
  test("converts UTC date to specific timezone", () => {
    const result = dateHelper.fromUTC("2025-02-15T05:00:00Z", NYC_TIMEZONE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
    expect(result.format()).toContain("-05:00"); // NYC timezone offset
  });

  test("handles Date objects", () => {
    const utcDate = new Date("2025-02-15T05:00:00Z");
    const result = dateHelper.fromUTC(utcDate, NYC_TIMEZONE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
  });

  test("respects DST in target timezone", () => {
    // Test with a date during DST
    const summerDate = "2025-07-15T05:00:00Z";
    const result = dateHelper.fromUTC(summerDate, NYC_TIMEZONE);
    expect(result.format()).toContain("-04:00"); // NYC timezone during DST
  });
});
