import { supabase } from './supabaseClient';
import type {
  ClassItem,
  ClassInsert,
  ClassUpdate,
  StudentItem,
  StudentInsert,
  StudentUpdate,
  AssessmentItem,
  AssessmentInsert,
  AssessmentUpdate,
  GradeItem,
  GradeInsert,
  CalendarEventItem,
  CalendarEventInsert,
  CalendarEventUpdate,
  LessonPlanItem,
  LessonPlanInsert,
  LessonPlanUpdate,
} from '../types';

// ==========================================
// CLASSES API
// ==========================================
export async function getClasses(): Promise<ClassItem[]> {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('grade_level', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to load classes: ${error.message}`);
  }
  return data ?? [];
}

export async function createClass(classData: ClassInsert): Promise<ClassItem> {
  const { data, error } = await supabase
    .from('classes')
    .insert(classData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create class: ${error.message}`);
  }
  return data;
}

export async function updateClass(id: string, updates: ClassUpdate): Promise<ClassItem> {
  const { data, error } = await supabase
    .from('classes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update class: ${error.message}`);
  }
  return data;
}

export async function deleteClass(id: string): Promise<void> {
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete class: ${error.message}`);
  }
}

// ==========================================
// STUDENTS API
// ==========================================
export async function getStudentsByClass(classId: string): Promise<StudentItem[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('class_id', classId)
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true });

  if (error) {
    throw new Error(`Failed to load students: ${error.message}`);
  }
  return data ?? [];
}

export async function createStudent(studentData: StudentInsert): Promise<StudentItem> {
  const { data, error } = await supabase
    .from('students')
    .insert(studentData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create student: ${error.message}`);
  }
  return data;
}

export async function updateStudent(id: string, updates: StudentUpdate): Promise<StudentItem> {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update student: ${error.message}`);
  }
  return data;
}

export async function deleteStudent(id: string): Promise<void> {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete student: ${error.message}`);
  }
}

// ==========================================
// ASSESSMENTS API
// ==========================================
export async function getAssessmentsByClass(classId: string): Promise<AssessmentItem[]> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('class_id', classId)
    .order('assessment_date', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to load assessments: ${error.message}`);
  }
  return data ?? [];
}

export async function createAssessment(assessmentData: AssessmentInsert): Promise<AssessmentItem> {
  const { data, error } = await supabase
    .from('assessments')
    .insert(assessmentData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create assessment: ${error.message}`);
  }
  return data;
}

export async function updateAssessment(id: string, updates: AssessmentUpdate): Promise<AssessmentItem> {
  const { data, error } = await supabase
    .from('assessments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update assessment: ${error.message}`);
  }
  return data;
}

export async function deleteAssessment(id: string): Promise<void> {
  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete assessment: ${error.message}`);
  }
}

// ==========================================
// GRADES API
// ==========================================
export async function getGradesForAssessments(assessmentIds: string[]): Promise<GradeItem[]> {
  if (assessmentIds.length === 0) return [];

  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .in('assessment_id', assessmentIds);

  if (error) {
    throw new Error(`Failed to load grades: ${error.message}`);
  }
  return data ?? [];
}

export async function upsertGrade(gradeData: GradeInsert): Promise<GradeItem> {
  const { data, error } = await supabase
    .from('grades')
    .upsert(gradeData, { onConflict: 'assessment_id,student_id' })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save grade: ${error.message}`);
  }
  return data;
}

export async function batchUpsertGrades(gradesData: GradeInsert[]): Promise<GradeItem[]> {
  if (gradesData.length === 0) return [];

  const { data, error } = await supabase
    .from('grades')
    .upsert(gradesData, { onConflict: 'assessment_id,student_id' })
    .select();

  if (error) {
    throw new Error(`Failed to save grades batch: ${error.message}`);
  }
  return data ?? [];
}

// ==========================================
// CALENDAR EVENTS API
// ==========================================
export async function getCalendarEvents(classId?: string | null): Promise<CalendarEventItem[]> {
  let query = supabase
    .from('calendar_events')
    .select('*')
    .order('start_time', { ascending: true });

  if (classId) {
    query = query.or(`class_id.eq.${classId},class_id.is.null`);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load calendar events: ${error.message}`);
  }
  return data ?? [];
}

export async function createCalendarEvent(eventData: CalendarEventInsert): Promise<CalendarEventItem> {
  const { data, error } = await supabase
    .from('calendar_events')
    .insert(eventData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create calendar event: ${error.message}`);
  }
  return data;
}

export async function updateCalendarEvent(id: string, updates: CalendarEventUpdate): Promise<CalendarEventItem> {
  const { data, error } = await supabase
    .from('calendar_events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update calendar event: ${error.message}`);
  }
  return data;
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete calendar event: ${error.message}`);
  }
}

// ==========================================
// LESSON PLANS API
// ==========================================
export async function getLessonPlans(classId?: string | null): Promise<LessonPlanItem[]> {
  let query = supabase
    .from('lesson_plans')
    .select('*')
    .order('target_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (classId) {
    query = query.or(`class_id.eq.${classId},class_id.is.null`);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load lesson plans: ${error.message}`);
  }
  return data ?? [];
}

export async function createLessonPlan(planData: LessonPlanInsert): Promise<LessonPlanItem> {
  const { data, error } = await supabase
    .from('lesson_plans')
    .insert(planData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create lesson plan: ${error.message}`);
  }
  return data;
}

export async function updateLessonPlan(id: string, updates: LessonPlanUpdate): Promise<LessonPlanItem> {
  const { data, error } = await supabase
    .from('lesson_plans')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update lesson plan: ${error.message}`);
  }
  return data;
}

export async function deleteLessonPlan(id: string): Promise<void> {
  const { error } = await supabase
    .from('lesson_plans')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete lesson plan: ${error.message}`);
  }
}
