import { describe, it, expect } from 'vitest';
import type { StudentItem } from '../src/types';

describe('Student Roster Data Models & Operations', () => {
  const roster: StudentItem[] = [
    {
      id: 'stu-1',
      class_id: 'cls-1',
      student_id_number: 'STU-003',
      first_name: 'Zoe',
      last_name: 'Alvarez',
      gender: 'Female',
      email: 'zoe.alvarez@example.com',
      contact_number: '123-456-7890',
      notes: null,
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-01T08:00:00Z',
    },
    {
      id: 'stu-2',
      class_id: 'cls-1',
      student_id_number: 'STU-001',
      first_name: 'Aaron',
      last_name: 'Brown',
      gender: 'Male',
      email: null,
      contact_number: null,
      notes: null,
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-01T08:00:00Z',
    },
    {
      id: 'stu-3',
      class_id: 'cls-1',
      student_id_number: 'STU-002',
      first_name: 'Beatriz',
      last_name: 'Brown',
      gender: 'Female',
      email: 'beatriz.brown@example.com',
      contact_number: '987-654-3210',
      notes: 'Transfer student',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-01T08:00:00Z',
    },
  ];

  it('sorts roster predictably by last_name then first_name ascending', () => {
    const sorted = [...roster].sort((a, b) => {
      const cmp = a.last_name.localeCompare(b.last_name);
      return cmp !== 0 ? cmp : a.first_name.localeCompare(b.first_name);
    });

    expect(sorted.map((s) => `${s.last_name}, ${s.first_name}`)).toEqual([
      'Alvarez, Zoe',
      'Brown, Aaron',
      'Brown, Beatriz',
    ]);
  });

  it('filters students by search query across multiple fields', () => {
    const filterFn = (query: string) => {
      const q = query.toLowerCase().trim();
      return roster.filter((s) => {
        const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
        const idMatch = (s.student_id_number ?? '').toLowerCase().includes(q);
        const emailMatch = (s.email ?? '').toLowerCase().includes(q);
        return fullName.includes(q) || idMatch || emailMatch;
      });
    };

    expect(filterFn('alvarez').length).toBe(1);
    expect(filterFn('STU-002').length).toBe(1);
    expect(filterFn('STU-002')[0].first_name).toBe('Beatriz');
    expect(filterFn('brown').length).toBe(2);
    expect(filterFn('nonexistent').length).toBe(0);
  });

  it('handles gender distribution statistics', () => {
    const counts = roster.reduce(
      (acc, s) => {
        const key = s.gender ?? 'Unspecified';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    expect(counts['Female']).toBe(2);
    expect(counts['Male']).toBe(1);
  });
});
