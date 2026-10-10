import { describe, it, expect } from 'vitest';
import { calculateLetterGrade, computeStudentGradeSummary } from '../src/lib/gradeCalculator';
import type { StudentItem, AssessmentItem } from '../src/types';

describe('Grade Calculations', () => {
  it('correctly calculates letter grades according to grading boundaries', () => {
    expect(calculateLetterGrade(98)).toBe('A+');
    expect(calculateLetterGrade(94)).toBe('A');
    expect(calculateLetterGrade(91)).toBe('A-');
    expect(calculateLetterGrade(88)).toBe('B+');
    expect(calculateLetterGrade(84)).toBe('B');
    expect(calculateLetterGrade(81)).toBe('B-');
    expect(calculateLetterGrade(78)).toBe('C+');
    expect(calculateLetterGrade(74)).toBe('C');
    expect(calculateLetterGrade(71)).toBe('C-');
    expect(calculateLetterGrade(66)).toBe('D+');
    expect(calculateLetterGrade(62)).toBe('D');
    expect(calculateLetterGrade(55)).toBe('F');
  });

  it('computes raw and weighted grades for student with multiple assessments', () => {
    const student: StudentItem = {
      id: 'student-1',
      class_id: 'class-1',
      student_id_number: 'STU-001',
      first_name: 'Alex',
      last_name: 'Morgan',
      gender: 'Male',
      email: 'alex@school.edu',
      contact_number: null,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const assessments: AssessmentItem[] = [
      {
        id: 'asm-1',
        class_id: 'class-1',
        title: 'Quiz 1',
        type: 'quiz',
        total_points: 25,
        weight_percentage: 20,
        assessment_date: '2026-09-15',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'asm-2',
        class_id: 'class-1',
        title: 'Midterm Exam',
        type: 'exam',
        total_points: 100,
        weight_percentage: 50,
        assessment_date: '2026-10-01',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'asm-3',
        class_id: 'class-1',
        title: 'Performance Task',
        type: 'performance_task',
        total_points: 50,
        weight_percentage: 30,
        assessment_date: '2026-10-15',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Scores:
    // Quiz: 25/25 (100%) -> contributes 20%
    // Exam: 90/100 (90%) -> contributes 45%
    // PT: 45/50 (90%) -> contributes 27%
    // Total weighted: 20 + 45 + 27 = 92% -> A-
    const scores = {
      'asm-1': 25,
      'asm-2': 90,
      'asm-3': 45,
    };

    const summary = computeStudentGradeSummary(student, assessments, scores);

    expect(summary.totalEarnedPoints).toBe(160);
    expect(summary.totalPossiblePoints).toBe(175);
    expect(summary.overallPercentage).toBe(91.4);
    expect(summary.weightedScore).toBe(92);
    expect(summary.letterGrade).toBe('A-');
  });

  it('handles empty scores gracefully', () => {
    const student: StudentItem = {
      id: 'student-2',
      class_id: 'class-1',
      student_id_number: 'STU-002',
      first_name: 'Beatriz',
      last_name: 'Santos',
      gender: 'Female',
      email: null,
      contact_number: null,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const summary = computeStudentGradeSummary(student, [], {});
    expect(summary.totalEarnedPoints).toBe(0);
    expect(summary.totalPossiblePoints).toBe(0);
    expect(summary.overallPercentage).toBe(0);
    expect(summary.weightedScore).toBe(0);
    expect(summary.letterGrade).toBe('F');
  });
});
