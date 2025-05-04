/**
 * Tests for date math functions
 */
import * as math from "../math";

// Constants for testing
const FIXED_DATE = "2025-02-15"; // A Saturday
const LEAP_YEAR_DATE = "2024-02-29"; // Leap year date
const NYC_TIMEZONE = "America/New_York";
const TOKYO_TIMEZONE = "Asia/Tokyo";

describe("addDays", () => {
  test("adds days correctly", () => {
    expect(math.addDays(FIXED_DATE, 5).format("YYYY-MM-DD")).toBe("2025-02-20");
  });

  test("handles negative days", () => {
    expect(math.addDays(FIXED_DATE, -5).format("YYYY-MM-DD")).toBe(
      "2025-02-10"
    );
  });

  test("handles month/year boundaries", () => {
    expect(math.addDays("2025-01-31", 1).format("YYYY-MM-DD")).toBe(
      "2025-02-01"
    );
    expect(math.addDays("2024-12-31", 1).format("YYYY-MM-DD")).toBe(
      "2025-01-01"
    );
  });

  test("handles null/undefined input", () => {
    // @ts-expect-error - Testing null input even though TypeScript doesn't allow it
    expect(() => math.addDays(null, 5)).not.toThrow();
    // @ts-expect-error - Testing undefined input even though TypeScript doesn't allow it
    expect(() => math.addDays(undefined, 5)).not.toThrow();
  });
});

describe("subtractDays", () => {
  test("subtracts days correctly", () => {
    expect(math.subtractDays(FIXED_DATE, 5).format("YYYY-MM-DD")).toBe(
      "2025-02-10"
    );
  });

  test("handles negative days (which adds days)", () => {
    expect(math.subtractDays(FIXED_DATE, -5).format("YYYY-MM-DD")).toBe(
      "2025-02-20"
    );
  });

  test("handles month/year boundaries", () => {
    expect(math.subtractDays("2025-02-01", 1).format("YYYY-MM-DD")).toBe(
      "2025-01-31"
    );
    expect(math.subtractDays("2025-01-01", 1).format("YYYY-MM-DD")).toBe(
      "2024-12-31"
    );
  });
});

describe("addMonths", () => {
  test("adds months correctly", () => {
    expect(math.addMonths(FIXED_DATE, 2).format("YYYY-MM-DD")).toBe(
      "2025-04-15"
    );
  });

  test("handles day preservation", () => {
    // When adding months and the target month has fewer days, day should be adjusted
    expect(math.addMonths("2025-01-31", 1).format("YYYY-MM-DD")).toBe(
      "2025-02-28"
    );
  });

  test("handles leap years correctly", () => {
    expect(math.addMonths("2024-01-31", 1).format("YYYY-MM-DD")).toBe(
      "2024-02-29"
    );
  });

  test("handles timezone differences", () => {
    const date = "2025-01-31T23:30:00-05:00"; // Late Jan 31 in NYC, already Feb 1 in Tokyo
    expect(math.addMonths(date, 1, NYC_TIMEZONE).format("YYYY-MM-DD")).toBe(
      "2025-02-28"
    );
    expect(math.addMonths(date, 1, TOKYO_TIMEZONE).format("YYYY-MM-DD")).toBe(
      "2025-03-01"
    );
  });
});

describe("subtractMonths", () => {
  test("subtracts months correctly", () => {
    expect(math.subtractMonths(FIXED_DATE, 2).format("YYYY-MM-DD")).toBe(
      "2024-12-15"
    );
  });

  test("handles day preservation", () => {
    // When subtracting months and the target month has fewer days, day should be adjusted
    expect(math.subtractMonths("2025-03-31", 1).format("YYYY-MM-DD")).toBe(
      "2025-02-28"
    );
  });

  test("handles leap years correctly", () => {
    expect(math.subtractMonths("2024-03-31", 1).format("YYYY-MM-DD")).toBe(
      "2024-02-29"
    );
  });
});

describe("addYears", () => {
  test("adds years correctly", () => {
    expect(math.addYears(FIXED_DATE, 2).format("YYYY-MM-DD")).toBe(
      "2027-02-15"
    );
  });

  test("handles leap year adjustments", () => {
    // Feb 29 in leap year to non-leap year should adjust to Feb 28
    expect(math.addYears(LEAP_YEAR_DATE, 1).format("YYYY-MM-DD")).toBe(
      "2025-02-28"
    );
  });

  test("handles leap year to leap year", () => {
    // Feb 29 to another leap year should preserve date
    expect(math.addYears(LEAP_YEAR_DATE, 4).format("YYYY-MM-DD")).toBe(
      "2028-02-29"
    );
  });
});

describe("subtractYears", () => {
  test("subtracts years correctly", () => {
    expect(math.subtractYears(FIXED_DATE, 2).format("YYYY-MM-DD")).toBe(
      "2023-02-15"
    );
  });

  test("handles leap year adjustments", () => {
    // Feb 29 in leap year to non-leap year should adjust to Feb 28
    expect(math.subtractYears(LEAP_YEAR_DATE, 1).format("YYYY-MM-DD")).toBe(
      "2023-02-28"
    );
  });

  test("handles leap year to leap year", () => {
    // Feb 29 to another leap year should preserve date
    expect(math.subtractYears(LEAP_YEAR_DATE, 4).format("YYYY-MM-DD")).toBe(
      "2020-02-29"
    );
  });
});

