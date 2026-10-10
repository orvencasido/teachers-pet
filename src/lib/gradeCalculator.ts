import type { AssessmentItem, StudentItem, StudentGradeSummary, AssessmentType } from '../types';

export function calculateLetterGrade(percentage: number): string {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 65) return 'D+';
  if (percentage >= 60) return 'D';
  return 'F';
}

export function computeStudentGradeSummary(
  student: StudentItem,
  assessments: AssessmentItem[],
  studentScores: Record<string, number> = {}
): StudentGradeSummary {
  let totalEarned = 0;
  let totalPossible = 0;
  let weightedNumerator = 0;
  let totalWeight = 0;

  assessments.forEach((assessment) => {
    const score = studentScores[assessment.id];
    if (typeof score === 'number' && !isNaN(score)) {
      totalEarned += score;
      totalPossible += assessment.total_points;

      if (assessment.weight_percentage > 0 && assessment.total_points > 0) {
        const ratio = score / assessment.total_points;
        weightedNumerator += ratio * assessment.weight_percentage;
        totalWeight += assessment.weight_percentage;
      }
    }
  });

  const overallPercentage = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;
  const weightedScore = totalWeight > 0 ? (weightedNumerator / totalWeight) * 100 : overallPercentage;
  const letterGrade = calculateLetterGrade(weightedScore);

  return {
    student,
    grades: studentScores,
    totalEarnedPoints: totalEarned,
    totalPossiblePoints: totalPossible,
    overallPercentage: Math.round(overallPercentage * 10) / 10,
    weightedScore: Math.round(weightedScore * 10) / 10,
    letterGrade,
  };
}

export interface CategoryAverage {
  earned: number;
  possible: number;
  percentage: number;
  count: number;
}

export function computeCategoryAverages(
  assessments: AssessmentItem[],
  studentScores: Record<string, number> = {}
): Record<AssessmentType, CategoryAverage> {
  const categories: AssessmentType[] = ['quiz', 'exam', 'performance_task', 'assignment', 'project'];
  const result = {} as Record<AssessmentType, CategoryAverage>;

  categories.forEach((cat) => {
    result[cat] = { earned: 0, possible: 0, percentage: 0, count: 0 };
  });

  assessments.forEach((assessment) => {
    const type = assessment.type as AssessmentType;
    if (result[type]) {
      const score = studentScores[assessment.id];
      if (typeof score === 'number' && !isNaN(score)) {
        result[type].earned += score;
        result[type].possible += assessment.total_points;
        result[type].count += 1;
      }
    }
  });

  categories.forEach((type) => {
    const cat = result[type];
    cat.percentage = cat.possible > 0 ? Math.round((cat.earned / cat.possible) * 1000) / 10 : 0;
  });

  return result;
}

