import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { ClassItem, ClassInsert, ClassUpdate } from '../../types';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClassInsert | ClassUpdate) => Promise<unknown>;
  classToEdit?: ClassItem | null;
}

export const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  onClose,
  onSave,
  classToEdit,
}) => {
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  const [schoolYear, setSchoolYear] = useState('2025-2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (classToEdit) {
      setName(classToEdit.name);
      setGradeLevel(classToEdit.grade_level);
      setSection(classToEdit.section);
      setSubject(classToEdit.subject);
      setSchoolYear(classToEdit.school_year);
    } else {
      setName('');
      setGradeLevel('');
      setSection('');
      setSubject('');
      setSchoolYear('2025-2026');
    }
    setError(null);
  }, [classToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !gradeLevel.trim() || !section.trim() || !subject.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        grade_level: gradeLevel.trim(),
        section: section.trim(),
        subject: subject.trim(),
        school_year: schoolYear.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save class');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={classToEdit ? 'Edit Class & Section' : 'Create New Class'}
      description="Define the grade level, section, and subject"
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
            Class Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grade 10 - Newton (Physics)"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Grade Level <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              placeholder="e.g. 10"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Section <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g. Newton"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Subject <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Physics"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              School Year <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              placeholder="e.g. 2025-2026"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
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
            {isSubmitting ? 'Saving...' : classToEdit ? 'Save Changes' : 'Create Class'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
