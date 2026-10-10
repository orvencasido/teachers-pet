import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { AssessmentItem, AssessmentInsert, AssessmentUpdate, AssessmentType } from '../../types';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AssessmentInsert, 'class_id'> | AssessmentUpdate) => Promise<unknown>;
  assessmentToEdit?: AssessmentItem | null;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  assessmentToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<AssessmentType>('quiz');
  const [totalPoints, setTotalPoints] = useState<number>(100);
  const [weightPercentage, setWeightPercentage] = useState<number>(20);
  const [assessmentDate, setAssessmentDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assessmentToEdit) {
      setTitle(assessmentToEdit.title);
      setType(assessmentToEdit.type as AssessmentType);
      setTotalPoints(assessmentToEdit.total_points);
      setWeightPercentage(assessmentToEdit.weight_percentage);
      setAssessmentDate(
        assessmentToEdit.assessment_date
          ? assessmentToEdit.assessment_date.slice(0, 10)
          : ''
      );
    } else {
      setTitle('');
      setType('quiz');
      setTotalPoints(50);
      setWeightPercentage(15);
      setAssessmentDate(new Date().toISOString().slice(0, 10));
    }
    setError(null);
  }, [assessmentToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Assessment title is required.');
      return;
    }
    if (totalPoints <= 0) {
      setError('Total points must be greater than zero.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave({
        title: title.trim(),
        type,
        total_points: Number(totalPoints),
        weight_percentage: Number(weightPercentage) || 0,
        assessment_date: assessmentDate ? new Date(assessmentDate).toISOString() : null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assessmentToEdit ? 'Edit Assessment' : 'New Assessment'}
      description="Create a quiz, exam, or performance task for grading"
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
            Assessment Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Unit 3 Test: Thermodynamics"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Category Type <span className="text-rose-400">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AssessmentType)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="quiz">Quiz</option>
              <option value="exam">Major Exam</option>
              <option value="performance_task">Performance Task</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Date Conducted
            </label>
            <input
              type="date"
              value={assessmentDate}
              onChange={(e) => setAssessmentDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Max Points (Total) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={totalPoints}
              onChange={(e) => setTotalPoints(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Weight Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={weightPercentage}
              onChange={(e) => setWeightPercentage(Number(e.target.value))}
              placeholder="e.g. 20"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>
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
            {isSubmitting ? 'Saving...' : assessmentToEdit ? 'Save Changes' : 'Create Assessment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
