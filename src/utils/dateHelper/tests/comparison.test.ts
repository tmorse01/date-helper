/**
 * Tests for date comparison functions
 */
import * as comparison from "../comparison";

// Constants for testing
const NYC_TIMEZONE = "America/New_York";
const TOKYO_TIMEZONE = "Asia/Tokyo";
const FIXED_DATE = "2025-02-15"; // A Saturday

describe("isSameDay", () => {
  test("detects same day", () => {
    expect(comparison.isSameDay("2025-02-15", "2025-02-15T23:59:59")).toBe(
      true
    );
  });

  test("detects different days", () => {
    expect(comparison.isSameDay("2025-02-15", "2025-02-16")).toBe(false);
  });

  test("handles timezone differences", () => {
    // Same moment in time, different day in different timezones
    const date1 = "2025-02-15T01:00:00Z"; // Feb 14 evening NYC, Feb 15 morning Tokyo
    expect(comparison.isSameDay(date1, date1, NYC_TIMEZONE)).toBe(true);
    expect(comparison.isSameDay(date1, "2025-02-14", NYC_TIMEZONE)).toBe(true);
    expect(comparison.isSameDay(date1, "2025-02-15", TOKYO_TIMEZONE)).toBe(
      true
    );
  });
});

describe("isBefore", () => {
  test("detects earlier date", () => {
    expect(comparison.isBefore("2025-02-14", "2025-02-15")).toBe(true);
  });

  test("detects same date is not before", () => {
    expect(comparison.isBefore("2025-02-15", "2025-02-15")).toBe(false);
  });

  test("handles time component", () => {
    expect(
      comparison.isBefore("2025-02-15T08:00:00", "2025-02-15T09:00:00")
    ).toBe(true);
  });
});

describe("isAfter", () => {
  test("detects later date", () => {
    expect(comparison.isAfter("2025-02-16", "2025-02-15")).toBe(true);
  });

  test("detects same date is not after", () => {
    expect(comparison.isAfter("2025-02-15", "2025-02-15")).toBe(false);
  });

  test("handles time component", () => {
    expect(
      comparison.isAfter("2025-02-15T10:00:00", "2025-02-15T09:00:00")
    ).toBe(true);
  });
});

describe("isWeekend", () => {
  test("detects Saturday as weekend", () => {
    // Feb 15, 2025 is a Saturday
    expect(comparison.isWeekend(FIXED_DATE)).toBe(true);
  });

  test("detects Sunday as weekend", () => {
    // Feb 16, 2025 is a Sunday
    expect(comparison.isWeekend("2025-02-16")).toBe(true);
  });

  test("detects weekday as not weekend", () => {
    // Feb 17, 2025 is a Monday
    expect(comparison.isWeekend("2025-02-17")).toBe(false);
  });
});

describe("isWeekday", () => {
  test("detects weekday correctly", () => {
    // Feb 17, 2025 is a Monday
    expect(comparison.isWeekday("2025-02-17")).toBe(true);
  });

  test("detects weekend as not weekday", () => {
    // Feb 15, 2025 is a Saturday
    expect(comparison.isWeekday(FIXED_DATE)).toBe(false);
  });

  test("handles timezone differences", () => {
    // Same moment in time might be weekday in one timezone and weekend in another
    const fridayEveningNYC = "2025-02-14T23:00:00-05:00"; // Friday in NYC, Saturday in Tokyo
    expect(comparison.isWeekday(fridayEveningNYC, NYC_TIMEZONE)).toBe(true);
    expect(comparison.isWeekday(fridayEveningNYC, TOKYO_TIMEZONE)).toBe(false);
  });
});
