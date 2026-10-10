import { useState, useEffect, useCallback, useMemo } from 'react';
import type { StudentItem, StudentInsert, StudentUpdate, DataState } from '../types';
import * as api from '../lib/api';

export function useStudents(classId: string | null) {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [status, setStatus] = useState<DataState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStudents = useCallback(async () => {
    if (!classId) {
      setStudents([]);
      setStatus('empty');
      return;
    }

    setStatus('loading');
    setError(null);
    try {
      const data = await api.getStudentsByClass(classId);
      setStudents(data);
      setStatus(data.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch students';
      setError(message);
      setStatus('error');
    }
  }, [classId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const addStudent = useCallback(
    async (studentData: Omit<StudentInsert, 'class_id'>) => {
      if (!classId) throw new Error('No class selected');
      try {
        const payload: StudentInsert = {
          ...studentData,
          class_id: classId,
        };
        const created = await api.createStudent(payload);
        setStudents((prev) => [...prev, created]);
        setStatus('idle');
        return created;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add student';
        throw new Error(message);
      }
    },
    [classId]
  );

  const editStudent = useCallback(
    async (id: string, updates: StudentUpdate) => {
      try {
        const updated = await api.updateStudent(id, updates);
        setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update student';
        throw new Error(message);
      }
    },
    []
  );

  const removeStudent = useCallback(
    async (id: string) => {
      try {
        await api.deleteStudent(id);
        setStudents((prev) => {
          const remaining = prev.filter((s) => s.id !== id);
          if (remaining.length === 0) {
            setStatus('empty');
          }
          return remaining;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete student';
        throw new Error(message);
      }
    },
    []
  );

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase().trim();
    return students.filter((s) => {
      const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
      const idNum = (s.student_id_number ?? '').toLowerCase();
      const email = (s.email ?? '').toLowerCase();
      return fullName.includes(query) || idNum.includes(query) || email.includes(query);
    });
  }, [students, searchQuery]);

  return {
    students,
    filteredStudents,
    status,
    error,
    searchQuery,
    setSearchQuery,
    addStudent,
    editStudent,
    removeStudent,
    retry: fetchStudents,
  };
}
