import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockBuilder, mockSupabase, setMockResult } = vi.hoisted(() => {
  let result: { data: any; error: any } = { data: null, error: null };

  const mockBuilder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    then: vi.fn((resolve: (res: any) => any, reject?: (err: any) => any) => {
      return Promise.resolve(result).then(resolve, reject);
    }),
  };

  const mockSupabase = {
    from: vi.fn(() => mockBuilder),
  };

  return {
    mockBuilder,
    mockSupabase,
    setMockResult: (res: { data: any; error: any }) => {
      result = res;
    },
  };
});

vi.mock('../src/lib/supabaseClient', () => ({
  supabase: mockSupabase,
}));

import * as api from '../src/lib/api';

describe('API Service (Mocked Supabase)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setMockResult({ data: null, error: null });
  });

  // ====================================================
  // CLASSES API
  // ====================================================
  describe('Classes API', () => {
    it('getClasses fetches classes ordered by grade_level and name', async () => {
      const mockClasses = [
        { id: 'c1', name: 'Math 101', grade_level: '9' },
        { id: 'c2', name: 'Science 101', grade_level: '9' },
      ];
      setMockResult({ data: mockClasses, error: null });

      const result = await api.getClasses();

      expect(mockSupabase.from).toHaveBeenCalledWith('classes');
      expect(mockBuilder.select).toHaveBeenCalledWith('*');
      expect(mockBuilder.order).toHaveBeenCalledWith('grade_level', { ascending: true });
      expect(mockBuilder.order).toHaveBeenCalledWith('name', { ascending: true });
      expect(result).toEqual(mockClasses);
    });

    it('getClasses throws formatted error when query fails', async () => {
      setMockResult({ data: null, error: { message: 'Connection timeout' } });

      await expect(api.getClasses()).rejects.toThrow('Failed to load classes: Connection timeout');
    });

    it('createClass inserts and returns single row', async () => {
      const newClass = { name: 'English 10', grade_level: '10', section: 'A' };
      const created = { id: 'c3', ...newClass };
      setMockResult({ data: created, error: null });

      const result = await api.createClass(newClass as any);

      expect(mockSupabase.from).toHaveBeenCalledWith('classes');
      expect(mockBuilder.insert).toHaveBeenCalledWith(newClass);
      expect(mockBuilder.select).toHaveBeenCalled();
      expect(mockBuilder.single).toHaveBeenCalled();
      expect(result).toEqual(created);
    });

    it('createClass throws formatted error on failure', async () => {
      setMockResult({ data: null, error: { message: 'Duplicate section' } });

      await expect(api.createClass({ name: 'A', grade_level: '1' } as any)).rejects.toThrow(
        'Failed to create class: Duplicate section'
      );
    });

    it('updateClass updates class by id', async () => {
      const updates = { name: 'Advanced Math' };
      const updated = { id: 'c1', name: 'Advanced Math', grade_level: '9' };
      setMockResult({ data: updated, error: null });

      const result = await api.updateClass('c1', updates);

      expect(mockSupabase.from).toHaveBeenCalledWith('classes');
      expect(mockBuilder.update).toHaveBeenCalledWith(updates);
      expect(mockBuilder.eq).toHaveBeenCalledWith('id', 'c1');
      expect(mockBuilder.single).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });

    it('updateClass throws error on failure', async () => {
      setMockResult({ data: null, error: { message: 'Not found' } });

      await expect(api.updateClass('c-unknown', {})).rejects.toThrow(
        'Failed to update class: Not found'
      );
    });

    it('deleteClass deletes row by id', async () => {
      setMockResult({ data: null, error: null });

      await api.deleteClass('c1');

      expect(mockSupabase.from).toHaveBeenCalledWith('classes');
      expect(mockBuilder.delete).toHaveBeenCalled();
      expect(mockBuilder.eq).toHaveBeenCalledWith('id', 'c1');
    });

    it('deleteClass throws error on failure', async () => {
      setMockResult({ data: null, error: { message: 'Foreign key constraint' } });

      await expect(api.deleteClass('c1')).rejects.toThrow(
        'Failed to delete class: Foreign key constraint'
      );
    });
  });

  // ====================================================
  // STUDENTS API
  // ====================================================
  describe('Students API', () => {
    it('getStudentsByClass filters by class_id and orders by name', async () => {
      const students = [
        { id: 's1', class_id: 'c1', first_name: 'Alice', last_name: 'Adams' },
        { id: 's2', class_id: 'c1', first_name: 'Bob', last_name: 'Baker' },
      ];
      setMockResult({ data: students, error: null });

      const result = await api.getStudentsByClass('c1');

      expect(mockSupabase.from).toHaveBeenCalledWith('students');
      expect(mockBuilder.select).toHaveBeenCalledWith('*');
      expect(mockBuilder.eq).toHaveBeenCalledWith('class_id', 'c1');
      expect(mockBuilder.order).toHaveBeenCalledWith('last_name', { ascending: true });
      expect(mockBuilder.order).toHaveBeenCalledWith('first_name', { ascending: true });
      expect(result).toEqual(students);
    });

    it('getStudentsByClass throws error on failure', async () => {
      setMockResult({ data: null, error: { message: 'DB offline' } });

      await expect(api.getStudentsByClass('c1')).rejects.toThrow(
        'Failed to load students: DB offline'
      );
    });

    it('createStudent inserts student payload', async () => {
      const payload = {
        class_id: 'c1',
        first_name: 'Charlie',
        last_name: 'Cox',
        gender: 'Male',
      };
      const created = { id: 's3', ...payload };
      setMockResult({ data: created, error: null });

      const result = await api.createStudent(payload as any);

      expect(mockSupabase.from).toHaveBeenCalledWith('students');
      expect(mockBuilder.insert).toHaveBeenCalledWith(payload);
      expect(result).toEqual(created);
    });

    it('createStudent throws error on failure', async () => {
      setMockResult({ data: null, error: { message: 'Invalid payload' } });

      await expect(api.createStudent({} as any)).rejects.toThrow(
        'Failed to create student: Invalid payload'
      );
    });

    it('updateStudent modifies student record', async () => {
      const updates = { first_name: 'Charles' };
      const updated = { id: 's3', first_name: 'Charles' };
      setMockResult({ data: updated, error: null });

      const result = await api.updateStudent('s3', updates);

      expect(mockSupabase.from).toHaveBeenCalledWith('students');
      expect(mockBuilder.update).toHaveBeenCalledWith(updates);
      expect(mockBuilder.eq).toHaveBeenCalledWith('id', 's3');
      expect(result).toEqual(updated);
    });

    it('updateStudent throws error on failure', async () => {
      setMockResult({ data: null, error: { message: 'Record not found' } });

      await expect(api.updateStudent('s-none', {})).rejects.toThrow(
        'Failed to update student: Record not found'
      );
    });

    it('deleteStudent removes student record', async () => {
      setMockResult({ data: null, error: null });

      await api.deleteStudent('s3');

      expect(mockSupabase.from).toHaveBeenCalledWith('students');
      expect(mockBuilder.delete).toHaveBeenCalled();
      expect(mockBuilder.eq).toHaveBeenCalledWith('id', 's3');
    });

    it('deleteStudent throws error on failure', async () => {
      setMockResult({ data: null, error: { message: 'Delete restricted' } });

      await expect(api.deleteStudent('s3')).rejects.toThrow(
        'Failed to delete student: Delete restricted'
      );
    });
  });

  // ====================================================
  // ASSESSMENTS API
  // ====================================================
  describe('Assessments API', () => {
    it('getAssessmentsByClass queries assessments for class', async () => {
      const items = [{ id: 'a1', title: 'Quiz 1', total_points: 20 }];
      setMockResult({ data: items, error: null });

      const result = await api.getAssessmentsByClass('c1');

      expect(mockSupabase.from).toHaveBeenCalledWith('assessments');
      expect(mockBuilder.select).toHaveBeenCalledWith('*');
      expect(mockBuilder.eq).toHaveBeenCalledWith('class_id', 'c1');
      expect(result).toEqual(items);
    });

    it('getAssessmentsByClass throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Fetch error' } });

      await expect(api.getAssessmentsByClass('c1')).rejects.toThrow(
        'Failed to load assessments: Fetch error'
      );
    });

    it('createAssessment inserts and returns assessment', async () => {
      const newAsm = { class_id: 'c1', title: 'Unit Test', total_points: 100, weight_percentage: 20 };
      const created = { id: 'a2', ...newAsm };
      setMockResult({ data: created, error: null });

      const result = await api.createAssessment(newAsm as any);

      expect(mockSupabase.from).toHaveBeenCalledWith('assessments');
      expect(mockBuilder.insert).toHaveBeenCalledWith(newAsm);
      expect(result).toEqual(created);
    });

    it('createAssessment throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Insert error' } });

      await expect(api.createAssessment({} as any)).rejects.toThrow(
        'Failed to create assessment: Insert error'
      );
    });

    it('updateAssessment updates assessment row', async () => {
      const updates = { total_points: 50 };
      const updated = { id: 'a1', total_points: 50 };
      setMockResult({ data: updated, error: null });

      const result = await api.updateAssessment('a1', updates);

      expect(mockSupabase.from).toHaveBeenCalledWith('assessments');
      expect(mockBuilder.update).toHaveBeenCalledWith(updates);
      expect(mockBuilder.eq).toHaveBeenCalledWith('id', 'a1');
      expect(result).toEqual(updated);
    });

    it('updateAssessment throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Update error' } });

      await expect(api.updateAssessment('a1', {})).rejects.toThrow(
        'Failed to update assessment: Update error'
      );
    });

    it('deleteAssessment deletes assessment row', async () => {
      setMockResult({ data: null, error: null });

      await api.deleteAssessment('a1');

      expect(mockSupabase.from).toHaveBeenCalledWith('assessments');
      expect(mockBuilder.delete).toHaveBeenCalled();
      expect(mockBuilder.eq).toHaveBeenCalledWith('id', 'a1');
    });

    it('deleteAssessment throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Delete error' } });

      await expect(api.deleteAssessment('a1')).rejects.toThrow(
        'Failed to delete assessment: Delete error'
      );
    });
  });

  // ====================================================
  // GRADES API
  // ====================================================
  describe('Grades API', () => {
    it('getGradesForAssessments returns empty array immediately if assessmentIds is empty', async () => {
      const result = await api.getGradesForAssessments([]);
      expect(result).toEqual([]);
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it('getGradesForAssessments queries grades with IN filter', async () => {
      const grades = [{ id: 'g1', student_id: 's1', assessment_id: 'a1', score: 18 }];
      setMockResult({ data: grades, error: null });

      const result = await api.getGradesForAssessments(['a1', 'a2']);

      expect(mockSupabase.from).toHaveBeenCalledWith('grades');
      expect(mockBuilder.select).toHaveBeenCalledWith('*');
      expect(mockBuilder.in).toHaveBeenCalledWith('assessment_id', ['a1', 'a2']);
      expect(result).toEqual(grades);
    });

    it('getGradesForAssessments throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Read error' } });

      await expect(api.getGradesForAssessments(['a1'])).rejects.toThrow(
        'Failed to load grades: Read error'
      );
    });

    it('upsertGrade saves single grade using upsert onConflict', async () => {
      const gradePayload = { student_id: 's1', assessment_id: 'a1', score: 95 };
      const saved = { id: 'g1', ...gradePayload };
      setMockResult({ data: saved, error: null });

      const result = await api.upsertGrade(gradePayload as any);

      expect(mockSupabase.from).toHaveBeenCalledWith('grades');
      expect(mockBuilder.upsert).toHaveBeenCalledWith(gradePayload, {
        onConflict: 'assessment_id,student_id',
      });
      expect(mockBuilder.single).toHaveBeenCalled();
      expect(result).toEqual(saved);
    });

    it('upsertGrade throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Upsert failed' } });

      await expect(api.upsertGrade({} as any)).rejects.toThrow(
        'Failed to save grade: Upsert failed'
      );
    });

    it('batchUpsertGrades returns empty array immediately if array is empty', async () => {
      const result = await api.batchUpsertGrades([]);
      expect(result).toEqual([]);
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it('batchUpsertGrades upserts batch array', async () => {
      const batchPayload = [
        { student_id: 's1', assessment_id: 'a1', score: 90 },
        { student_id: 's2', assessment_id: 'a1', score: 85 },
      ];
      setMockResult({ data: batchPayload, error: null });

      const result = await api.batchUpsertGrades(batchPayload as any);

      expect(mockSupabase.from).toHaveBeenCalledWith('grades');
      expect(mockBuilder.upsert).toHaveBeenCalledWith(batchPayload, {
        onConflict: 'assessment_id,student_id',
      });
      expect(result).toEqual(batchPayload);
    });

    it('batchUpsertGrades throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Batch error' } });

      await expect(
        api.batchUpsertGrades([{ student_id: 's1', assessment_id: 'a1', score: 90 }] as any)
      ).rejects.toThrow('Failed to save grades batch: Batch error');
    });
  });

  // ====================================================
  // CALENDAR EVENTS API
  // ====================================================
  describe('Calendar Events API', () => {
    it('getCalendarEvents without classId queries all events', async () => {
      const events = [{ id: 'e1', title: 'Assembly', start_time: '2026-10-01' }];
      setMockResult({ data: events, error: null });

      const result = await api.getCalendarEvents();

      expect(mockSupabase.from).toHaveBeenCalledWith('calendar_events');
      expect(mockBuilder.select).toHaveBeenCalledWith('*');
      expect(mockBuilder.order).toHaveBeenCalledWith('start_time', { ascending: true });
      expect(mockBuilder.or).not.toHaveBeenCalled();
      expect(result).toEqual(events);
    });

    it('getCalendarEvents with classId adds class_id or null filter', async () => {
      setMockResult({ data: [], error: null });

      await api.getCalendarEvents('class-xyz');

      expect(mockBuilder.or).toHaveBeenCalledWith('class_id.eq.class-xyz,class_id.is.null');
    });

    it('getCalendarEvents throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Calendar failed' } });

      await expect(api.getCalendarEvents()).rejects.toThrow(
        'Failed to load calendar events: Calendar failed'
      );
    });

    it('createCalendarEvent inserts event', async () => {
      const payload = { title: 'Exam', start_time: '2026-10-10', end_time: '2026-10-10' };
      const created = { id: 'e2', ...payload };
      setMockResult({ data: created, error: null });

      const result = await api.createCalendarEvent(payload as any);

      expect(mockSupabase.from).toHaveBeenCalledWith('calendar_events');
      expect(mockBuilder.insert).toHaveBeenCalledWith(payload);
      expect(result).toEqual(created);
    });

    it('createCalendarEvent throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Event insert error' } });

      await expect(api.createCalendarEvent({} as any)).rejects.toThrow(
        'Failed to create calendar event: Event insert error'
      );
    });

    it('updateCalendarEvent updates event', async () => {
      const updates = { title: 'Rescheduled Exam' };
      const updated = { id: 'e2', ...updates };
      setMockResult({ data: updated, error: null });

      const result = await api.updateCalendarEvent('e2', updates);

      expect(mockSupabase.from).toHaveBeenCalledWith('calendar_events');
      expect(mockBuilder.update).toHaveBeenCalledWith(updates);
      expect(mockBuilder.eq).toHaveBeenCalledWith('id', 'e2');
      expect(result).toEqual(updated);
    });

    it('updateCalendarEvent throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Update failed' } });

      await expect(api.updateCalendarEvent('e2', {})).rejects.toThrow(
        'Failed to update calendar event: Update failed'
      );
    });

    it('deleteCalendarEvent deletes event', async () => {
      setMockResult({ data: null, error: null });

      await api.deleteCalendarEvent('e2');

      expect(mockSupabase.from).toHaveBeenCalledWith('calendar_events');
      expect(mockBuilder.delete).toHaveBeenCalled();
      expect(mockBuilder.eq).toHaveBeenCalledWith('id', 'e2');
    });

    it('deleteCalendarEvent throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Delete failed' } });

      await expect(api.deleteCalendarEvent('e2')).rejects.toThrow(
        'Failed to delete calendar event: Delete failed'
      );
    });
  });

  // ====================================================
  // LESSON PLANS API
  // ====================================================
  describe('Lesson Plans API', () => {
    it('getLessonPlans without classId queries all plans ordered by target_date desc', async () => {
      const plans = [{ id: 'lp1', title: 'Cell Biology', status: 'draft' }];
      setMockResult({ data: plans, error: null });

      const result = await api.getLessonPlans();

      expect(mockSupabase.from).toHaveBeenCalledWith('lesson_plans');
      expect(mockBuilder.select).toHaveBeenCalledWith('*');
      expect(mockBuilder.order).toHaveBeenCalledWith('target_date', { ascending: false });
      expect(mockBuilder.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockBuilder.or).not.toHaveBeenCalled();
      expect(result).toEqual(plans);
    });

    it('getLessonPlans with classId filters by class or null', async () => {
      setMockResult({ data: [], error: null });

      await api.getLessonPlans('cls-abc');

      expect(mockBuilder.or).toHaveBeenCalledWith('class_id.eq.cls-abc,class_id.is.null');
    });

    it('getLessonPlans throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Plan load error' } });

      await expect(api.getLessonPlans()).rejects.toThrow(
        'Failed to load lesson plans: Plan load error'
      );
    });

    it('createLessonPlan inserts plan', async () => {
      const payload = { title: 'Photosynthesis', subject: 'Biology', status: 'draft' };
      const created = { id: 'lp2', ...payload };
      setMockResult({ data: created, error: null });

      const result = await api.createLessonPlan(payload as any);

      expect(mockSupabase.from).toHaveBeenCalledWith('lesson_plans');
      expect(mockBuilder.insert).toHaveBeenCalledWith(payload);
      expect(result).toEqual(created);
    });

    it('createLessonPlan throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Insert failed' } });

      await expect(api.createLessonPlan({} as any)).rejects.toThrow(
        'Failed to create lesson plan: Insert failed'
      );
    });

    it('updateLessonPlan updates plan', async () => {
      const updates = { status: 'ready' as const };
      const updated = { id: 'lp2', status: 'ready' };
      setMockResult({ data: updated, error: null });

      const result = await api.updateLessonPlan('lp2', updates);

      expect(mockSupabase.from).toHaveBeenCalledWith('lesson_plans');
      expect(mockBuilder.update).toHaveBeenCalledWith(updates);
      expect(mockBuilder.eq).toHaveBeenCalledWith('id', 'lp2');
      expect(result).toEqual(updated);
    });

    it('updateLessonPlan throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Update failed' } });

      await expect(api.updateLessonPlan('lp2', {})).rejects.toThrow(
        'Failed to update lesson plan: Update failed'
      );
    });

    it('deleteLessonPlan deletes plan', async () => {
      setMockResult({ data: null, error: null });

      await api.deleteLessonPlan('lp2');

      expect(mockSupabase.from).toHaveBeenCalledWith('lesson_plans');
      expect(mockBuilder.delete).toHaveBeenCalled();
      expect(mockBuilder.eq).toHaveBeenCalledWith('id', 'lp2');
    });

    it('deleteLessonPlan throws on error', async () => {
      setMockResult({ data: null, error: { message: 'Delete failed' } });

      await expect(api.deleteLessonPlan('lp2')).rejects.toThrow(
        'Failed to delete lesson plan: Delete failed'
      );
    });
  });
});
