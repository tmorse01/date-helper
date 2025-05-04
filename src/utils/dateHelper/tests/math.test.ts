/**
 * Tests for date math functions
 */
import * as math from "../math";

// Constants for testing
const FIXED_DATE = "2025-02-15"; // A Saturday
const LEAP_YEAR_DATE = "2024-02-29"; // Leap year date

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
