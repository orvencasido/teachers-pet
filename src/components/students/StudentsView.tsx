import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Users,
} from 'lucide-react';
import { StateView } from '../common/StateView';
import { Badge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { StudentModal } from './StudentModal';
import { StudentDetailsModal } from './StudentDetailsModal';
import type { StudentItem, StudentInsert, StudentUpdate, DataState, ClassItem } from '../../types';

interface StudentsViewProps {
  students: StudentItem[];
  filteredStudents: StudentItem[];
  status: DataState;
  error: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddStudent: (data: Omit<StudentInsert, 'class_id'>) => Promise<StudentItem>;
  onEditStudent: (id: string, data: StudentUpdate) => Promise<StudentItem>;
  onRemoveStudent: (id: string) => Promise<void>;
  onRetry: () => void;
  currentClass: ClassItem | null;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  filteredStudents,
  status,
  error,
  searchQuery,
  onSearchChange,
  onAddStudent,
  onEditStudent,
  onRemoveStudent,
  onRetry,
  currentClass,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentItem | null>(null);
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState<StudentItem | null>(null);

  const [studentToDelete, setStudentToDelete] = useState<StudentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: StudentItem) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (data: Omit<StudentInsert, 'class_id'> | StudentUpdate) => {
    if (studentToEdit) {
      await onEditStudent(studentToEdit.id, data as StudentUpdate);
    } else {
      await onAddStudent(data as Omit<StudentInsert, 'class_id'>);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await onRemoveStudent(studentToDelete.id);
      setStudentToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Student Roster</h2>
            <Badge variant="indigo">{students.length} Total</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {currentClass
              ? `${currentClass.name} • ${currentClass.subject}`
              : 'Class student enrollment and records'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="h-4 w-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or ID..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-9 pr-3 py-1.5 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            disabled={!currentClass}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition shadow-sm whitespace-nowrap"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* State View wrapper */}
      <StateView
        status={status}
        error={error}
        onRetry={onRetry}
        emptyTitle="No Students Enrolled"
        emptyMessage={
          currentClass
            ? `There are currently no students enrolled in ${currentClass.name}. Add your first student to begin grading and attendance.`
            : 'Select or create a class to manage student rosters.'
        }
        emptyActionLabel="Enroll First Student"
        onEmptyAction={handleOpenAdd}
        loadingSkeleton={
          <div className="space-y-3 p-4 bg-zinc-900 rounded-xl border border-zinc-800 animate-pulse">
            <div className="h-10 bg-zinc-800/80 rounded-lg w-full" />
            <div className="h-14 bg-zinc-800/40 rounded-lg w-full" />
            <div className="h-14 bg-zinc-800/40 rounded-lg w-full" />
            <div className="h-14 bg-zinc-800/40 rounded-lg w-full" />
            <div className="h-14 bg-zinc-800/40 rounded-lg w-full" />
          </div>
        }
      >
        {filteredStudents.length === 0 && searchQuery ? (
          <div className="text-center py-12 bg-zinc-900/40 rounded-xl border border-zinc-800 p-6">
            <Users className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
            <p className="text-sm text-zinc-300">No students match &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => onSearchChange('')}
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-zinc-950/70 border-b border-zinc-800 text-zinc-400 font-medium">
                  <tr>
                    <th scope="col" className="py-3 px-4 sm:px-6">Student Name</th>
                    <th scope="col" className="py-3 px-4">Student ID</th>
                    <th scope="col" className="py-3 px-4">Gender</th>
                    <th scope="col" className="py-3 px-4">Contact Info</th>
                    <th scope="col" className="py-3 px-4">Notes</th>
                    <th scope="col" className="py-3 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-zinc-800/40 transition-colors group"
                    >
                      {/* Name + Avatar */}
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {student.first_name[0]}
                            {student.last_name[0]}
                          </div>
                          <div>
                            <span className="font-medium text-zinc-100 block">
                              {student.last_name}, {student.first_name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ID Number */}
                      <td className="py-3 px-4 font-mono text-xs text-zinc-400">
                        {student.student_id_number || '—'}
                      </td>

                      {/* Gender */}
                      <td className="py-3 px-4">
                        {student.gender ? (
                          <Badge variant="zinc">{student.gender}</Badge>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Contact Info */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 text-xs text-zinc-400">
                          {student.email && (
                            <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                              <Mail className="h-3 w-3 text-zinc-500 shrink-0" />
                              <span className="truncate">{student.email}</span>
                            </div>
                          )}
                          {student.contact_number && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3 w-3 text-zinc-500 shrink-0" />
                              <span>{student.contact_number}</span>
                            </div>
                          )}
                          {!student.email && !student.contact_number && <span>—</span>}
                        </div>
                      </td>

                      {/* Notes snippet */}
                      <td className="py-3 px-4 text-xs text-zinc-400 max-w-[200px] truncate">
                        {student.notes || '—'}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title="View student profile"
                            onClick={() => setSelectedStudentForDetails(student)}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Edit student"
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Delete student"
                            onClick={() => setStudentToDelete(student)}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </StateView>

      {/* Modals */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      <StudentDetailsModal
        isOpen={Boolean(selectedStudentForDetails)}
        onClose={() => setSelectedStudentForDetails(null)}
        student={selectedStudentForDetails}
        onEdit={(student) => handleOpenEdit(student)}
      />

      <ConfirmDialog
        isOpen={Boolean(studentToDelete)}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to remove ${studentToDelete?.first_name} ${studentToDelete?.last_name} from this class? This will also delete all their recorded grades.`}
        confirmLabel="Delete Student"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
