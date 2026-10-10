-- Migration: Initial Schema for Teacher's Pet
-- File: supabase/migrations/20261010133000_init_teachers_pet_schema.sql

-- Helper function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    section TEXT NOT NULL,
    subject TEXT NOT NULL,
    school_year TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER handle_classes_updated_at
    BEFORE UPDATE ON public.classes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 2. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id_number TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender TEXT,
    email TEXT,
    contact_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_students_class_id ON public.students(class_id);

CREATE TRIGGER handle_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('quiz', 'exam', 'performance_task')),
    total_points NUMERIC NOT NULL DEFAULT 100,
    weight_percentage NUMERIC NOT NULL DEFAULT 0,
    assessment_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_assessments_class_id ON public.assessments(class_id);

CREATE TRIGGER handle_assessments_updated_at
    BEFORE UPDATE ON public.assessments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Grades Table
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    score NUMERIC NOT NULL DEFAULT 0,
    feedback TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_grades_assessment_student UNIQUE (assessment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_grades_assessment_id ON public.grades(assessment_id);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON public.grades(student_id);

CREATE TRIGGER handle_grades_updated_at
    BEFORE UPDATE ON public.grades
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. Calendar Events Table
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('lesson', 'quiz', 'exam', 'deadline', 'meeting', 'holiday', 'other')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT,
    is_all_day BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_class_id ON public.calendar_events(class_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_time ON public.calendar_events(start_time, end_time);

CREATE TRIGGER handle_calendar_events_updated_at
    BEFORE UPDATE ON public.calendar_events
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Lesson Plans Table
CREATE TABLE IF NOT EXISTS public.lesson_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    unit TEXT,
    target_date DATE DEFAULT CURRENT_DATE,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    objectives TEXT,
    materials TEXT,
    procedure TEXT,
    assessment TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lesson_plans_class_id ON public.lesson_plans(class_id);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_target_date ON public.lesson_plans(target_date);

CREATE TRIGGER handle_lesson_plans_updated_at
    BEFORE UPDATE ON public.lesson_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;

-- Granular RLS Policies allowing full teacher access for anon and authenticated roles

-- classes policies
CREATE POLICY "Allow select on classes"
    ON public.classes FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow insert on classes"
    ON public.classes FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow update on classes"
    ON public.classes FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow delete on classes"
    ON public.classes FOR DELETE
    TO anon, authenticated
    USING (true);

-- students policies
CREATE POLICY "Allow select on students"
    ON public.students FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow insert on students"
    ON public.students FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow update on students"
    ON public.students FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow delete on students"
    ON public.students FOR DELETE
    TO anon, authenticated
    USING (true);

-- assessments policies
CREATE POLICY "Allow select on assessments"
    ON public.assessments FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow insert on assessments"
    ON public.assessments FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow update on assessments"
    ON public.assessments FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow delete on assessments"
    ON public.assessments FOR DELETE
    TO anon, authenticated
    USING (true);

-- grades policies
CREATE POLICY "Allow select on grades"
    ON public.grades FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow insert on grades"
    ON public.grades FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow update on grades"
    ON public.grades FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow delete on grades"
    ON public.grades FOR DELETE
    TO anon, authenticated
    USING (true);

-- calendar_events policies
CREATE POLICY "Allow select on calendar_events"
    ON public.calendar_events FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow insert on calendar_events"
    ON public.calendar_events FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow update on calendar_events"
    ON public.calendar_events FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow delete on calendar_events"
    ON public.calendar_events FOR DELETE
    TO anon, authenticated
    USING (true);

-- lesson_plans policies
CREATE POLICY "Allow select on lesson_plans"
    ON public.lesson_plans FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow insert on lesson_plans"
    ON public.lesson_plans FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow update on lesson_plans"
    ON public.lesson_plans FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow delete on lesson_plans"
    ON public.lesson_plans FOR DELETE
    TO anon, authenticated
    USING (true);
