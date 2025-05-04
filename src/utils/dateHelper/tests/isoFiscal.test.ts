/**
 * Tests for ISO/fiscal calendar functions
 */
import * as isoFiscal from "../isoFiscal";

// Constants for testing
const NYC_TIMEZONE = "America/New_York";
const TOKYO_TIMEZONE = "Asia/Tokyo";
const FIXED_DATE = "2025-02-15"; // A Saturday

describe("getISOWeek", () => {
  test("gets correct ISO week number", () => {
    // Feb 15, 2025 falls in ISO week 7
    expect(isoFiscal.getISOWeek(FIXED_DATE)).toBe(7);
  });

  test("handles year boundaries", () => {
    // ISO weeks can belong to adjacent years
    expect(isoFiscal.getISOWeek("2025-01-01")).toBe(1);
    expect(isoFiscal.getISOWeek("2024-12-31")).toBe(53); // 2024 has 53 ISO weeks
  });

  test("respects timezone", () => {
    // Week boundary case - week might be different in different timezones
    const saturdayEveningNYC = "2025-02-15T23:30:00-05:00"; // Sat week 7 in NYC, Sun week 8 in Tokyo
    expect(isoFiscal.getISOWeek(saturdayEveningNYC, NYC_TIMEZONE)).toBe(7);
    expect(isoFiscal.getISOWeek(saturdayEveningNYC, TOKYO_TIMEZONE)).toBe(8);
  });
});

describe("getISOYear", () => {
  test("gets correct ISO year", () => {
    expect(isoFiscal.getISOYear(FIXED_DATE)).toBe(2025);
  });

  test("handles year boundaries", () => {
    // ISO year can differ from calendar year at boundaries
    // Last days of December can belong to week 1 of next year
    // First days of January can belong to last week of previous year
    expect(isoFiscal.getISOYear("2025-01-01")).toBe(2025);
    expect(isoFiscal.getISOYear("2024-12-31")).toBe(2024);
  });
});

describe("getQuarter", () => {
  test("gets correct quarter", () => {
    // February is in Q1 (1)
    expect(isoFiscal.getQuarter(FIXED_DATE)).toBe(1);
  });

  test("handles all quarters", () => {
    expect(isoFiscal.getQuarter("2025-01-15")).toBe(1);
    expect(isoFiscal.getQuarter("2025-04-15")).toBe(2);
    expect(isoFiscal.getQuarter("2025-07-15")).toBe(3);
    expect(isoFiscal.getQuarter("2025-10-15")).toBe(4);
  });

  test("respects timezone", () => {
    // Quarter boundary case
    const lastDayQ1NYC = "2025-03-31T23:30:00-04:00"; // Q1 in NYC, Q2 in Tokyo
    expect(isoFiscal.getQuarter(lastDayQ1NYC, NYC_TIMEZONE)).toBe(1);
    expect(isoFiscal.getQuarter(lastDayQ1NYC, TOKYO_TIMEZONE)).toBe(2);
  });
});

describe("startOfQuarter", () => {
  test("gets correct start of quarter", () => {
    // Feb 15 is in Q1, which starts on Jan 1
    expect(isoFiscal.startOfQuarter(FIXED_DATE).format("YYYY-MM-DD")).toBe(
      "2025-01-01"
    );
  });

  test("handles all quarters", () => {
    expect(isoFiscal.startOfQuarter("2025-01-15").format("YYYY-MM-DD")).toBe(
      "2025-01-01"
    );
    expect(isoFiscal.startOfQuarter("2025-04-15").format("YYYY-MM-DD")).toBe(
      "2025-04-01"
    );
    expect(isoFiscal.startOfQuarter("2025-07-15").format("YYYY-MM-DD")).toBe(
      "2025-07-01"
    );
    expect(isoFiscal.startOfQuarter("2025-10-15").format("YYYY-MM-DD")).toBe(
      "2025-10-01"
    );
  });

  test("returns midnight on first day", () => {
    const result = isoFiscal.startOfQuarter(FIXED_DATE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-01-01 00:00:00");
  });
});

describe("endOfQuarter", () => {
  test("gets correct end of quarter", () => {
    // Feb 15 is in Q1, which ends on Mar 31
    expect(isoFiscal.endOfQuarter(FIXED_DATE).format("YYYY-MM-DD")).toBe(
      "2025-03-31"
    );
  });

  test("handles all quarters", () => {
    expect(isoFiscal.endOfQuarter("2025-01-15").format("YYYY-MM-DD")).toBe(
      "2025-03-31"
    );
    expect(isoFiscal.endOfQuarter("2025-04-15").format("YYYY-MM-DD")).toBe(
      "2025-06-30"
    );
    expect(isoFiscal.endOfQuarter("2025-07-15").format("YYYY-MM-DD")).toBe(
      "2025-09-30"
    );
    expect(isoFiscal.endOfQuarter("2025-10-15").format("YYYY-MM-DD")).toBe(
      "2025-12-31"
    );
  });

  test("returns end of day on last day", () => {
    const result = isoFiscal.endOfQuarter(FIXED_DATE);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).toBe("2025-03-31 23:59:59");
  });
});
