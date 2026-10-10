import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Mail, Phone, Hash, Calendar, FileText } from 'lucide-react';
import type { StudentItem } from '../../types';

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentItem | null;
  onEdit: (student: StudentItem) => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  isOpen,
  onClose,
  student,
  onEdit,
}) => {
  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Profile"
      description="Detailed records and contact info"
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Header summary */}
        <div className="flex items-center gap-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
          <div className="h-14 w-14 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-xl font-bold">
            {student.first_name[0]}
            {student.last_name[0]}
          </div>
          <div>
            <h4 className="text-lg font-bold text-zinc-100">
              {student.first_name} {student.last_name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-zinc-400">
                {student.student_id_number || 'No ID set'}
              </span>
              {student.gender && <Badge variant="zinc">{student.gender}</Badge>}
            </div>
          </div>
        </div>

        {/* Detailed fields */}
        <div className="grid grid-cols-1 gap-3.5 text-sm">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950/40 border border-zinc-800/60">
            <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-xs text-zinc-400 block">Email Address</span>
              <span className="text-zinc-200 truncate block">
                {student.email || 'None provided'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950/40 border border-zinc-800/60">
            <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-xs text-zinc-400 block">Guardian Phone</span>
              <span className="text-zinc-200">{student.contact_number || 'None provided'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950/40 border border-zinc-800/60">
            <Hash className="h-4 w-4 text-zinc-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-xs text-zinc-400 block">Student ID Number</span>
              <span className="text-zinc-200 font-mono">
                {student.student_id_number || 'None'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950/40 border border-zinc-800/60">
            <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-xs text-zinc-400 block">Enrolled Date</span>
              <span className="text-zinc-200">
                {new Date(student.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950/40 border border-zinc-800/60 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <FileText className="h-4 w-4 text-zinc-400" />
              <span>Teacher Observations & Notes</span>
            </div>
            <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {student.notes || 'No teacher notes recorded yet.'}
            </p>
          </div>
        </div>

        {/* Modal actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(student);
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition shadow-sm"
          >
            Edit Record
          </button>
        </div>
      </div>
    </Modal>
  );
};
