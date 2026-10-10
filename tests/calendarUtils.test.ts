import { describe, it, expect } from 'vitest';
import {
  computeCalendarGrid,
  groupEventsByDate,
  filterEventsByType,
  getUpcomingEvents,
  getEventBadgeVariant,
  formatDateString,
  formatMonthYear,
} from '../src/lib/calendarUtils';
import type { CalendarEventItem } from '../src/types';

describe('calendarUtils', () => {
  describe('formatDateString and formatMonthYear', () => {
    it('formats dates into YYYY-MM-DD format with padding', () => {
      const date1 = new Date(2026, 0, 5); // Jan 5, 2026
      expect(formatDateString(date1)).toBe('2026-01-05');

      const date2 = new Date(2026, 9, 31); // Oct 31, 2026
      expect(formatDateString(date2)).toBe('2026-10-31');
    });

    it('formats month and year string properly', () => {
      const date = new Date(2026, 9, 10);
      expect(formatMonthYear(date)).toBe('October 2026');
    });
  });

  describe('computeCalendarGrid', () => {
    it('generates a grid that is a multiple of 7 cells', () => {
      // October 2026
      const oct2026 = new Date(2026, 9, 1);
      const grid = computeCalendarGrid(oct2026);

      expect(grid.length % 7).toBe(0);
      expect([35, 42]).toContain(grid.length);

      // October 1, 2026 is Thursday (getDay() = 4)
      // Leading days: Sun, Mon, Tue, Wed (4 days from Sept 27 to Sept 30)
      expect(grid[0].isCurrentMonth).toBe(false);
      expect(grid[0].dateString).toBe('2026-09-27');
      expect(grid[3].dateString).toBe('2026-09-30');

      // First day of current month
      expect(grid[4].isCurrentMonth).toBe(true);
      expect(grid[4].dateString).toBe('2026-10-01');

      // October has 31 days
      const currentMonthDays = grid.filter((d) => d.isCurrentMonth);
      expect(currentMonthDays.length).toBe(31);
    });

    it('handles February in non-leap year (e.g. 2027) and leap year (2028)', () => {
      // Feb 2027 (28 days)
      const feb2027 = new Date(2027, 1, 1);
      const grid2027 = computeCalendarGrid(feb2027);
      const feb2027Days = grid2027.filter((d) => d.isCurrentMonth);
      expect(feb2027Days.length).toBe(28);
      expect(grid2027.length % 7).toBe(0);

      // Feb 2028 (29 days - leap year)
      const feb2028 = new Date(2028, 1, 1);
      const grid2028 = computeCalendarGrid(feb2028);
      const feb2028Days = grid2028.filter((d) => d.isCurrentMonth);
      expect(feb2028Days.length).toBe(29);
      expect(grid2028.length % 7).toBe(0);
    });

    it('handles a month starting exactly on Sunday', () => {
      // August 2027 starts on Sunday (Aug 1, 2027 is Sunday)
      const aug2027 = new Date(2027, 7, 1);
      const grid = computeCalendarGrid(aug2027);
      expect(grid[0].isCurrentMonth).toBe(true);
      expect(grid[0].dateString).toBe('2027-08-01');
    });
  });

  describe('groupEventsByDate', () => {
    const mockEvents: CalendarEventItem[] = [
      {
        id: 'ev-1',
        class_id: 'cls-1',
        title: 'Morning Lecture',
        description: null,
        event_type: 'lesson',
        start_time: '2026-10-15T09:00:00Z',
        end_time: '2026-10-15T10:00:00Z',
        location: 'Room 101',
        is_all_day: false,
        created_at: '2026-10-01T00:00:00Z',
        updated_at: '2026-10-01T00:00:00Z',
      },
      {
        id: 'ev-2',
        class_id: 'cls-1',
        title: 'Afternoon Lab',
        description: null,
        event_type: 'lesson',
        start_time: '2026-10-15T14:00:00Z',
        end_time: '2026-10-15T16:00:00Z',
        location: 'Science Lab',
        is_all_day: false,
        created_at: '2026-10-01T00:00:00Z',
        updated_at: '2026-10-01T00:00:00Z',
      },
      {
        id: 'ev-3',
        class_id: 'cls-1',
        title: 'Quarterly Exam',
        description: null,
        event_type: 'exam',
        start_time: '2026-10-20T08:00:00Z',
        end_time: '2026-10-20T10:00:00Z',
        location: 'Gymnasium',
        is_all_day: false,
        created_at: '2026-10-01T00:00:00Z',
        updated_at: '2026-10-01T00:00:00Z',
      },
    ];

    it('groups events matching the YYYY-MM-DD prefix', () => {
      const map = groupEventsByDate(mockEvents);
      expect(map.size).toBe(2);

      const oct15Events = map.get('2026-10-15');
      expect(oct15Events).toBeDefined();
      expect(oct15Events!.length).toBe(2);
      expect(oct15Events![0].title).toBe('Morning Lecture');
      expect(oct15Events![1].title).toBe('Afternoon Lab');

      const oct20Events = map.get('2026-10-20');
      expect(oct20Events).toBeDefined();
      expect(oct20Events!.length).toBe(1);
      expect(oct20Events![0].title).toBe('Quarterly Exam');
    });

    it('returns empty map for empty event array', () => {
      const map = groupEventsByDate([]);
      expect(map.size).toBe(0);
    });
  });

  describe('filterEventsByType', () => {
    const mockEvents: CalendarEventItem[] = [
      {
        id: 'ev-1',
        class_id: 'cls-1',
        title: 'Lecture',
        description: null,
        event_type: 'lesson',
        start_time: '2026-10-15T09:00:00Z',
        end_time: '2026-10-15T10:00:00Z',
        location: null,
        is_all_day: false,
        created_at: '2026-10-01T00:00:00Z',
        updated_at: '2026-10-01T00:00:00Z',
      },
      {
        id: 'ev-2',
        class_id: 'cls-1',
        title: 'Midterm',
        description: null,
        event_type: 'exam',
        start_time: '2026-10-16T09:00:00Z',
        end_time: '2026-10-16T11:00:00Z',
        location: null,
        is_all_day: false,
        created_at: '2026-10-01T00:00:00Z',
        updated_at: '2026-10-01T00:00:00Z',
      },
      {
        id: 'ev-3',
        class_id: 'cls-1',
        title: 'Pop Quiz',
        description: null,
        event_type: 'quiz',
        start_time: '2026-10-17T09:00:00Z',
        end_time: '2026-10-17T09:30:00Z',
        location: null,
        is_all_day: false,
        created_at: '2026-10-01T00:00:00Z',
        updated_at: '2026-10-01T00:00:00Z',
      },
    ];

    it('returns all events when filterType is "all"', () => {
      const filtered = filterEventsByType(mockEvents, 'all');
      expect(filtered.length).toBe(3);
    });

    it('returns only matching events for specific type', () => {
      const exams = filterEventsByType(mockEvents, 'exam');
      expect(exams.length).toBe(1);
      expect(exams[0].title).toBe('Midterm');

      const quizzes = filterEventsByType(mockEvents, 'quiz');
      expect(quizzes.length).toBe(1);
      expect(quizzes[0].title).toBe('Pop Quiz');

      const holidays = filterEventsByType(mockEvents, 'holiday');
      expect(holidays.length).toBe(0);
    });
  });

  describe('getUpcomingEvents', () => {
    const mockEvents: CalendarEventItem[] = [
      {
        id: 'past-1',
        class_id: 'cls-1',
        title: 'Past Event',
        description: null,
        event_type: 'lesson',
        start_time: '2026-10-01T09:00:00Z',
        end_time: '2026-10-01T10:00:00Z',
        location: null,
        is_all_day: false,
        created_at: '2026-10-01T00:00:00Z',
        updated_at: '2026-10-01T00:00:00Z',
      },
      {
        id: 'future-2',
        class_id: 'cls-1',
        title: 'Far Future Event',
        description: null,
        event_type: 'exam',
        start_time: '2026-10-25T09:00:00Z',
        end_time: '2026-10-25T11:00:00Z',
        location: null,
        is_all_day: false,
        created_at: '2026-10-01T00:00:00Z',
        updated_at: '2026-10-01T00:00:00Z',
      },
      {
        id: 'future-1',
        class_id: 'cls-1',
        title: 'Near Future Event',
        description: null,
        event_type: 'quiz',
        start_time: '2026-10-12T09:00:00Z',
        end_time: '2026-10-12T10:00:00Z',
        location: null,
        is_all_day: false,
        created_at: '2026-10-01T00:00:00Z',
        updated_at: '2026-10-01T00:00:00Z',
      },
    ];

    it('filters out past events and sorts future events chronologically', () => {
      const fixedNow = new Date('2026-10-10T00:00:00Z');
      const upcoming = getUpcomingEvents(mockEvents, fixedNow);

      expect(upcoming.length).toBe(2);
      expect(upcoming[0].id).toBe('future-1');
      expect(upcoming[1].id).toBe('future-2');
    });

    it('respects the limit argument', () => {
      const fixedNow = new Date('2026-10-10T00:00:00Z');
      const upcoming = getUpcomingEvents(mockEvents, fixedNow, 1);
      expect(upcoming.length).toBe(1);
      expect(upcoming[0].id).toBe('future-1');
    });
  });

  describe('getEventBadgeVariant', () => {
    it('maps event types to appropriate badge variants', () => {
      expect(getEventBadgeVariant('lesson')).toBe('indigo');
      expect(getEventBadgeVariant('quiz')).toBe('amber');
      expect(getEventBadgeVariant('exam')).toBe('rose');
      expect(getEventBadgeVariant('deadline')).toBe('purple');
      expect(getEventBadgeVariant('holiday')).toBe('emerald');
      expect(getEventBadgeVariant('unknown')).toBe('zinc');
    });
  });
});
