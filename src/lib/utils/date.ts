import {
  format,
  parseISO,
  isToday,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";

export function formatEventDate(iso: string, allDay: boolean): string {
  const date = parseISO(iso);
  return allDay ? format(date, "MMM d, yyyy") : format(date, "MMM d, yyyy · HH:mm");
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), "HH:mm");
}

export function getCalendarDays(month: Date) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export { isToday, isSameMonth, format, parseISO };
