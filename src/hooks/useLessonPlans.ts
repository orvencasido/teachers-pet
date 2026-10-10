import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  LessonPlanItem,
  LessonPlanInsert,
  LessonPlanUpdate,
  LessonPlanStatus,
  DataState,
} from '../types';
import * as api from '../lib/api';

export function useLessonPlans(classId: string | null) {
  const [lessonPlans, setLessonPlans] = useState<LessonPlanItem[]>([]);
  const [status, setStatus] = useState<DataState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<LessonPlanStatus | 'all'>('all');
  const [filterUnit, setFilterUnit] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPlans = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await api.getLessonPlans(classId);
      setLessonPlans(data);
      setStatus(data.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch lesson plans';
      setError(message);
      setStatus('error');
    }
  }, [classId]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const addPlan = useCallback(
    async (planData: Omit<LessonPlanInsert, 'class_id'>) => {
      try {
        const payload: LessonPlanInsert = {
          ...planData,
          class_id: classId,
        };
        const created = await api.createLessonPlan(payload);
        setLessonPlans((prev) => [created, ...prev]);
        setStatus('idle');
        return created;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create lesson plan';
        throw new Error(message);
      }
    },
    [classId]
  );

  const editPlan = useCallback(
    async (id: string, updates: LessonPlanUpdate) => {
      try {
        const updated = await api.updateLessonPlan(id, updates);
        setLessonPlans((prev) => prev.map((p) => (p.id === id ? updated : p)));
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update lesson plan';
        throw new Error(message);
      }
    },
    []
  );

  const removePlan = useCallback(
    async (id: string) => {
      try {
        await api.deleteLessonPlan(id);
        setLessonPlans((prev) => {
          const remaining = prev.filter((p) => p.id !== id);
          if (remaining.length === 0) {
            setStatus('empty');
          }
          return remaining;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete lesson plan';
        throw new Error(message);
      }
    },
    []
  );

  const units = useMemo(() => {
    const unitSet = new Set<string>();
    lessonPlans.forEach((p) => {
      if (p.unit && p.unit.trim()) {
        unitSet.add(p.unit.trim());
      }
    });
    return Array.from(unitSet).sort();
  }, [lessonPlans]);

  const filteredPlans = useMemo(() => {
    return lessonPlans.filter((p) => {
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (filterUnit !== 'all' && p.unit !== filterUnit) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = p.title.toLowerCase().includes(q);
        const subjectMatch = p.subject.toLowerCase().includes(q);
        const unitMatch = (p.unit ?? '').toLowerCase().includes(q);
        const objMatch = (p.objectives ?? '').toLowerCase().includes(q);
        if (!titleMatch && !subjectMatch && !unitMatch && !objMatch) return false;
      }
      return true;
    });
  }, [lessonPlans, filterStatus, filterUnit, searchQuery]);

  const plansByStatus = useMemo(() => {
    const groups: {
      draft: LessonPlanItem[];
      ready: LessonPlanItem[];
      completed: LessonPlanItem[];
    } = {
      draft: [],
      ready: [],
      completed: [],
    };

    filteredPlans.forEach((p) => {
      if (p.status === 'ready') groups.ready.push(p);
      else if (p.status === 'completed') groups.completed.push(p);
      else groups.draft.push(p);
    });

    return groups;
  }, [filteredPlans]);

  return {
    lessonPlans,
    filteredPlans,
    plansByStatus,
    units,
    status,
    error,
    filterStatus,
    setFilterStatus,
    filterUnit,
    setFilterUnit,
    searchQuery,
    setSearchQuery,
    addPlan,
    editPlan,
    removePlan,
    retry: fetchPlans,
  };
}
