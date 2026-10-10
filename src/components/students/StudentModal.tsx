import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { StudentItem, StudentInsert, StudentUpdate } from '../../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<StudentInsert, 'class_id'> | StudentUpdate) => Promise<unknown>;
  studentToEdit?: StudentItem | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentIdNumber, setStudentIdNumber] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studentToEdit) {
      setFirstName(studentToEdit.first_name);
      setLastName(studentToEdit.last_name);
      setStudentIdNumber(studentToEdit.student_id_number ?? '');
      setGender(studentToEdit.gender ?? 'Male');
      setEmail(studentToEdit.email ?? '');
      setContactNumber(studentToEdit.contact_number ?? '');
      setNotes(studentToEdit.notes ?? '');
    } else {
      setFirstName('');
      setLastName('');
      setStudentIdNumber('');
      setGender('Male');
      setEmail('');
      setContactNumber('');
      setNotes('');
    }
    setError(null);
  }, [studentToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        student_id_number: studentIdNumber.trim() || null,
        gender: gender || null,
        email: email.trim() || null,
        contact_number: contactNumber.trim() || null,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save student profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={studentToEdit ? 'Edit Student Record' : 'Enroll New Student'}
      description="Add student personal details and guardian contact information"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              First Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Last Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Morgan"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Student ID Number
            </label>
            <input
              type="text"
              value={studentIdNumber}
              onChange={(e) => setStudentIdNumber(e.target.value)}
              placeholder="e.g. STU-10-001"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex.m@school.edu"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Contact / Guardian Phone
            </label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="e.g. +1-555-0101"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Teacher Notes & Observations
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Academic strengths, learning styles, IEP accommodations..."
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
            {isSubmitting ? 'Saving...' : studentToEdit ? 'Save Changes' : 'Enroll Student'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
