import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type {
  LessonPlanItem,
  LessonPlanInsert,
  LessonPlanUpdate,
  LessonPlanStatus,
  ClassItem,
} from '../../types';

interface LessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<LessonPlanInsert, 'class_id'> | LessonPlanUpdate) => Promise<unknown>;
  planToEdit?: LessonPlanItem | null;
  currentClass: ClassItem | null;
}

export const LessonPlanModal: React.FC<LessonPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  planToEdit,
  currentClass,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [unit, setUnit] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [status, setStatus] = useState<LessonPlanStatus>('draft');
  const [objectives, setObjectives] = useState('');
  const [materials, setMaterials] = useState('');
  const [procedure, setProcedure] = useState('');
  const [assessment, setAssessment] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (planToEdit) {
      setTitle(planToEdit.title);
      setSubject(planToEdit.subject);
      setGradeLevel(planToEdit.grade_level);
      setUnit(planToEdit.unit ?? '');
      setTargetDate(planToEdit.target_date ? planToEdit.target_date.slice(0, 10) : '');
      setDurationMinutes(planToEdit.duration_minutes);
      setStatus(planToEdit.status as LessonPlanStatus);
      setObjectives(planToEdit.objectives ?? '');
      setMaterials(planToEdit.materials ?? '');
      setProcedure(planToEdit.procedure ?? '');
      setAssessment(planToEdit.assessment ?? '');
      setNotes(planToEdit.notes ?? '');
    } else {
      setTitle('');
      setSubject(currentClass?.subject || 'Physics');
      setGradeLevel(currentClass?.grade_level || '10');
      setUnit('');
      setTargetDate(new Date().toISOString().slice(0, 10));
      setDurationMinutes(60);
      setStatus('draft');
      setObjectives('');
      setMaterials('');
      setProcedure('');
      setAssessment('');
      setNotes('');
    }
    setError(null);
  }, [planToEdit, currentClass, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !gradeLevel.trim()) {
      setError('Title, subject, and grade level are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave({
        title: title.trim(),
        subject: subject.trim(),
        grade_level: gradeLevel.trim(),
        unit: unit.trim() || null,
        target_date: targetDate || null,
        duration_minutes: Number(durationMinutes) || 60,
        status,
        objectives: objectives.trim() || null,
        materials: materials.trim() || null,
        procedure: procedure.trim() || null,
        assessment: assessment.trim() || null,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lesson plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={planToEdit ? 'Edit Lesson Plan' : 'Create Lesson Plan'}
      description="Design a structured curriculum session plan"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Lesson Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Uniform Acceleration & Velocity-Time Graphs"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Subject <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Grade Level <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Unit / Chapter
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. Unit 2: Kinematics"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Target Teaching Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Duration (Minutes)
            </label>
            <input
              type="number"
              min="15"
              step="5"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Plan Status <span className="text-rose-400">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LessonPlanStatus)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="draft">Draft</option>
              <option value="ready">Ready to Teach</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Learning Objectives
          </label>
          <textarea
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            rows={2}
            placeholder="What will students be able to understand or perform by the end of this session?"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Required Materials & Equipment
          </label>
          <textarea
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            rows={2}
            placeholder="Textbooks, lab kits, projector, worksheets..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Lesson Procedure / Step-by-Step Activities
          </label>
          <textarea
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            rows={3}
            placeholder="1. Bell ringer / Hook (10 mins)&#10;2. Direct instruction (20 mins)&#10;3. Guided group practice (20 mins)&#10;4. Exit ticket reflection (10 mins)"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Assessment & Evaluation
            </label>
            <textarea
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              rows={2}
              placeholder="Formative quiz, exit ticket, oral recitation rubrics..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Reflections & Follow-up Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Differentiated adaptations, homework assignment notes..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80 sticky bottom-0 bg-zinc-900 py-2">
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
            {isSubmitting ? 'Saving...' : planToEdit ? 'Save Changes' : 'Create Lesson Plan'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
