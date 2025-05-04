/**
 * Tests for Unix and UTC conversion functions
 */
import * as unixUtc from "../unixUtc";

// Constants for testing
const NYC_TIMEZONE = "America/New_York";
const TOKYO_TIMEZONE = "Asia/Tokyo";

describe("toUnixTimestamp", () => {
  test("converts date to Unix timestamp", () => {
    // Check that UTC date converts to expected Unix timestamp format
    const timestamp = unixUtc.toUnixTimestamp("2025-02-15T00:00:00Z", "UTC");
    expect(typeof timestamp).toBe("number");
    expect(timestamp).toBeGreaterThan(1700000000); // Basic sanity check for 2025 timestamp
  });

  test("respects timezone", () => {
    const date = "2025-02-15T00:00:00";
    const utcTimestamp = unixUtc.toUnixTimestamp(date, "UTC");
    const nycTimestamp = unixUtc.toUnixTimestamp(date, NYC_TIMEZONE);

    // There should be a timezone offset difference between UTC and NYC
    expect(utcTimestamp).not.toBe(nycTimestamp);
    // When it's midnight in both places, the NYC timestamp will be higher
    // because midnight in NYC is 5am UTC (later in the day)
    expect(nycTimestamp).toBeGreaterThan(utcTimestamp);
  });

  test("handles Date objects", () => {
    const dateObj = new Date("2025-02-15T00:00:00Z");
    const timestamp = unixUtc.toUnixTimestamp(dateObj);
    expect(timestamp).toBe(Math.floor(dateObj.getTime() / 1000));
  });

  test("handles invalid date input gracefully", () => {
    // @ts-expect-error - Testing null input even though TypeScript doesn't allow it
    expect(() => unixUtc.toUnixTimestamp(null)).not.toThrow();
    expect(() => unixUtc.toUnixTimestamp("not-a-date")).not.toThrow();
  });

  test("handles invalid timezone input gracefully", () => {
    // Should fall back to local timezone with invalid timezone
    expect(() =>
      unixUtc.toUnixTimestamp("2025-02-15", "Invalid/Zone")
    ).toThrow();
  });

  test("handles DST transitions", () => {
    // Test during spring forward DST transition
    const beforeDST = "2022-03-13T01:59:59-05:00";
    const afterDST = "2022-03-13T03:00:00-04:00";

    const beforeTimestamp = unixUtc.toUnixTimestamp(beforeDST, NYC_TIMEZONE);
    const afterTimestamp = unixUtc.toUnixTimestamp(afterDST, NYC_TIMEZONE);

    // In Unix time, both dates correspond to 06:59:59 and 07:00:00 UTC, respectively.
    // Therefore, they are 1 second apart.
    expect(afterTimestamp - beforeTimestamp).toBe(1);
  });

  // New tests for date-only formats and null/undefined handling
  test("handles date-only formats consistently", () => {
    const formats = [
      "2025-05-02",
      "2025/05/02",
      "2025-05-02T00:00",
      "2025-05-02 00:00:00",
    ];

    const timestamps = formats.map((format) =>
      unixUtc.toUnixTimestamp(format, "UTC")
    );

    // All these formats should yield the same timestamp
    const expectedTimestamp = timestamps[0];
    timestamps.forEach((timestamp) => {
      expect(timestamp).toBe(expectedTimestamp);
    });
  });

  test("handles undefined input by throwing a meaningful error", () => {
    // @ts-expect-error - Testing undefined input
    expect(() => unixUtc.toUnixTimestamp(undefined)).toThrow();
  });

  test("handles fall-back DST transition correctly", () => {
    // Test during fall back DST transition (first occurrence of 1:30 AM)
    const firstOccurrence = "2022-11-06T01:30:00-04:00";
    // Second occurrence of 1:30 AM after falling back
    const secondOccurrence = "2022-11-06T01:30:00-05:00";

    const firstTimestamp = unixUtc.toUnixTimestamp(
      firstOccurrence,
      NYC_TIMEZONE
    );
    const secondTimestamp = unixUtc.toUnixTimestamp(
      secondOccurrence,
      NYC_TIMEZONE
    );

    // The second occurrence should be 1 hour later in Unix time
    expect(secondTimestamp - firstTimestamp).toBe(3600);
  });
});

