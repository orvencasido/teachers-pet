import { useState, useEffect, useCallback } from 'react';
import type { ClassItem, ClassInsert, ClassUpdate, DataState } from '../types';
import * as api from '../lib/api';

export function useClasses() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [status, setStatus] = useState<DataState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await api.getClasses();
      setClasses(data);
      if (data.length === 0) {
        setStatus('empty');
        setSelectedClassId(null);
      } else {
        setStatus('idle');
        setSelectedClassId((current) => {
          if (current && data.some((c) => c.id === current)) {
            return current;
          }
          return data[0].id;
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch classes';
      setError(message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const selectClass = useCallback((id: string) => {
    setSelectedClassId(id);
  }, []);

  const addClass = useCallback(async (newClass: ClassInsert) => {
    try {
      const created = await api.createClass(newClass);
      setClasses((prev) => [...prev, created]);
      setSelectedClassId(created.id);
      setStatus('idle');
      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create class';
      throw new Error(message);
    }
  }, []);

  const editClass = useCallback(async (id: string, updates: ClassUpdate) => {
    try {
      const updated = await api.updateClass(id, updates);
      setClasses((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update class';
      throw new Error(message);
    }
  }, []);

  const removeClass = useCallback(async (id: string) => {
    try {
      await api.deleteClass(id);
      setClasses((prev) => {
        const remaining = prev.filter((c) => c.id !== id);
        if (remaining.length === 0) {
          setStatus('empty');
          setSelectedClassId(null);
        } else if (selectedClassId === id) {
          setSelectedClassId(remaining[0].id);
        }
        return remaining;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete class';
      throw new Error(message);
    }
  }, [selectedClassId]);

  const selectedClass = classes.find((c) => c.id === selectedClassId) ?? null;

  return {
    classes,
    selectedClassId,
    selectedClass,
    status,
    error,
    selectClass,
    addClass,
    editClass,
    removeClass,
    retry: fetchClasses,
  };
}
