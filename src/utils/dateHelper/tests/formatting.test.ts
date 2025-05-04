/**
 * Tests for date formatting functions
 */
import * as formatting from "../formatting";

// Constants for testing
const NYC_TIMEZONE = "America/New_York";
const TOKYO_TIMEZONE = "Asia/Tokyo";
const FIXED_DATE = "2025-02-15"; // A Saturday

// Mock current date to ensure consistent test results
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2025-05-04"));
});

afterEach(() => {
  jest.useRealTimers();
});

describe("formatDate", () => {
  test("formats date with default format", () => {
    expect(formatting.formatDate(FIXED_DATE)).toBe("2025-02-15");
  });

  test("formats date with custom format", () => {
    expect(formatting.formatDate(FIXED_DATE, "MM/DD/YYYY")).toBe("02/15/2025");
  });

  test("handles timezone conversion", () => {
    // This test verifies that the same UTC moment displays as different dates in different timezones
    const utcDate = "2025-02-15T01:00:00Z"; // 8pm on Feb 14 in NYC, 10am on Feb 15 in Tokyo
    expect(formatting.formatDate(utcDate, "YYYY-MM-DD", NYC_TIMEZONE)).toBe(
      "2025-02-14"
    );
    expect(formatting.formatDate(utcDate, "YYYY-MM-DD", TOKYO_TIMEZONE)).toBe(
      "2025-02-15"
    );
  });
});

describe("formatDateTime", () => {
  test("formats datetime with default format", () => {
    expect(formatting.formatDateTime(FIXED_DATE)).toBe("2025-02-15 00:00:00");
  });

  test("handles timezone conversion", () => {
    const utcDate = "2025-02-15T12:30:45Z";
    expect(formatting.formatDateTime(utcDate, NYC_TIMEZONE)).toMatch(
      /2025-02-15 0?7:30:45/
    );
    expect(formatting.formatDateTime(utcDate, TOKYO_TIMEZONE)).toMatch(
      /2025-02-15 2?1:30:45/
    );
  });

  test("formats current date and time", () => {
    // Using toMatch instead of toBe to handle different timezone formats
    const result = formatting.formatDateTime(new Date("2025-05-04T00:00:00"));
    expect(result).toMatch(/^2025-05-04/); // Just check that it starts with the correct date
  });
});

describe("parseDate", () => {
  test("parses date string into dayjs object", () => {
    const result = formatting.parseDate(FIXED_DATE);
    expect(result.format("YYYY-MM-DD")).toBe(FIXED_DATE);
  });

  test("handles timezone conversion", () => {
    const utcDate = "2025-02-15T00:00:00Z";
    const nyc = formatting.parseDate(utcDate, NYC_TIMEZONE);
    expect(nyc.format("YYYY-MM-DD HH")).toBe("2025-02-14 19");
  });

  test("handles invalid date", () => {
    // dayjs silently handles invalid dates
    const result = formatting.parseDate("not-a-date");
    expect(result.isValid()).toBe(false);
  });
});
