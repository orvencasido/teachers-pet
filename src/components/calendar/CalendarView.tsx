import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  Trash2,
  Edit2,
} from 'lucide-react';
import { StateView } from '../common/StateView';
import { Badge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { CalendarModal } from './CalendarModal';
import {
  computeCalendarGrid,
  groupEventsByDate,
  formatMonthYear,
  getEventBadgeVariant,
  formatDateString,
} from '../../lib/calendarUtils';
import type {
  CalendarEventItem,
  CalendarEventInsert,
  CalendarEventUpdate,
  CalendarEventType,
  DataState,
  ClassItem,
} from '../../types';

interface CalendarViewProps {
  filteredEvents: CalendarEventItem[];
  upcomingEvents: CalendarEventItem[];
  status: DataState;
  error: string | null;
  currentMonth: Date;
  filterType: CalendarEventType | 'all';
  setFilterType: (t: CalendarEventType | 'all') => void;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onToday: () => void;
  onAddEvent: (data: CalendarEventInsert) => Promise<CalendarEventItem>;
  onEditEvent: (id: string, data: CalendarEventUpdate) => Promise<CalendarEventItem>;
  onRemoveEvent: (id: string) => Promise<void>;
  onRetry: () => void;
  currentClass: ClassItem | null;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  filteredEvents,
  upcomingEvents,
  status,
  error,
  currentMonth,
  filterType,
  setFilterType,
  onNextMonth,
  onPrevMonth,
  onToday,
  onAddEvent,
  onEditEvent,
  onRemoveEvent,
  onRetry,
  currentClass,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEventItem | null>(null);
  const [selectedDayDate, setSelectedDayDate] = useState<Date>(new Date());
  const [eventToDelete, setEventToDelete] = useState<CalendarEventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const monthYearLabel = useMemo(() => {
    return formatMonthYear(currentMonth);
  }, [currentMonth]);

  // Days in month calculation
  const calendarDays = useMemo(() => {
    return computeCalendarGrid(currentMonth);
  }, [currentMonth]);

  // Map events to date strings (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    return groupEventsByDate(filteredEvents);
  }, [filteredEvents]);

  const handleOpenAdd = (date?: Date) => {
    setEventToEdit(null);
    if (date) setSelectedDayDate(date);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: CalendarEventItem) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  const handleSave = async (data: CalendarEventInsert | CalendarEventUpdate) => {
    if (eventToEdit) {
      await onEditEvent(eventToEdit.id, data as CalendarEventUpdate);
    } else {
      await onAddEvent(data as CalendarEventInsert);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await onRemoveEvent(eventToDelete.id);
      setEventToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const todayStr = useMemo(() => {
    return formatDateString(new Date());
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Class Calendar</h2>
            <Badge variant="indigo">{filteredEvents.length} Events</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {currentClass
              ? `${currentClass.name} • Lectures, quizzes, exams, and milestones`
              : 'Class schedule and timeline events'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Navigation Controls */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={onPrevMonth}
              title="Previous month"
              className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-zinc-200 select-none min-w-[120px] text-center">
              {monthYearLabel}
            </span>
            <button
              type="button"
              onClick={onNextMonth}
              title="Next month"
              className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onToday}
              className="ml-1 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded transition"
            >
              Today
            </button>
          </div>

          {/* Add Event Button */}
          <button
            type="button"
            onClick={() => handleOpenAdd(new Date())}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-500 transition shadow-sm whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs">
        <span className="text-zinc-500 mr-1 hidden sm:inline">Filter:</span>
        {(
          [
            ['all', 'All Events'],
            ['lesson', 'Lessons'],
            ['quiz', 'Quizzes'],
            ['exam', 'Exams'],
            ['deadline', 'Deadlines'],
            ['meeting', 'Meetings'],
            ['holiday', 'Holidays'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilterType(key)}
            className={`px-2.5 py-1 rounded-full font-medium transition whitespace-nowrap ${
              filterType === key
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main Grid: Calendar Grid (2/3) + Upcoming Agenda (1/3) */}
      <StateView
        status={status}
        error={error}
        onRetry={onRetry}
        emptyTitle="No Scheduled Events"
        emptyMessage="There are currently no events on the calendar. Schedule upcoming lectures or assignment deadlines."
        emptyActionLabel="Create Schedule Event"
        onEmptyAction={() => handleOpenAdd(new Date())}
        loadingSkeleton={
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 h-[420px] bg-zinc-900 rounded-xl border border-zinc-800" />
            <div className="h-[420px] bg-zinc-900 rounded-xl border border-zinc-800" />
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Month Grid */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-800/80 bg-zinc-900 overflow-hidden shadow-sm flex flex-col">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-950/60 text-center py-2 text-xs font-semibold text-zinc-400">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar day cells */}
            <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-zinc-800/40 bg-zinc-900">
              {calendarDays.map((day) => {
                const dayEvents = eventsByDate.get(day.dateString) || [];
                const isToday = day.dateString === todayStr;

                return (
                  <div
                    key={day.dateString}
                    className={`min-h-[85px] sm:min-h-[105px] p-1.5 flex flex-col transition hover:bg-zinc-800/30 group ${
                      !day.isCurrentMonth ? 'bg-zinc-950/30 text-zinc-600' : 'text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-medium rounded-full h-5 w-5 flex items-center justify-center ${
                          isToday
                            ? 'bg-indigo-600 text-white font-bold'
                            : day.isCurrentMonth
                            ? 'text-zinc-200'
                            : 'text-zinc-600'
                        }`}
                      >
                        {day.date.getDate()}
                      </span>

                      {/* Quick Add on hover */}
                      <button
                        type="button"
                        onClick={() => handleOpenAdd(day.date)}
                        title={`Add event on ${day.dateString}`}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Day's Event Pills */}
                    <div className="mt-1 space-y-1 overflow-y-auto max-h-[70px] scrollbar-none">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          onClick={() => handleOpenEdit(event)}
                          title={`${event.title} (${event.event_type})`}
                          className="text-[10px] sm:text-xs truncate px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 cursor-pointer flex items-center gap-1 transition"
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                              event.event_type === 'exam'
                                ? 'bg-rose-500'
                                : event.event_type === 'quiz'
                                ? 'bg-amber-500'
                                : event.event_type === 'lesson'
                                ? 'bg-indigo-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span className="truncate font-medium">{event.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[10px] text-zinc-500 font-mono block pl-1">
                          +{dayEvents.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Agenda Sidebar */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900 p-5 shadow-sm space-y-4 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="font-semibold text-zinc-100 text-sm flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-indigo-400" />
                Upcoming Agenda
              </h3>
              <span className="text-xs text-zinc-400 font-mono">Next 10</span>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                No upcoming events scheduled in the near future.
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
                {upcomingEvents.map((event) => {
                  const startDate = new Date(event.start_time);
                  return (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-zinc-200 leading-snug">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(event)}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEventToDelete(event)}
                            className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={getEventBadgeVariant(event.event_type) as 'indigo'}
                          size="sm"
                        >
                          {event.event_type}
                        </Badge>

                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <Clock className="h-3 w-3 text-zinc-500" />
                          <span>
                            {startDate.toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            •{' '}
                            {event.is_all_day
                              ? 'All day'
                              : startDate.toLocaleTimeString(undefined, {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                          </span>
                        </div>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <MapPin className="h-3 w-3 text-zinc-500" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      {event.description && (
                        <p className="text-xs text-zinc-400 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </StateView>

      {/* Modals */}
      <CalendarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        eventToEdit={eventToEdit}
        defaultDate={selectedDayDate}
      />

      <ConfirmDialog
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        message={`Are you sure you want to delete "${eventToDelete?.title}" from the calendar?`}
        confirmLabel="Delete Event"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