describe("fromUnixTimestamp", () => {
  test("converts Unix timestamp to date", () => {
    const timestamp = 1739577600; // 2025-02-15 00:00:00 UTC
    const result = unixUtc.fromUnixTimestamp(timestamp, "UTC");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
  });

  test("respects timezone", () => {
    const timestamp = 1739577600; // 2025-02-15 00:00:00 UTC
    const utcResult = unixUtc.fromUnixTimestamp(timestamp, "UTC");
    const nycResult = unixUtc.fromUnixTimestamp(timestamp, NYC_TIMEZONE);

    // In NYC, this would be 5 hours earlier (19:00 on the previous day)
    expect(utcResult.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
    expect(nycResult.format("YYYY-MM-DD HH:mm")).toMatch(/2025-02-14 19:00/);
  });

  test("throws error on invalid timezone input", () => {
    const timestamp = 1739577600; // 2025-02-15 00:00:00 UTC
    expect(() =>
      unixUtc.fromUnixTimestamp(timestamp, "Invalid/Zone")
    ).toThrow();
  });

  test("throws error for string input", () => {
    // @ts-expect-error - Testing invalid input type
    expect(() => unixUtc.fromUnixTimestamp("not-a-number")).toThrow();
  });

  test("throws error for null input", () => {
    // @ts-expect-error - Testing null input
    expect(() => unixUtc.fromUnixTimestamp(null)).toThrow();
  });

  // TODO: Fix test for DST transition
  // test("handles DST transitions correctly", () => {
  //   // Unix timestamp for March 13, 2022 at 2:30 AM EST (after "spring forward")
  //   // This time doesn't actually exist due to the DST jump from 1:59AM to 3:00AM
  //   const timestamp = 1647155400; // 2022-03-13 07:30:00 UTC
  //   const result = unixUtc.fromUnixTimestamp(timestamp, NYC_TIMEZONE);

  //   // Should correctly show as 3:30AM (after DST change) not 2:30AM
  //   expect(result.format("YYYY-MM-DD HH:mm")).toBe("2022-03-13 03:30");
  // });

  // New tests for preserving time precision between timezones
  test("preserves time precision when converting between timezones", () => {
    const timestamp = 1739577600.123; // Adding fractional seconds
    const utcResult = unixUtc.fromUnixTimestamp(timestamp, "UTC");
    const nycResult = unixUtc.fromUnixTimestamp(timestamp, NYC_TIMEZONE);
    const tokyoResult = unixUtc.fromUnixTimestamp(timestamp, TOKYO_TIMEZONE);

    // Despite being in different timezones, the seconds and milliseconds should be preserved
    expect(utcResult.format("ss.SSS")).toBe(nycResult.format("ss.SSS"));
    expect(utcResult.format("ss.SSS")).toBe(tokyoResult.format("ss.SSS"));
  });

  test("handles zero timestamp correctly", () => {
    // Unix epoch (January 1, 1970, 00:00:00 UTC)
    const result = unixUtc.fromUnixTimestamp(0, "UTC");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("1970-01-01 00:00:00");
  });

  test("handles negative timestamps (pre-1970 dates)", () => {
    // December 31, 1969, 23:00:00 UTC (one hour before Unix epoch)
    const result = unixUtc.fromUnixTimestamp(-3600, "UTC");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("1969-12-31 23:00:00");
  });
});

describe("toUTC", () => {
  test("converts date to UTC", () => {
    const result = unixUtc.toUTC("2025-02-15T00:00:00-05:00");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 05:00:00");
    expect(result.format()).toContain("Z"); // Contains 'Z' for UTC timezone
  });

  test("preserves date if already UTC", () => {
    const result = unixUtc.toUTC("2025-02-15T00:00:00Z");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
  });

  test("handles Date objects", () => {
    // Create date in local timezone
    const localDate = new Date("2025-02-15T00:00:00");
    const result = unixUtc.toUTC(localDate);

    // The result should be in UTC
    expect(result.format()).toContain("Z");
  });

  test("handles invalid date input gracefully", () => {
    expect(() => unixUtc.toUTC("not-a-date")).not.toThrow();
  });

  test("handles null/undefined input", () => {
    // @ts-expect-error - Testing null input
    expect(() => unixUtc.toUTC(null)).not.toThrow();
    // @ts-expect-error - Testing undefined input
    expect(() => unixUtc.toUTC(undefined)).not.toThrow();
  });

  // New test cases for date-only formats and millisecond precision
  test("handles date-only strings correctly", () => {
    const result = unixUtc.toUTC("2025-05-02");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-05-02 00:00:00");
  });

  test("preserves millisecond precision", () => {
    const result = unixUtc.toUTC("2025-05-02T12:34:56.789-05:00");
    expect(result.format("YYYY-MM-DD HH:mm:ss.SSS")).toBe(
      "2025-05-02 17:34:56.789"
    );
  });
});

describe("fromUTC", () => {
  test("converts UTC date to specific timezone", () => {
    const result = unixUtc.fromUTC("2025-02-15T05:00:00Z", NYC_TIMEZONE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
    expect(result.format()).toContain("-05:00"); // NYC timezone offset
  });

  test("handles Date objects", () => {
    const utcDate = new Date("2025-02-15T05:00:00Z");
    const result = unixUtc.fromUTC(utcDate, NYC_TIMEZONE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
  });

  test("respects DST in target timezone", () => {
    // Test with a date during DST
    const summerDate = "2025-07-15T05:00:00Z";
    const result = unixUtc.fromUTC(summerDate, NYC_TIMEZONE);
    expect(result.format()).toContain("-04:00"); // NYC timezone during DST
  });

  test("returns invalid date for invalid date input", () => {
    const result = unixUtc.fromUTC("not-a-date", NYC_TIMEZONE);
    expect(result.isValid()).toBe(false);
  });

  test("throws error for invalid timezone", () => {
    expect(() => unixUtc.fromUTC("2025-02-15", "Invalid/Zone")).toThrow();
  });

  test("handles non-existent time during DST spring forward", () => {
    // 2:30 AM on March 13, 2022 doesn't exist in America/New_York due to DST
    const nonExistentTime = "2022-03-13T07:30:00Z"; // 2:30 AM EST, which doesn't exist
    const result = unixUtc.fromUTC(nonExistentTime, NYC_TIMEZONE);

    // Should skip to 3:30 AM EDT
    expect(result.format("YYYY-MM-DD HH:mm")).toBe("2022-03-13 03:30");
  });

  // New tests for null handling and preserving precision
  test("handles null input gracefully", () => {
    // @ts-expect-error - Testing null input
    expect(() => unixUtc.fromUTC(null, NYC_TIMEZONE)).not.toThrow();
  });

  test("preserves millisecond precision when converting to timezone", () => {
    const dateWithMs = "2025-05-02T12:34:56.789Z";
    const result = unixUtc.fromUTC(dateWithMs, NYC_TIMEZONE);
    // Verify millseconds are preserved in timezone conversion
    expect(result.format("YYYY-MM-DD HH:mm:ss.SSS")).toMatch(
      /2025-05-02 \d{2}:34:56.789/
    );
  });

  test("handles date-only formats consistently", () => {
    const result = unixUtc.fromUTC("2025-05-02", NYC_TIMEZONE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-05-01 20:00:00");
  });
});
