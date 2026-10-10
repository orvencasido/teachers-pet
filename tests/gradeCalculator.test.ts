import { describe, it, expect } from 'vitest';
import {
  calculateLetterGrade,
  computeStudentGradeSummary,
  computeCategoryAverages,
} from '../src/lib/gradeCalculator';
import type { StudentItem, AssessmentItem } from '../src/types';

describe('gradeCalculator', () => {
  const mockStudent: StudentItem = {
    id: 'student-101',
    class_id: 'class-abc',
    student_id_number: 'STU-101',
    first_name: 'John',
    last_name: 'Doe',
    gender: 'Male',
    email: 'john.doe@example.com',
    contact_number: '123-456-7890',
    notes: 'Excels in laboratory tasks',
    created_at: '2026-09-01T08:00:00Z',
    updated_at: '2026-09-01T08:00:00Z',
  };

  describe('calculateLetterGrade boundaries', () => {
    it('returns A+ for percentages 97 and above', () => {
      expect(calculateLetterGrade(100)).toBe('A+');
      expect(calculateLetterGrade(97.5)).toBe('A+');
      expect(calculateLetterGrade(97)).toBe('A+');
    });

    it('returns A for percentages between 93 and 96.99', () => {
      expect(calculateLetterGrade(96.9)).toBe('A');
      expect(calculateLetterGrade(93)).toBe('A');
    });

    it('returns A- for percentages between 90 and 92.99', () => {
      expect(calculateLetterGrade(92.9)).toBe('A-');
      expect(calculateLetterGrade(90)).toBe('A-');
    });

    it('returns B+ for percentages between 87 and 89.99', () => {
      expect(calculateLetterGrade(89.9)).toBe('B+');
      expect(calculateLetterGrade(87)).toBe('B+');
    });

    it('returns B for percentages between 83 and 86.99', () => {
      expect(calculateLetterGrade(86.9)).toBe('B');
      expect(calculateLetterGrade(83)).toBe('B');
    });

    it('returns B- for percentages between 80 and 82.99', () => {
      expect(calculateLetterGrade(82.9)).toBe('B-');
      expect(calculateLetterGrade(80)).toBe('B-');
    });

    it('returns C+ for percentages between 77 and 79.99', () => {
      expect(calculateLetterGrade(79.9)).toBe('C+');
      expect(calculateLetterGrade(77)).toBe('C+');
    });

    it('returns C for percentages between 73 and 76.99', () => {
      expect(calculateLetterGrade(76.9)).toBe('C');
      expect(calculateLetterGrade(73)).toBe('C');
    });

    it('returns C- for percentages between 70 and 72.99', () => {
      expect(calculateLetterGrade(72.9)).toBe('C-');
      expect(calculateLetterGrade(70)).toBe('C-');
    });

    it('returns D+ for percentages between 65 and 69.99', () => {
      expect(calculateLetterGrade(69.9)).toBe('D+');
      expect(calculateLetterGrade(65)).toBe('D+');
    });

    it('returns D for percentages between 60 and 64.99', () => {
      expect(calculateLetterGrade(64.9)).toBe('D');
      expect(calculateLetterGrade(60)).toBe('D');
    });

    it('returns F for percentages below 60, zero, and negative values', () => {
      expect(calculateLetterGrade(59.9)).toBe('F');
      expect(calculateLetterGrade(50)).toBe('F');
      expect(calculateLetterGrade(0)).toBe('F');
      expect(calculateLetterGrade(-5)).toBe('F');
    });
  });

  describe('computeStudentGradeSummary', () => {
    const assessments: AssessmentItem[] = [
      {
        id: 'asm-quiz-1',
        class_id: 'class-abc',
        title: 'Quiz 1',
        type: 'quiz',
        total_points: 20,
        weight_percentage: 20,
        assessment_date: '2026-09-10',
        created_at: '2026-09-01T08:00:00Z',
        updated_at: '2026-09-01T08:00:00Z',
      },
      {
        id: 'asm-exam-1',
        class_id: 'class-abc',
        title: 'Midterm Exam',
        type: 'exam',
        total_points: 100,
        weight_percentage: 50,
        assessment_date: '2026-10-01',
        created_at: '2026-09-01T08:00:00Z',
        updated_at: '2026-09-01T08:00:00Z',
      },
      {
        id: 'asm-task-1',
        class_id: 'class-abc',
        title: 'Science Project',
        type: 'performance_task',
        total_points: 50,
        weight_percentage: 30,
        assessment_date: '2026-10-20',
        created_at: '2026-09-01T08:00:00Z',
        updated_at: '2026-09-01T08:00:00Z',
      },
    ];

    it('computes correctly when all assessments are scored', () => {
      // Quiz: 18/20 = 90% (weighted: 0.9 * 20 = 18)
      // Exam: 85/100 = 85% (weighted: 0.85 * 50 = 42.5)
      // Task: 48/50 = 96% (weighted: 0.96 * 30 = 28.8)
      // Total earned: 18 + 85 + 48 = 151
      // Total possible: 20 + 100 + 50 = 170 -> raw: 88.8%
      // Weighted score: (18 + 42.5 + 28.8) / 100 * 100 = 89.3% -> B+
      const scores = {
        'asm-quiz-1': 18,
        'asm-exam-1': 85,
        'asm-task-1': 48,
      };

      const summary = computeStudentGradeSummary(mockStudent, assessments, scores);
      expect(summary.totalEarnedPoints).toBe(151);
      expect(summary.totalPossiblePoints).toBe(170);
      expect(summary.overallPercentage).toBe(88.8);
      expect(summary.weightedScore).toBe(89.3);
      expect(summary.letterGrade).toBe('B+');
    });

    it('handles weight normalization when only partial assessments are scored', () => {
      // Only Quiz (20% weight) and Task (30% weight) scored:
      // total active weight = 50%
      // Quiz: 20/20 (100%) -> ratio * weight = 1.0 * 20 = 20
      // Task: 40/50 (80%) -> ratio * weight = 0.8 * 30 = 24
      // Total weighted numerator = 44
      // Normalized weightedScore = (44 / 50) * 100 = 88% -> B+
      const scores = {
        'asm-quiz-1': 20,
        'asm-task-1': 40,
      };

      const summary = computeStudentGradeSummary(mockStudent, assessments, scores);
      expect(summary.totalEarnedPoints).toBe(60);
      expect(summary.totalPossiblePoints).toBe(70);
      expect(summary.overallPercentage).toBe(85.7);
      expect(summary.weightedScore).toBe(88);
      expect(summary.letterGrade).toBe('B+');
    });

    it('ignores unscored assessments (missing, undefined, or NaN)', () => {
      const scores = {
        'asm-quiz-1': 15,
        'asm-exam-1': NaN,
      };

      const summary = computeStudentGradeSummary(mockStudent, assessments, scores);
      expect(summary.totalEarnedPoints).toBe(15);
      expect(summary.totalPossiblePoints).toBe(20);
      expect(summary.overallPercentage).toBe(75);
      expect(summary.weightedScore).toBe(75);
      expect(summary.letterGrade).toBe('C');
    });

    it('gracefully handles empty scores or empty assessment list', () => {
      const emptySummary = computeStudentGradeSummary(mockStudent, assessments, {});
      expect(emptySummary.totalEarnedPoints).toBe(0);
      expect(emptySummary.totalPossiblePoints).toBe(0);
      expect(emptySummary.overallPercentage).toBe(0);
      expect(emptySummary.weightedScore).toBe(0);
      expect(emptySummary.letterGrade).toBe('F');

      const noAsmSummary = computeStudentGradeSummary(mockStudent, [], {});
      expect(noAsmSummary.totalEarnedPoints).toBe(0);
      expect(noAsmSummary.totalPossiblePoints).toBe(0);
      expect(noAsmSummary.overallPercentage).toBe(0);
      expect(noAsmSummary.weightedScore).toBe(0);
      expect(noAsmSummary.letterGrade).toBe('F');
    });

    it('handles zero total points edge case without throwing or returning NaN', () => {
      const zeroPointAssessment: AssessmentItem = {
        id: 'asm-bonus',
        class_id: 'class-abc',
        title: 'Zero Point Bonus',
        type: 'quiz',
        total_points: 0,
        weight_percentage: 10,
        assessment_date: '2026-09-12',
        created_at: '2026-09-01T08:00:00Z',
        updated_at: '2026-09-01T08:00:00Z',
      };

      const scores = {
        'asm-bonus': 5,
      };

      const summary = computeStudentGradeSummary(mockStudent, [zeroPointAssessment], scores);
      expect(summary.totalEarnedPoints).toBe(5);
      expect(summary.totalPossiblePoints).toBe(0);
      expect(summary.overallPercentage).toBe(0);
      expect(summary.weightedScore).toBe(0);
      expect(Number.isNaN(summary.overallPercentage)).toBe(false);
      expect(Number.isNaN(summary.weightedScore)).toBe(false);
      expect(summary.letterGrade).toBe('F');
    });

    it('falls back to raw percentage if all assessments have 0% weight', () => {
      const unweightedAssessments: AssessmentItem[] = [
        {
          id: 'asm-u1',
          class_id: 'class-abc',
          title: 'Ungraded Practice 1',
          type: 'quiz',
          total_points: 50,
          weight_percentage: 0,
          assessment_date: '2026-09-15',
          created_at: '2026-09-01T08:00:00Z',
          updated_at: '2026-09-01T08:00:00Z',
        },
        {
          id: 'asm-u2',
          class_id: 'class-abc',
          title: 'Ungraded Practice 2',
          type: 'quiz',
          total_points: 50,
          weight_percentage: 0,
          assessment_date: '2026-09-20',
          created_at: '2026-09-01T08:00:00Z',
          updated_at: '2026-09-01T08:00:00Z',
        },
      ];

      const scores = {
        'asm-u1': 45,
        'asm-u2': 40,
      };

      const summary = computeStudentGradeSummary(mockStudent, unweightedAssessments, scores);
      expect(summary.totalEarnedPoints).toBe(85);
      expect(summary.totalPossiblePoints).toBe(100);
      expect(summary.overallPercentage).toBe(85);
      expect(summary.weightedScore).toBe(85);
      expect(summary.letterGrade).toBe('B');
    });
  });

  describe('computeCategoryAverages', () => {
    const mixedAssessments: AssessmentItem[] = [
      {
        id: 'q1',
        class_id: 'class-abc',
        title: 'Quiz 1',
        type: 'quiz',
        total_points: 20,
        weight_percentage: 10,
        assessment_date: '2026-09-01',
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'q2',
        class_id: 'class-abc',
        title: 'Quiz 2',
        type: 'quiz',
        total_points: 30,
        weight_percentage: 10,
        assessment_date: '2026-09-15',
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'e1',
        class_id: 'class-abc',
        title: 'Midterm',
        type: 'exam',
        total_points: 100,
        weight_percentage: 50,
        assessment_date: '2026-10-01',
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'pt1',
        class_id: 'class-abc',
        title: 'Research Poster',
        type: 'performance_task',
        total_points: 50,
        weight_percentage: 30,
        assessment_date: '2026-10-15',
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
    ];

    it('calculates category-level totals, counts, and percentages accurately', () => {
      const scores = {
        q1: 18, // 18/20
        q2: 27, // 27/30 -> total quiz = 45/50 = 90%
        e1: 92, // 92/100 -> total exam = 92/100 = 92%
        pt1: 45, // 45/50 -> total task = 45/50 = 90%
      };

      const averages = computeCategoryAverages(mixedAssessments, scores);

      expect(averages.quiz.count).toBe(2);
      expect(averages.quiz.earned).toBe(45);
      expect(averages.quiz.possible).toBe(50);
      expect(averages.quiz.percentage).toBe(90);

      expect(averages.exam.count).toBe(1);
      expect(averages.exam.earned).toBe(92);
      expect(averages.exam.possible).toBe(100);
      expect(averages.exam.percentage).toBe(92);

      expect(averages.performance_task.count).toBe(1);
      expect(averages.performance_task.earned).toBe(45);
      expect(averages.performance_task.possible).toBe(50);
      expect(averages.performance_task.percentage).toBe(90);

      // Unused categories
      expect(averages.assignment.count).toBe(0);
      expect(averages.assignment.percentage).toBe(0);
    });

    it('handles categories with missing student scores', () => {
      const scores = {
        q1: 10,
        // q2 not scored
        // e1 not scored
      };

      const averages = computeCategoryAverages(mixedAssessments, scores);
      expect(averages.quiz.count).toBe(1);
      expect(averages.quiz.earned).toBe(10);
      expect(averages.quiz.possible).toBe(20);
      expect(averages.quiz.percentage).toBe(50);

      expect(averages.exam.count).toBe(0);
      expect(averages.exam.earned).toBe(0);
      expect(averages.exam.percentage).toBe(0);
    });
  });
});
