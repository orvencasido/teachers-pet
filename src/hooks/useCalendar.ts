import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  CalendarEventItem,
  CalendarEventInsert,
  CalendarEventUpdate,
  CalendarEventType,
  DataState,
} from '../types';
import * as api from '../lib/api';

export function useCalendar(classId: string | null) {
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [status, setStatus] = useState<DataState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [filterType, setFilterType] = useState<CalendarEventType | 'all'>('all');

  const fetchEvents = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await api.getCalendarEvents(classId);
      setEvents(data);
      setStatus(data.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch calendar events';
      setError(message);
      setStatus('error');
    }
  }, [classId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = useCallback(
    async (eventData: CalendarEventInsert) => {
      try {
        const payload: CalendarEventInsert = {
          ...eventData,
          class_id: eventData.class_id !== undefined ? eventData.class_id : classId,
        };
        const created = await api.createCalendarEvent(payload);
        setEvents((prev) => [...prev, created].sort((a, b) => a.start_time.localeCompare(b.start_time)));
        setStatus('idle');
        return created;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create event';
        throw new Error(message);
      }
    },
    [classId]
  );

  const editEvent = useCallback(
    async (id: string, updates: CalendarEventUpdate) => {
      try {
        const updated = await api.updateCalendarEvent(id, updates);
        setEvents((prev) =>
          prev
            .map((e) => (e.id === id ? updated : e))
            .sort((a, b) => a.start_time.localeCompare(b.start_time))
        );
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update event';
        throw new Error(message);
      }
    },
    []
  );

  const removeEvent = useCallback(
    async (id: string) => {
      try {
        await api.deleteCalendarEvent(id);
        setEvents((prev) => {
          const remaining = prev.filter((e) => e.id !== id);
          if (remaining.length === 0) {
            setStatus('empty');
          }
          return remaining;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete event';
        throw new Error(message);
      }
    },
    []
  );

  const nextMonth = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return events;
    return events.filter((e) => e.event_type === filterType);
  }, [events, filterType]);

  const upcomingEvents = useMemo(() => {
    const now = new Date().toISOString();
    return filteredEvents
      .filter((e) => e.end_time >= now || e.start_time >= now)
      .slice(0, 10);
  }, [filteredEvents]);

  return {
    events,
    filteredEvents,
    upcomingEvents,
    status,
    error,
    currentMonth,
    setCurrentMonth,
    filterType,
    setFilterType,
    nextMonth,
    prevMonth,
    goToToday,
    addEvent,
    editEvent,
    removeEvent,
    retry: fetchEvents,
  };
}
