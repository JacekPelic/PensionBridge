import type { EmploymentEntry } from '../types';

/**
 * Generate per-year salary values for an employment entry via linear interpolation.
 *
 * Returns an array of { year, salary } for each calendar year (or partial year)
 * the entry covers. Salary is linearly interpolated between startSalary and endSalary.
 */
export function interpolateYearlySalaries(
  entry: EmploymentEntry,
): { year: number; salary: number; months: number }[] {
  const start = new Date(entry.startDate);
  const end = entry.endDate ? new Date(entry.endDate) : new Date();

  const totalMonths = Math.max(
    1,
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()),
  );

  const results: { year: number; salary: number; months: number }[] = [];

  let cursor = new Date(start);
  while (cursor < end) {
    const year = cursor.getFullYear();
    const yearEnd = new Date(Math.min(
      new Date(year + 1, 0, 1).getTime(),
      end.getTime(),
    ));

    const monthsInYear = Math.max(
      1,
      (yearEnd.getFullYear() - cursor.getFullYear()) * 12 + (yearEnd.getMonth() - cursor.getMonth()),
    );

    // How far through the employment period is the midpoint of this year-slice?
    const midpointMonths = (
      (cursor.getFullYear() - start.getFullYear()) * 12 +
      (cursor.getMonth() - start.getMonth()) +
      monthsInYear / 2
    );
    const t = totalMonths > 0 ? midpointMonths / totalMonths : 0;
    const salary = Math.round(
      entry.startSalary + t * (entry.endSalary - entry.startSalary),
    );

    results.push({ year, salary, months: monthsInYear });

    cursor = yearEnd;
  }

  return results;
}

/**
 * Calculate total months for an entry.
 */
export function entryMonths(entry: EmploymentEntry): number {
  const start = new Date(entry.startDate);
  const end = entry.endDate ? new Date(entry.endDate) : new Date();
  return Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
}
