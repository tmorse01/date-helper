/**
 * Tests for date parts extraction functions
 */
import * as parts from "../parts";

// Constants for testing
const NYC_TIMEZONE = "America/New_York";
const TOKYO_TIMEZONE = "Asia/Tokyo";
const LONDON_TIMEZONE = "Europe/London";
const FIXED_DATE = "2025-02-15"; // A Saturday

describe("getYear", () => {
  test("extracts year correctly", () => {
    expect(parts.getYear(FIXED_DATE)).toBe(2025);
  });

  test("handles Date object", () => {
    expect(parts.getYear(new Date("2025-02-15"))).toBe(2025);
  });

  test("respects timezone", () => {
    // Date near year boundary where it's different year in different timezones
    const newYearsEveNYC = "2024-12-31T23:30:00-05:00"; // 11:30PM Dec 31 in NYC, but Jan 1 in London
    expect(parts.getYear(newYearsEveNYC, NYC_TIMEZONE)).toBe(2024);
    expect(parts.getYear(newYearsEveNYC, LONDON_TIMEZONE)).toBe(2025);
  });
});

describe("getMonth", () => {
  test("extracts month correctly (1-indexed)", () => {
    // Month should be 1-12, not 0-11
    expect(parts.getMonth(FIXED_DATE)).toBe(2);
  });

  test("handles Date object", () => {
    expect(parts.getMonth(new Date("2025-02-15"))).toBe(2);
  });

  test("respects timezone", () => {
    // Date near month boundary where it's different month in different timezones
    const lastDayJanNYC = "2025-01-31T23:30:00-05:00"; // 11:30PM Jan 31 in NYC, but Feb 1 in London
    expect(parts.getMonth(lastDayJanNYC, NYC_TIMEZONE)).toBe(1);
    expect(parts.getMonth(lastDayJanNYC, LONDON_TIMEZONE)).toBe(2);
  });
});

describe("getDay", () => {
  test("extracts day of week correctly (0-indexed, Sunday=0)", () => {
    // Feb 15, 2025 is a Saturday (day 6)
    expect(parts.getDay(FIXED_DATE)).toBe(6);
  });

  test("handles Sunday as day 0", () => {
    // Feb 16, 2025 is a Sunday
    expect(parts.getDay("2025-02-16")).toBe(0);
  });

  test("respects timezone", () => {
    // Saturday evening in NYC is already Sunday in Tokyo
    const saturdayEveningNYC = "2025-02-15T23:30:00-05:00";
    expect(parts.getDay(saturdayEveningNYC, NYC_TIMEZONE)).toBe(6); // Saturday
    expect(parts.getDay(saturdayEveningNYC, TOKYO_TIMEZONE)).toBe(0); // Sunday
  });
});

describe("getMonthName", () => {
  test("gets correct month name", () => {
    expect(parts.getMonthName(FIXED_DATE)).toBe("February");
  });

  test("handles locale", () => {
    expect(parts.getMonthName(FIXED_DATE, undefined, "es")).toBe("febrero");
    expect(parts.getMonthName(FIXED_DATE, undefined, "fr")).toBe("février");
  });

  test("respects timezone", () => {
    const lastDayJanNYC = "2025-01-31T23:30:00-05:00"; // 11:30PM Jan 31 in NYC, but Feb 1 in London
    expect(parts.getMonthName(lastDayJanNYC, NYC_TIMEZONE)).toBe("January");
    expect(parts.getMonthName(lastDayJanNYC, LONDON_TIMEZONE)).toBe("February");
  });
});

describe("getDayName", () => {
  test("gets correct day name", () => {
    // Feb 15, 2025 is a Saturday
    expect(parts.getDayName(FIXED_DATE)).toBe("Saturday");
  });

  test("handles locale", () => {
    expect(parts.getDayName(FIXED_DATE, undefined, "es")).toBe("sábado");
    expect(parts.getDayName(FIXED_DATE, undefined, "fr")).toBe("samedi");
  });

  test("respects timezone", () => {
    const saturdayEveningNYC = "2025-02-15T23:30:00-05:00"; // Sat in NYC, Sun in Tokyo
    expect(parts.getDayName(saturdayEveningNYC, NYC_TIMEZONE)).toBe("Saturday");
    expect(parts.getDayName(saturdayEveningNYC, TOKYO_TIMEZONE)).toBe("Sunday");
  });
});
