/**
 * Tests for Unix and UTC conversion functions
 */
import * as unixUtc from "../unixUtc";

// Constants for testing
const NYC_TIMEZONE = "America/New_York";
// const TOKYO_TIMEZONE = "Asia/Tokyo";

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
    // NYC is behind UTC, so UTC timestamp should be larger
    expect(utcTimestamp).toBeGreaterThan(nycTimestamp);
  });

  test("handles Date objects", () => {
    const dateObj = new Date("2025-02-15T00:00:00Z");
    const timestamp = unixUtc.toUnixTimestamp(dateObj);
    expect(timestamp).toBe(Math.floor(dateObj.getTime() / 1000));
  });
});

describe("fromUnixTimestamp", () => {
  test("converts Unix timestamp to date", () => {
    // Unix timestamp for 2025-02-15 00:00:00 UTC
    const timestamp = 1739548800;
    const result = unixUtc.fromUnixTimestamp(timestamp, "UTC");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
  });

  test("respects timezone", () => {
    const timestamp = 1739548800; // 2025-02-15 00:00:00 UTC
    const utcResult = unixUtc.fromUnixTimestamp(timestamp, "UTC");
    const nycResult = unixUtc.fromUnixTimestamp(timestamp, NYC_TIMEZONE);

    // In NYC, this would be 5 hours earlier (19:00 on the previous day)
    expect(utcResult.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
    expect(nycResult.format("YYYY-MM-DD HH:mm")).toMatch(/2025-02-14 19:00/);
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
});
