# GitHub Copilot Prompt: Advanced Date Helper in TypeScript with Day.js + Timezone

## Goal

Create a **TypeScript module `dateHelper.ts`** using **`dayjs` with `dayjs/plugin/timezone` and `dayjs/plugin/utc`** to provide a comprehensive set of date utilities with timezone support.

Also write a **`dateHelper.test.ts`** file with **Jest tests** covering all functions.

## Requirements

### Install Packages

The helper file must use:

```bash
npm install dayjs dayjs-plugin-utc dayjs-plugin-timezone
```

And import/extend as:

```ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
```

---

## Required Functions

### 1. Basic Formatting

- `formatDate(date: string | Date, format?: string, tz?: string): string`

  - Formats the date to `YYYY-MM-DD` or provided format.
  - Applies optional timezone.

- `formatDateTime(date: string | Date, tz?: string): string`

  - Formats to `YYYY-MM-DD HH:mm:ss` in specified timezone.

- `parseDate(dateString: string, tz?: string): dayjs.Dayjs`
  - Parses date string into a `dayjs` object in optional timezone.

---

### 2. Comparison Functions

- `isSameDay(date1: string | Date, date2: string | Date, tz?: string): boolean`
- `isBefore(date1: string | Date, date2: string | Date, tz?: string): boolean`
- `isAfter(date1: string | Date, date2: string | Date, tz?: string): boolean`
- `isWeekend(date: string | Date, tz?: string): boolean`
- `isWeekday(date: string | Date, tz?: string): boolean`

---

### 3. Math Functions

- `addDays(date: string | Date, days: number, tz?: string): dayjs.Dayjs`
- `subtractDays(date: string | Date, days: number, tz?: string): dayjs.Dayjs`
- `addMonths(date: string | Date, months: number, tz?: string): dayjs.Dayjs`
- `subtractMonths(date: string | Date, months: number, tz?: string): dayjs.Dayjs`
- `addYears(date: string | Date, years: number, tz?: string): dayjs.Dayjs`
- `subtractYears(date: string | Date, years: number, tz?: string): dayjs.Dayjs`

---

### 4. Parts Extraction

- `getYear(date: string | Date, tz?: string): number`
- `getMonth(date: string | Date, tz?: string): number` // 1-12
- `getDay(date: string | Date, tz?: string): number` // 0-6 (Sun-Sat)
- `getMonthName(date: string | Date, tz?: string, locale?: string): string`
- `getDayName(date: string | Date, tz?: string, locale?: string): string`

---

### 5. Ranges

- `isBetween(date: string | Date, start: string | Date, end: string | Date, tz?: string): boolean`
- `daysBetween(date1: string | Date, date2: string | Date, tz?: string): number`

- `startOfDay(date: string | Date, tz?: string): dayjs.Dayjs`
- `endOfDay(date: string | Date, tz?: string): dayjs.Dayjs`
- `startOfWeek(date: string | Date, tz?: string, weekStart?: number): dayjs.Dayjs`
- `endOfWeek(date: string | Date, tz?: string, weekStart?: number): dayjs.Dayjs`
- `startOfMonth(date: string | Date, tz?: string): dayjs.Dayjs`
- `endOfMonth(date: string | Date, tz?: string): dayjs.Dayjs`

---

### 6. ISO/Fiscal

- `getISOWeek(date: string | Date, tz?: string): number`
- `getISOYear(date: string | Date, tz?: string): number`
- `getQuarter(date: string | Date, tz?: string): number`
- `startOfQuarter(date: string | Date, tz?: string): dayjs.Dayjs`
- `endOfQuarter(date: string | Date, tz?: string): dayjs.Dayjs`

---

### 7. Unix & UTC

- `toUnixTimestamp(date: string | Date, tz?: string): number`
- `fromUnixTimestamp(timestamp: number, tz?: string): dayjs.Dayjs`

- `toUTC(date: string | Date): dayjs.Dayjs`
- `fromUTC(date: string | Date, tz: string): dayjs.Dayjs`

---

## Function Behavior

✅ Every function must:

- Accept input as `Date` or ISO string.
- Support an optional timezone string (e.g., `"America/Los_Angeles"`).
- Return **dayjs object** or primitive type as appropriate.
- Be **pure functions** (no side effects or mutable state).

---

## Testing

In `dateHelper.test.ts`:

✅ Write **3+ tests per function**:

- Typical inputs
- Edge cases (e.g., leap years, DST, invalid timezone)
- Null/undefined safety

✅ Use **Jest** for testing.

✅ Use test coverage with `describe` blocks per function.

✅ Ensure `dayjs.tz.guess()` default fallback if `tz` param not provided.

---

## Example Usage

```ts
import { formatDate, isWeekend, addDays } from "./dateHelper";

const date = "2025-01-01";
console.log(formatDate(date, undefined, "America/New_York")); // "2025-01-01"
console.log(isWeekend(date, "America/New_York")); // false
console.log(addDays(date, 5, "America/New_York").format()); // "2025-01-06T..."
```

---

## File Structure

```
src/
  utils/
    dateHelper.ts
    dateHelper.test.ts
```

---

## Instructions

✅ Place this `.prompt.md` alongside your project.

✅ Use it at the top of `dateHelper.ts` and `dateHelper.test.ts` to guide GitHub Copilot generation.

✅ Validate function typings, output, and test assertions as you develop.
