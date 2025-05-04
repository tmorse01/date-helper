/**
 * Tests for date ranges functions
 */
import * as ranges from "../ranges";

// Constants for testing
const NYC_TIMEZONE = "America/New_York";
const TOKYO_TIMEZONE = "Asia/Tokyo";
const FIXED_DATE = "2025-02-15"; // A Saturday

describe("isBetween", () => {
  test("detects date in range", () => {
    expect(ranges.isBetween("2025-02-15", "2025-02-10", "2025-02-20")).toBe(
      true
    );
  });

  test("detects date outside range", () => {
    expect(ranges.isBetween("2025-02-25", "2025-02-10", "2025-02-20")).toBe(
      false
    );
  });

  test("handles inclusive boundaries", () => {
    const date = "2025-02-15";
    expect(ranges.isBetween(date, date, "2025-02-20")).toBe(true);
    expect(ranges.isBetween(date, "2025-02-10", date)).toBe(true);
  });
});

describe("daysBetween", () => {
  test("calculates days between dates", () => {
    expect(ranges.daysBetween("2025-02-10", "2025-02-15")).toBe(5);
  });

  test("ignores time component", () => {
    expect(
      ranges.daysBetween("2025-02-10T08:00:00", "2025-02-15T20:00:00")
    ).toBe(5);
  });

  test("returns absolute value", () => {
    // Order of dates shouldn't matter
    expect(ranges.daysBetween("2025-02-15", "2025-02-10")).toBe(5);
    expect(ranges.daysBetween("2025-02-10", "2025-02-15")).toBe(5);
  });

  test("handles timezone differences", () => {
    const date1 = "2025-02-15T00:00:00Z"; // Beginning of day UTC
    const date2 = "2025-02-10T00:00:00Z"; // Beginning of day UTC

    expect(ranges.daysBetween(date1, date2, "UTC")).toBe(5);
    expect(ranges.daysBetween(date1, date2, NYC_TIMEZONE)).toBe(5);
  });
});

describe("startOfDay", () => {
  test("gets start of day", () => {
    const result = ranges.startOfDay("2025-02-15T14:30:45");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 00:00:00");
  });

  test("respects timezone", () => {
    const result = ranges.startOfDay("2025-02-15T02:30:00Z", NYC_TIMEZONE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-14 00:00:00");
  });

  test("preserves timezone in result", () => {
    const result = ranges.startOfDay("2025-02-15", NYC_TIMEZONE);
    expect(result.format()).toContain("-05:00"); // NYC timezone offset
  });
});

describe("endOfDay", () => {
  test("gets end of day", () => {
    const result = ranges.endOfDay("2025-02-15T08:30:00");
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 23:59:59");
  });

  test("respects timezone", () => {
    const result = ranges.endOfDay("2025-02-15T02:30:00Z", NYC_TIMEZONE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-14 23:59:59");
  });

  test("preserves timezone in result", () => {
    const result = ranges.endOfDay("2025-02-15", NYC_TIMEZONE);
    expect(result.format()).toContain("-05:00"); // NYC timezone offset
  });
});

describe("startOfWeek", () => {
  test("gets start of week with default (Sunday)", () => {
    // Feb 15, 2025 is a Saturday, so start of week is Feb 9 (Sunday)
    const result = ranges.startOfWeek(FIXED_DATE);
    expect(result.format("YYYY-MM-DD")).toBe("2025-02-09");
  });

  test("handles custom week start (Monday)", () => {
    // Feb 15, 2025 is a Saturday, with Monday start the week begins on Feb 10
    const result = ranges.startOfWeek(FIXED_DATE, undefined, 1);
    expect(result.format("YYYY-MM-DD")).toBe("2025-02-10");
  });

  test("returns midnight on start day", () => {
    const result = ranges.startOfWeek(FIXED_DATE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-09 00:00:00");
  });
});

describe("endOfWeek", () => {
  test("gets end of week with default (Saturday)", () => {
    // Feb 15, 2025 is a Saturday, so end of week is Feb 15 (Saturday)
    const result = ranges.endOfWeek(FIXED_DATE);
    expect(result.format("YYYY-MM-DD")).toBe("2025-02-15");
  });

  test("handles custom week start (Monday)", () => {
    // Feb 15, 2025 is a Saturday, with Monday start the week ends on Feb 16 (Sunday)
    const result = ranges.endOfWeek(FIXED_DATE, undefined, 1);
    expect(result.format("YYYY-MM-DD")).toBe("2025-02-16");
  });

  test("returns end of day on end day", () => {
    const result = ranges.endOfWeek(FIXED_DATE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-15 23:59:59");
  });
});

describe("startOfMonth", () => {
  test("gets first day of month", () => {
    const result = ranges.startOfMonth(FIXED_DATE);
    expect(result.format("YYYY-MM-DD")).toBe("2025-02-01");
  });

  test("returns midnight on first day", () => {
    const result = ranges.startOfMonth(FIXED_DATE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-01 00:00:00");
  });

  test("respects timezone", () => {
    // End of January in NYC, but already February in Tokyo
    const date = "2025-01-31T23:30:00-05:00";
    expect(ranges.startOfMonth(date, NYC_TIMEZONE).format("YYYY-MM-DD")).toBe(
      "2025-01-01"
    );
    expect(ranges.startOfMonth(date, TOKYO_TIMEZONE).format("YYYY-MM-DD")).toBe(
      "2025-02-01"
    );
  });
});

describe("endOfMonth", () => {
  test("gets last day of month", () => {
    const result = ranges.endOfMonth(FIXED_DATE);
    expect(result.format("YYYY-MM-DD")).toBe("2025-02-28");
  });

  test("handles month with 31 days", () => {
    const result = ranges.endOfMonth("2025-01-15");
    expect(result.format("YYYY-MM-DD")).toBe("2025-01-31");
  });

  test("handles leap year February", () => {
    const result = ranges.endOfMonth("2024-02-15");
    expect(result.format("YYYY-MM-DD")).toBe("2024-02-29");
  });

  test("returns end of day on last day", () => {
    const result = ranges.endOfMonth(FIXED_DATE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-02-28 23:59:59");
  });
});
