export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          assessment_date: string | null
          class_id: string
          created_at: string
          id: string
          title: string
          total_points: number
          type: string
          updated_at: string
          weight_percentage: number
        }
        Insert: {
          assessment_date?: string | null
          class_id: string
          created_at?: string
          id?: string
          title: string
          total_points?: number
          type: string
          updated_at?: string
          weight_percentage?: number
        }
        Update: {
          assessment_date?: string | null
          class_id?: string
          created_at?: string
          id?: string
          title?: string
          total_points?: number
          type?: string
          updated_at?: string
          weight_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          class_id: string | null
          created_at: string
          description: string | null
          end_time: string
          event_type: string
          id: string
          is_all_day: boolean
          location: string | null
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          event_type: string
          id?: string
          is_all_day?: boolean
          location?: string | null
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          event_type?: string
          id?: string
          is_all_day?: boolean
          location?: string | null
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          grade_level: string
          id: string
          name: string
          school_year: string
          section: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          grade_level: string
          id?: string
          name: string
          school_year: string
          section: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          grade_level?: string
          id?: string
          name?: string
          school_year?: string
          section?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      grades: {
        Row: {
          assessment_id: string
          created_at: string
          feedback: string | null
          id: string
          score: number
          student_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          assessment_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          score?: number
          student_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          assessment_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          score?: number
          student_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grades_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_plans: {
        Row: {
          assessment: string | null
          class_id: string | null
          created_at: string
          duration_minutes: number
          grade_level: string
          id: string
          materials: string | null
          notes: string | null
          objectives: string | null
          procedure: string | null
          status: string
          subject: string
          target_date: string | null
          title: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          assessment?: string | null
          class_id?: string | null
          created_at?: string
          duration_minutes?: number
          grade_level: string
          id?: string
          materials?: string | null
          notes?: string | null
          objectives?: string | null
          procedure?: string | null
          status?: string
          subject: string
          target_date?: string | null
          title: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          assessment?: string | null
          class_id?: string | null
          created_at?: string
          duration_minutes?: number
          grade_level?: string
          id?: string
          materials?: string | null
          notes?: string | null
          objectives?: string | null
          procedure?: string | null
          status?: string
          subject?: string
          target_date?: string | null
          title?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_plans_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          class_id: string
          contact_number: string | null
          created_at: string
          email: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          notes: string | null
          student_id_number: string | null
          updated_at: string
        }
        Insert: {
          class_id: string
          contact_number?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          notes?: string | null
          student_id_number?: string | null
          updated_at?: string
        }
        Update: {
          class_id?: string
          contact_number?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          notes?: string | null
          student_id_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Domain Entity Aliases
export type Class = Database['public']['Tables']['classes']['Row']
export type ClassInsert = Database['public']['Tables']['classes']['Insert']
export type ClassUpdate = Database['public']['Tables']['classes']['Update']

export type Student = Database['public']['Tables']['students']['Row']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type StudentUpdate = Database['public']['Tables']['students']['Update']

export type Assessment = Database['public']['Tables']['assessments']['Row']
export type AssessmentInsert = Database['public']['Tables']['assessments']['Insert']
export type AssessmentUpdate = Database['public']['Tables']['assessments']['Update']

export type Grade = Database['public']['Tables']['grades']['Row']
export type GradeInsert = Database['public']['Tables']['grades']['Insert']
export type GradeUpdate = Database['public']['Tables']['grades']['Update']

export type CalendarEvent = Database['public']['Tables']['calendar_events']['Row']
export type CalendarEventInsert = Database['public']['Tables']['calendar_events']['Insert']
export type CalendarEventUpdate = Database['public']['Tables']['calendar_events']['Update']

export type LessonPlan = Database['public']['Tables']['lesson_plans']['Row']
export type LessonPlanInsert = Database['public']['Tables']['lesson_plans']['Insert']
export type LessonPlanUpdate = Database['public']['Tables']['lesson_plans']['Update']

// Specific union types matching check constraints
export type AssessmentType = 'quiz' | 'exam' | 'performance_task'
export type CalendarEventType = 'lesson' | 'quiz' | 'exam' | 'deadline' | 'meeting' | 'holiday' | 'other'
export type LessonPlanStatus = 'draft' | 'ready' | 'completed'

