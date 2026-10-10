import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  AssessmentItem,
  AssessmentInsert,
  AssessmentUpdate,
  AssessmentType,
  GradeItem,
  GradeInsert,
  StudentItem,
  StudentGradeSummary,
  DataState,
} from '../types';
import * as api from '../lib/api';
import { computeStudentGradeSummary } from '../lib/gradeCalculator';

export function useGradebook(classId: string | null, students: StudentItem[]) {
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [grades, setGrades] = useState<GradeItem[]>([]);
  // Local score lookup: studentId -> assessmentId -> score
  const [scoreMatrix, setScoreMatrix] = useState<Record<string, Record<string, number>>>({});
  // Track modified cells: `${studentId}:${assessmentId}` -> true
  const [dirtyCells, setDirtyCells] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<DataState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [filterType, setFilterType] = useState<AssessmentType | 'all'>('all');

  const fetchGradebook = useCallback(async () => {
    if (!classId) {
      setAssessments([]);
      setGrades([]);
      setScoreMatrix({});
      setDirtyCells({});
      setStatus('empty');
      return;
    }

    setStatus('loading');
    setError(null);
    try {
      const assessmentList = await api.getAssessmentsByClass(classId);
      setAssessments(assessmentList);

      const assessmentIds = assessmentList.map((a) => a.id);
      const gradeList = await api.getGradesForAssessments(assessmentIds);
      setGrades(gradeList);

      // Populate score matrix
      const matrix: Record<string, Record<string, number>> = {};
      gradeList.forEach((g) => {
        if (!matrix[g.student_id]) {
          matrix[g.student_id] = {};
        }
        matrix[g.student_id][g.assessment_id] = g.score;
      });
      setScoreMatrix(matrix);
      setDirtyCells({});
      setStatus(assessmentList.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch gradebook';
      setError(message);
      setStatus('error');
    }
  }, [classId]);

  useEffect(() => {
    fetchGradebook();
  }, [fetchGradebook]);

  const updateScoreLocally = useCallback((studentId: string, assessmentId: string, score: number) => {
    setScoreMatrix((prev) => {
      const studentScores = prev[studentId] ? { ...prev[studentId] } : {};
      studentScores[assessmentId] = score;
      return {
        ...prev,
        [studentId]: studentScores,
      };
    });

    setDirtyCells((prev) => ({
      ...prev,
      [`${studentId}:${assessmentId}`]: true,
    }));
  }, []);

  const saveIndividualGrade = useCallback(
    async (studentId: string, assessmentId: string, score: number) => {
      setIsSaving(true);
      try {
        const payload: GradeInsert = {
          student_id: studentId,
          assessment_id: assessmentId,
          score,
          submitted_at: new Date().toISOString(),
        };
        const saved = await api.upsertGrade(payload);
        setGrades((prev) => {
          const index = prev.findIndex((g) => g.student_id === studentId && g.assessment_id === assessmentId);
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [...prev, saved];
        });
        setDirtyCells((prev) => {
          const next = { ...prev };
          delete next[`${studentId}:${assessmentId}`];
          return next;
        });
        return saved;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save grade';
        throw new Error(message);
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const saveAllDirtyGrades = useCallback(async () => {
    const dirtyKeys = Object.keys(dirtyCells);
    if (dirtyKeys.length === 0) return;

    setIsSaving(true);
    try {
      const payloads: GradeInsert[] = dirtyKeys.map((key) => {
        const [studentId, assessmentId] = key.split(':');
        const score = scoreMatrix[studentId]?.[assessmentId] ?? 0;
        return {
          student_id: studentId,
          assessment_id: assessmentId,
          score,
          submitted_at: new Date().toISOString(),
        };
      });

      const savedList = await api.batchUpsertGrades(payloads);
      setGrades((prev) => {
        const map = new Map<string, GradeItem>();
        prev.forEach((g) => map.set(`${g.student_id}:${g.assessment_id}`, g));
        savedList.forEach((g) => map.set(`${g.student_id}:${g.assessment_id}`, g));
        return Array.from(map.values());
      });
      setDirtyCells({});
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save grades in batch';
      throw new Error(message);
    } finally {
      setIsSaving(false);
    }
  }, [dirtyCells, scoreMatrix]);

  const addAssessment = useCallback(
    async (assessmentData: Omit<AssessmentInsert, 'class_id'>) => {
      if (!classId) throw new Error('No class selected');
      try {
        const payload: AssessmentInsert = {
          ...assessmentData,
          class_id: classId,
        };
        const created = await api.createAssessment(payload);
        setAssessments((prev) => [...prev, created]);
        setStatus('idle');
        return created;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create assessment';
        throw new Error(message);
      }
    },
    [classId]
  );

  const editAssessment = useCallback(
    async (id: string, updates: AssessmentUpdate) => {
      try {
        const updated = await api.updateAssessment(id, updates);
        setAssessments((prev) => prev.map((a) => (a.id === id ? updated : a)));
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update assessment';
        throw new Error(message);
      }
    },
    []
  );

  const removeAssessment = useCallback(
    async (id: string) => {
      try {
        await api.deleteAssessment(id);
        setAssessments((prev) => {
          const remaining = prev.filter((a) => a.id !== id);
          if (remaining.length === 0) {
            setStatus('empty');
          }
          return remaining;
        });
        // Remove from grades and score matrix
        setGrades((prev) => prev.filter((g) => g.assessment_id !== id));
        setScoreMatrix((prev) => {
          const next: Record<string, Record<string, number>> = {};
          Object.entries(prev).forEach(([studentId, scores]) => {
            next[studentId] = { ...scores };
            delete next[studentId][id];
          });
          return next;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete assessment';
        throw new Error(message);
      }
    },
    []
  );

  // Filtered assessments list
  const filteredAssessments = useMemo(() => {
    if (filterType === 'all') return assessments;
    return assessments.filter((a) => a.type === filterType);
  }, [assessments, filterType]);

  // Compute student grade summaries
  const studentSummaries: StudentGradeSummary[] = useMemo(() => {
    return students.map((student) => {
      const studentScores = scoreMatrix[student.id] || {};
      return computeStudentGradeSummary(student, assessments, studentScores);
    });
  }, [students, assessments, scoreMatrix]);

  const hasDirtyCells = Object.keys(dirtyCells).length > 0;

  return {
    assessments,
    filteredAssessments,
    grades,
    scoreMatrix,
    dirtyCells,
    hasDirtyCells,
    studentSummaries,
    status,
    error,
    isSaving,
    filterType,
    setFilterType,
    updateScoreLocally,
    saveIndividualGrade,
    saveAllDirtyGrades,
    addAssessment,
    editAssessment,
    removeAssessment,
    retry: fetchGradebook,
  };
}