// New tests for time-based functions
describe("addHours", () => {
  test("adds hours correctly", () => {
    const date = "2025-02-15T10:00:00";
    expect(math.addHours(date, 5).format("YYYY-MM-DD HH:mm:ss")).toBe(
      "2025-02-15 15:00:00"
    );
  });

  test("handles day boundary", () => {
    const date = "2025-02-15T22:00:00";
    expect(math.addHours(date, 5).format("YYYY-MM-DD HH:mm:ss")).toBe(
      "2025-02-16 03:00:00"
    );
  });

  test("handles negative hours", () => {
    const date = "2025-02-15T10:00:00";
    expect(math.addHours(date, -12).format("YYYY-MM-DD HH:mm:ss")).toBe(
      "2025-02-14 22:00:00"
    );
  });

  test("respects timezone when crossing day boundaries", () => {
    // 10PM in NYC, already next day in Tokyo
    const date = "2025-02-15T22:00:00-05:00";
    expect(math.addHours(date, 3, NYC_TIMEZONE).format("YYYY-MM-DD")).toBe(
      "2025-02-16"
    );
    expect(math.addHours(date, 3, TOKYO_TIMEZONE).format("YYYY-MM-DD")).toBe(
      "2025-02-16"
    );
  });
});

describe("subtractHours", () => {
  test("subtracts hours correctly", () => {
    const date = "2025-02-15T10:00:00";
    expect(math.subtractHours(date, 5).format("YYYY-MM-DD HH:mm:ss")).toBe(
      "2025-02-15 05:00:00"
    );
  });

  test("handles day boundary", () => {
    const date = "2025-02-15T02:00:00";
    expect(math.subtractHours(date, 5).format("YYYY-MM-DD HH:mm:ss")).toBe(
      "2025-02-14 21:00:00"
    );
  });

  test("handles negative hours (which adds hours)", () => {
    const date = "2025-02-15T10:00:00";
    expect(math.subtractHours(date, -5).format("YYYY-MM-DD HH:mm:ss")).toBe(
      "2025-02-15 15:00:00"
    );
  });
});

describe("addMinutes", () => {
  test("adds minutes correctly", () => {
    const date = "2025-02-15T10:15:00";
    expect(math.addMinutes(date, 30).format("YYYY-MM-DD HH:mm:ss")).toBe(
      "2025-02-15 10:45:00"
    );
  });

  test("handles hour boundary", () => {
    const date = "2025-02-15T10:45:00";
    expect(math.addMinutes(date, 30).format("YYYY-MM-DD HH:mm:ss")).toBe(
      "2025-02-15 11:15:00"
    );
  });

  test("handles negative minutes", () => {
    const date = "2025-02-15T10:30:00";
    expect(math.addMinutes(date, -45).format("YYYY-MM-DD HH:mm:ss")).toBe(
      "2025-02-15 09:45:00"
    );
  });

  test("respects DST changes", () => {
    // March 13, 2022 at 1:45 AM (just before "spring forward" at 2 AM in the US)
    const dstDate = "2022-03-13T01:45:00-05:00";

    // Adding 30 minutes goes past 2am due to DST, hence the result should be 3:15.
    const result = math.addMinutes(dstDate, 30, "America/New_York");
    expect(result.format("HH:mm")).toBe("03:15");
  });
});

describe("subtractMinutes", () => {
  test("subtracts minutes correctly", () => {
    const date = "2025-02-15T10:30:00";
    expect(math.subtractMinutes(date, 15).format("YYYY-MM-DD HH:mm:ss")).toBe(
      "2025-02-15 10:15:00"
    );
  });

  test("handles hour boundary", () => {
    const date = "2025-02-15T10:00:00";
    expect(math.subtractMinutes(date, 15).format("YYYY-MM-DD HH:mm:ss")).toBe(
      "2025-02-15 09:45:00"
    );
  });

  test("handles negative minutes (which adds minutes)", () => {
    const date = "2025-02-15T10:15:00";
    expect(math.subtractMinutes(date, -30).format("YYYY-MM-DD HH:mm:ss")).toBe(
      "2025-02-15 10:45:00"
    );
  });
});

describe("addMilliseconds", () => {
  test("adds milliseconds correctly", () => {
    const date = new Date("2025-02-15T10:00:00.000Z");
    const result = math.addMilliseconds(date, 1500);
    expect(result.valueOf()).toBe(date.getTime() + 1500);
  });

  test("handles second boundary", () => {
    const date = "2025-02-15T10:00:59.800";
    const result = math.addMilliseconds(date, 300);
    expect(result.format("YYYY-MM-DD HH:mm:ss.SSS")).toMatch(
      /2025-02-15 10:01:00.10/
    );
  });

  test("handles negative milliseconds", () => {
    const date = "2025-02-15T10:00:01.000";
    const result = math.addMilliseconds(date, -1500);
    expect(result.format("YYYY-MM-DD HH:mm:ss.SSS")).toMatch(
      /2025-02-15 09:59:59.50/
    );
  });
});

describe("subtractMilliseconds", () => {
  test("subtracts milliseconds correctly", () => {
    const date = new Date("2025-02-15T10:00:00.000Z");
    const result = math.subtractMilliseconds(date, 1500);
    expect(result.valueOf()).toBe(date.getTime() - 1500);
  });

  test("handles second boundary", () => {
    const date = "2025-02-15T10:00:00.200";
    const result = math.subtractMilliseconds(date, 300);
    expect(result.format("YYYY-MM-DD HH:mm:ss.SSS")).toMatch(
      /2025-02-15 09:59:59.90/
    );
  });

  test("handles negative milliseconds (which adds milliseconds)", () => {
    const date = "2025-02-15T10:00:00.000";
    const result = math.subtractMilliseconds(date, -500);
    expect(result.format("YYYY-MM-DD HH:mm:ss.SSS")).toMatch(
      /2025-02-15 10:00:00.50/
    );
  });
});
