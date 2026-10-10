import { describe, it, expect } from 'vitest';
import type { LessonPlanItem, LessonPlanStatus } from '../src/types';

describe('Lesson Plan State Transitions & Filtering', () => {
  const plans: LessonPlanItem[] = [
    {
      id: 'lp-1',
      class_id: 'cls-1',
      title: 'Intro to Genetics',
      subject: 'Biology',
      grade_level: '9',
      duration_minutes: 60,
      unit: 'Genetics',
      target_date: '2026-10-15',
      status: 'draft',
      objectives: 'Understand Mendelian inheritance',
      materials: 'Textbook Chapter 4',
      procedure: '1. Lecture 2. Punnett square exercises',
      assessment: 'Worksheet',
      notes: null,
      created_at: '2026-10-01T08:00:00Z',
      updated_at: '2026-10-01T08:00:00Z',
    },
    {
      id: 'lp-2',
      class_id: 'cls-1',
      title: 'DNA Replication',
      subject: 'Biology',
      grade_level: '9',
      duration_minutes: 60,
      unit: 'Genetics',
      target_date: '2026-10-18',
      status: 'ready',
      objectives: 'Identify replication enzymes',
      materials: 'Molecular models',
      procedure: 'Group modeling activity',
      assessment: 'Exit ticket',
      notes: null,
      created_at: '2026-10-02T08:00:00Z',
      updated_at: '2026-10-02T08:00:00Z',
    },
    {
      id: 'lp-3',
      class_id: 'cls-1',
      title: 'Cellular Respiration',
      subject: 'Biology',
      grade_level: '9',
      duration_minutes: 60,
      unit: 'Cell Bio',
      target_date: '2026-10-05',
      status: 'completed',
      objectives: 'Explain ATP production cycles',
      materials: 'Diagrams',
      procedure: 'Lecture and Q&A',
      assessment: 'Quiz 2',
      notes: 'Well received by students',
      created_at: '2026-09-25T08:00:00Z',
      updated_at: '2026-10-05T15:00:00Z',
    },
  ];

  it('supports state transitions from draft to ready to completed', () => {
    let currentPlan = { ...plans[0] };
    expect(currentPlan.status).toBe('draft');

    // Transition to ready
    currentPlan = { ...currentPlan, status: 'ready', updated_at: '2026-10-10T10:00:00Z' };
    expect(currentPlan.status).toBe('ready');

    // Transition to completed
    currentPlan = { ...currentPlan, status: 'completed', updated_at: '2026-10-15T16:00:00Z' };
    expect(currentPlan.status).toBe('completed');
  });

  it('groups plans by their current status', () => {
    const grouped = plans.reduce(
      (acc, p) => {
        const status = p.status as LessonPlanStatus;
        if (acc[status]) {
          acc[status].push(p);
        }
        return acc;
      },
      { draft: [], ready: [], completed: [] } as Record<LessonPlanStatus, LessonPlanItem[]>
    );

    expect(grouped.draft.length).toBe(1);
    expect(grouped.ready.length).toBe(1);
    expect(grouped.completed.length).toBe(1);
  });

  it('extracts unique sorted units for filtering', () => {
    const unitsSet = new Set<string>();
    plans.forEach((p) => {
      if (p.unit?.trim()) unitsSet.add(p.unit.trim());
    });
    const units = Array.from(unitsSet).sort();

    expect(units).toEqual(['Cell Bio', 'Genetics']);
  });

  it('filters plans by status and search keyword', () => {
    const filterPlans = (status: LessonPlanStatus | 'all', search: string) => {
      return plans.filter((p) => {
        if (status !== 'all' && p.status !== status) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const match =
            p.title.toLowerCase().includes(q) ||
            p.subject.toLowerCase().includes(q) ||
            (p.unit ?? '').toLowerCase().includes(q) ||
            (p.objectives ?? '').toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      });
    };

    expect(filterPlans('all', 'Genetics').length).toBe(2);
    expect(filterPlans('ready', 'Genetics').length).toBe(1);
    expect(filterPlans('completed', '').length).toBe(1);
    expect(filterPlans('draft', 'Respiration').length).toBe(0);
  });
});
