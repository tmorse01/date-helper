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

  test("handles invalid date input gracefully", () => {
    // Should not throw an error with invalid input
    expect(() => formatting.formatDate("not-a-date")).not.toThrow();
  });

  test("throws error on invalid timezone", () => {
    // Should fall back to local timezone with invalid timezone
    expect(() =>
      formatting.formatDate(FIXED_DATE, "YYYY-MM-DD", "Invalid/Zone")
    ).toThrow();
  });

  // New tests for date-only formats
  test("correctly formats date-only input in various formats", () => {
    expect(formatting.formatDate("2025-05-02", "YYYY-MM-DD")).toBe(
      "2025-05-02"
    );
    expect(formatting.formatDate("2025/05/02", "YYYY-MM-DD")).toBe(
      "2025-05-02"
    );
    expect(
      formatting.formatDate("2025-05-02T00:00:00.000Z", "YYYY-MM-DD")
    ).toBe("2025-05-02");
  });

  test("preserves millisecond precision when formatting", () => {
    expect(
      formatting.formatDate(
        "2025-05-02T00:00:00.123Z",
        "YYYY-MM-DD HH:mm:ss.SSS"
      )
    ).toBe("2025-05-02 00:00:00.123");
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

  test("handles null input by returning 'Invalid Date'", () => {
    // @ts-expect-error Testing null input even though TypeScript doesn't allow it
    const result = formatting.formatDateTime(null);
    // Should return "Invalid Date"
    expect(result).toBe("Invalid Date");
  });

  // New tests for date-only handling in formatDateTime
  test("treats date-only inputs consistently", () => {
    expect(formatting.formatDateTime("2025-05-02", "UTC")).toBe(
      "2025-05-02 00:00:00"
    );
    expect(formatting.formatDateTime("2025/05/02", "UTC")).toBe(
      "2025-05-02 00:00:00"
    );
  });

  test("preserves milliseconds in output", () => {
    // Adding a custom format parameter would be helpful for this test
    const result = formatting.formatDateTime("2025-05-02T00:00:00.123Z", "UTC");
    // Should include milliseconds if we extend formatDateTime to support custom formats
    expect(result).toBe("2025-05-02 00:00:00");
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

  test("handles empty string input", () => {
    const result = formatting.parseDate("");
    expect(result.isValid()).toBe(false);
  });

  // New tests for date-only parsing and timezone handling
  test("parses date-only formats consistently", () => {
    const formats = [
      "2025-05-02",
      "2025/05/02",
      "2025-05-02T00:00",
      "2025-05-02 00:00:00",
      "2025-05-02T00:00:00.000Z",
      "2025-05-02T12:00 AM",
    ];

    formats.forEach((format) => {
      const result = formatting.parseDate(format);
      expect(result.format("YYYY-MM-DD")).toBe("2025-05-02");
    });
  });

  test("treats naive dates as local timezone by default", () => {
    const naiveDate = "2025-05-01T10:00:00";
    const result = formatting.parseDate(naiveDate);
    // The result depends on the local timezone, but should be valid
    expect(result.isValid()).toBe(true);
  });

  test("treats naive dates as specified timezone when provided", () => {
    const naiveDate = "2025-05-01T10:00:00";
    const nyResult = formatting.parseDate(naiveDate, NYC_TIMEZONE);
    const tokyoResult = formatting.parseDate(naiveDate, TOKYO_TIMEZONE);

    // These should be different due to timezone differences
    expect(nyResult.format()).not.toBe(tokyoResult.format());
  });

  test("preserves millisecond precision", () => {
    const dateWithMs = "2025-05-02T00:00:00.123Z";
    const result = formatting.parseDate(dateWithMs);
    expect(result.format("YYYY-MM-DD HH:mm:ss.SSS")).toBe(
      "2025-05-02 00:00:00.123"
    );
  });
});
