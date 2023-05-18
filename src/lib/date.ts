// export const WEEK_DAYS: (string | WeekEnum)[] = Object.values(WeekEnum).slice(0, 7);
export enum WeekEnum {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4, // 2023/5/11 - Thursday - getDay() = 4
  Friday = 5,
  Saturday = 6,
}

/**
 * Note: Initialized as global constant in this module scope to compute it once at build time
 */
export const WEEK_DAYS: (string | WeekEnum)[] = Object.values(WeekEnum).slice(
  0,
  7
);

export type DateComponents = {
  year: number;
  month: number;
  date: number;
};

export function asDateComponents(date: Date): DateComponents {
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
  };
}

export function asHTMLInputDateValue(date: Date): string {
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  const dateProps = asDateComponents(date);
  const arrDateProps: string[] = [
    dateProps.year.toString(),
    (dateProps.month + 1).toString().padStart(2, "0"), // (0 - 11) + 1. 1->Jan, 12->Dec.
    dateProps.date.toString().padStart(2, "0"),
  ];
  return arrDateProps.join("-");
}

// export function asDayOfWeek(weekDate: number): { weekDay: string; weekDayEnum: WeekEnum; } {
export function asDayOfWeek(date: Date): {
  weekDay: string;
  weekDayEnum: WeekEnum;
} {
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  const weekDate = date.getDay();
  const normalizedWeekDate = weekDate % 7;
  const weekDay = WeekEnum[normalizedWeekDate];
  const weekDayEnum = WEEK_DAYS[normalizedWeekDate] as WeekEnum;
  return { weekDay, weekDayEnum };
}
