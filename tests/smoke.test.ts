import { describe, it, expect } from 'vitest';
import { supabase } from '../src/lib/supabaseClient';
import type { StudentItem, AssessmentItem, ClassItem, LessonPlanItem, CalendarEventItem } from '../src/types';

describe('Harness Sanity & Smoke Checks', () => {
  it('environment runs basic test assertions', () => {
    expect(true).toBe(true);
    expect(1 + 1).toBe(2);
  });

  it('verifies Supabase client initialization structure', () => {
    expect(supabase).toBeDefined();
    expect(typeof supabase.from).toBe('function');
  });

  it('validates core domain model shapes', () => {
    const student: StudentItem = {
      id: 'test-stu',
      class_id: 'test-cls',
      student_id_number: 'STU-999',
      first_name: 'Jane',
      last_name: 'Smith',
      gender: 'Female',
      email: 'jane@school.org',
      contact_number: '555-1234',
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(student.id).toBe('test-stu');
    expect(student.first_name).toBe('Jane');

    const assessment: AssessmentItem = {
      id: 'test-asm',
      class_id: 'test-cls',
      title: 'Pop Quiz',
      type: 'quiz',
      total_points: 20,
      weight_percentage: 15,
      assessment_date: '2026-10-10',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(assessment.type).toBe('quiz');
    expect(assessment.total_points).toBe(20);

    const classItem: ClassItem = {
      id: 'test-cls',
      name: 'Grade 9 Biology',
      grade_level: '9',
      section: 'Section Alpha',
      school_year: '2026-2027',
      subject: 'Biology',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(classItem.grade_level).toBe('9');

    const lessonPlan: LessonPlanItem = {
      id: 'test-lp',
      class_id: 'test-cls',
      title: 'Mitosis and Meiosis',
      subject: 'Biology',
      grade_level: '9',
      duration_minutes: 60,
      unit: 'Cell Division',
      target_date: '2026-10-12',
      status: 'ready',
      objectives: 'Understand cellular division stages',
      materials: 'Microscopes, slides',
      procedure: '1. Introduction 2. Microscope lab',
      assessment: 'Lab report',
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(lessonPlan.status).toBe('ready');

    const calendarEvent: CalendarEventItem = {
      id: 'test-ce',
      class_id: 'test-cls',
      title: 'Midterm Practical Exam',
      description: null,
      event_type: 'exam',
      start_time: '2026-10-15T09:00:00Z',
      end_time: '2026-10-15T11:00:00Z',
      location: 'Science Lab',
      is_all_day: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(calendarEvent.event_type).toBe('exam');
  });
});
