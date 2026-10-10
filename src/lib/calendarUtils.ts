import type { CalendarEventItem, CalendarEventType } from '../types';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  dateString: string;
}

export function formatDateString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export function computeCalendarGrid(currentMonth: Date): CalendarDay[] {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const days: CalendarDay[] = [];

  // Leading days from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthTotalDays - i);
    days.push({
      date: d,
      isCurrentMonth: false,
      dateString: formatDateString(d),
    });
  }

  // Days in current month
  for (let i = 1; i <= totalDays; i++) {
    const d = new Date(year, month, i);
    days.push({
      date: d,
      isCurrentMonth: true,
      dateString: formatDateString(d),
    });
  }

  // Trailing days to complete 35 or 42 grid cells (multiples of 7)
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({
      date: d,
      isCurrentMonth: false,
      dateString: formatDateString(d),
    });
  }

  return days;
}

export function groupEventsByDate(events: CalendarEventItem[]): Map<string, CalendarEventItem[]> {
  const map = new Map<string, CalendarEventItem[]>();
  events.forEach((event) => {
    const dateKey = event.start_time.slice(0, 10);
    if (!map.has(dateKey)) {
      map.set(dateKey, []);
    }
    map.get(dateKey)!.push(event);
  });
  return map;
}

export function filterEventsByType(
  events: CalendarEventItem[],
  filterType: CalendarEventType | 'all'
): CalendarEventItem[] {
  if (filterType === 'all') return events;
  return events.filter((e) => e.event_type === filterType);
}

export function getUpcomingEvents(
  events: CalendarEventItem[],
  now: Date = new Date(),
  limit: number = 10
): CalendarEventItem[] {
  const nowIso = now.toISOString();
  return events
    .filter((e) => (e.end_time && e.end_time >= nowIso) || e.start_time >= nowIso)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .slice(0, limit);
}

export function getEventBadgeVariant(type: string): 'indigo' | 'amber' | 'rose' | 'purple' | 'emerald' | 'zinc' {
  switch (type) {
    case 'lesson':
      return 'indigo';
    case 'quiz':
      return 'amber';
    case 'exam':
      return 'rose';
    case 'deadline':
      return 'purple';
    case 'holiday':
      return 'emerald';
    default:
      return 'zinc';
  }
}
