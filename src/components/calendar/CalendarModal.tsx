import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { CalendarEventItem, CalendarEventInsert, CalendarEventUpdate, CalendarEventType } from '../../types';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CalendarEventInsert | CalendarEventUpdate) => Promise<unknown>;
  eventToEdit?: CalendarEventItem | null;
  defaultDate?: Date;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  onSave,
  eventToEdit,
  defaultDate,
}) => {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<CalendarEventType>('lesson');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setEventType(eventToEdit.event_type as CalendarEventType);
      setStartTime(eventToEdit.start_time.slice(0, 16));
      setEndTime(eventToEdit.end_time.slice(0, 16));
      setLocation(eventToEdit.location ?? '');
      setDescription(eventToEdit.description ?? '');
      setIsAllDay(eventToEdit.is_all_day);
    } else {
      const now = defaultDate || new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const startStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T09:00`;
      const endStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T10:00`;

      setTitle('');
      setEventType('lesson');
      setStartTime(startStr);
      setEndTime(endStr);
      setLocation('');
      setDescription('');
      setIsAllDay(false);
    }
    setError(null);
  }, [eventToEdit, defaultDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime || !endTime) {
      setError('Title, start time, and end time are required.');
      return;
    }

    if (new Date(endTime) < new Date(startTime)) {
      setError('End time cannot be earlier than start time.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave({
        title: title.trim(),
        event_type: eventType,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        location: location.trim() || null,
        description: description.trim() || null,
        is_all_day: isAllDay,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save calendar event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Edit Schedule Event' : 'Schedule New Event'}
      description="Create a lesson, quiz, exam, meeting, or assignment deadline"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Event Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Physics Chapter 3 Quiz"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Event Type <span className="text-rose-400">*</span>
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as CalendarEventType)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="lesson">Lesson / Lecture</option>
              <option value="quiz">Quiz</option>
              <option value="exam">Major Exam</option>
              <option value="deadline">Assignment Deadline</option>
              <option value="meeting">Faculty / Parent Meeting</option>
              <option value="holiday">Holiday / School Break</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Location / Room
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Lab 2 / Zoom"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Start Time <span className="text-rose-400">*</span>
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              End Time <span className="text-rose-400">*</span>
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isAllDay"
            checked={isAllDay}
            onChange={(e) => setIsAllDay(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isAllDay" className="text-xs text-zinc-300 cursor-pointer">
            All-day event
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Description / Instructions
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Add agendas, guidelines, or materials students must bring..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:bg-indigo-900 transition shadow-sm"
          >
            {isSubmitting ? 'Saving...' : eventToEdit ? 'Save Changes' : 'Schedule Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
