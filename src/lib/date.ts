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
const WEEK_DAYS = Object.values(WeekEnum);

export type DateComponents = {
  year: number;
  month: number;
  date: number;
};

export function asDateComponents(date: Date): DateComponents {
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
  }
}

export function asHTMLInputDateValue(date: Date): string {
  const dateProps = asDateComponents(date);
  const arrDateProps: string[] = [
    dateProps.year.toString(),
    dateProps.month.toString().padStart(2, '0'),
    dateProps.date.toString().padStart(2, '0')
  ];
  return arrDateProps.join("-");
}

export function asDayOfWeek(weekDate: number): { weekDay: string; weekDayEnum: WeekEnum; } {
  const normalizedWeekDate = weekDate % 7;
  const weekDay = WeekEnum[normalizedWeekDate];
  const weekDayEnum = WEEK_DAYS[normalizedWeekDate] as WeekEnum
  return { weekDay, weekDayEnum };
}
