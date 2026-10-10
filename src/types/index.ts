import type { Database } from './database.types';

export * from './database.types';

export type ClassItem = Database['public']['Tables']['classes']['Row'];
export type ClassInsert = Database['public']['Tables']['classes']['Insert'];
export type ClassUpdate = Database['public']['Tables']['classes']['Update'];

export type StudentItem = Database['public']['Tables']['students']['Row'];
export type StudentInsert = Database['public']['Tables']['students']['Insert'];
export type StudentUpdate = Database['public']['Tables']['students']['Update'];

export type AssessmentItem = Database['public']['Tables']['assessments']['Row'];
export type AssessmentInsert = Database['public']['Tables']['assessments']['Insert'];
export type AssessmentUpdate = Database['public']['Tables']['assessments']['Update'];

export type GradeItem = Database['public']['Tables']['grades']['Row'];
export type GradeInsert = Database['public']['Tables']['grades']['Insert'];
export type GradeUpdate = Database['public']['Tables']['grades']['Update'];

export type CalendarEventItem = Database['public']['Tables']['calendar_events']['Row'];
export type CalendarEventInsert = Database['public']['Tables']['calendar_events']['Insert'];
export type CalendarEventUpdate = Database['public']['Tables']['calendar_events']['Update'];

export type LessonPlanItem = Database['public']['Tables']['lesson_plans']['Row'];
export type LessonPlanInsert = Database['public']['Tables']['lesson_plans']['Insert'];
export type LessonPlanUpdate = Database['public']['Tables']['lesson_plans']['Update'];

export type AssessmentType = 'quiz' | 'exam' | 'performance_task' | 'assignment' | 'project';

export type CalendarEventType = 'lesson' | 'quiz' | 'exam' | 'deadline' | 'meeting' | 'holiday';

export type LessonPlanStatus = 'draft' | 'ready' | 'completed';

export type DataState = 'idle' | 'loading' | 'error' | 'empty';

export interface StudentGradeSummary {
  student: StudentItem;
  grades: Record<string, number>; // assessmentId -> score
  totalEarnedPoints: number;
  totalPossiblePoints: number;
  overallPercentage: number;
  weightedScore: number;
  letterGrade: string;
}
