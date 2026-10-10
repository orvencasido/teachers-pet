import React, { useState } from 'react';
import {
  Plus,
  Save,
  CheckCircle2,
  Trash2,
  Edit2,
  Award,
} from 'lucide-react';
import { StateView } from '../common/StateView';
import { Badge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { AssessmentModal } from './AssessmentModal';
import type {
  AssessmentItem,
  AssessmentInsert,
  AssessmentUpdate,
  AssessmentType,
  StudentItem,
  StudentGradeSummary,
  DataState,
  ClassItem,
} from '../../types';

interface GradebookViewProps {
  assessments: AssessmentItem[];
  filteredAssessments: AssessmentItem[];
  students: StudentItem[];
  studentSummaries: StudentGradeSummary[];
  scoreMatrix: Record<string, Record<string, number>>;
  dirtyCells: Record<string, boolean>;
  hasDirtyCells: boolean;
  status: DataState;
  error: string | null;
  isSaving: boolean;
  filterType: AssessmentType | 'all';
  setFilterType: (type: AssessmentType | 'all') => void;
  onUpdateScore: (studentId: string, assessmentId: string, score: number) => void;
  onSaveIndividualGrade: (studentId: string, assessmentId: string, score: number) => Promise<unknown>;
  onSaveAllDirtyGrades: () => Promise<void>;
  onAddAssessment: (data: Omit<AssessmentInsert, 'class_id'>) => Promise<AssessmentItem>;
  onEditAssessment: (id: string, data: AssessmentUpdate) => Promise<AssessmentItem>;
  onRemoveAssessment: (id: string) => Promise<void>;
  onRetry: () => void;
  currentClass: ClassItem | null;
}

export const GradebookView: React.FC<GradebookViewProps> = ({
  assessments,
  filteredAssessments,
  students,
  studentSummaries,
  scoreMatrix,
  dirtyCells,
  hasDirtyCells,
  status,
  error,
  isSaving,
  filterType,
  setFilterType,
  onUpdateScore,
  onSaveIndividualGrade,
  onSaveAllDirtyGrades,
  onAddAssessment,
  onEditAssessment,
  onRemoveAssessment,
  onRetry,
  currentClass,
}) => {
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [assessmentToEdit, setAssessmentToEdit] = useState<AssessmentItem | null>(null);
  const [assessmentToDelete, setAssessmentToDelete] = useState<AssessmentItem | null>(null);
  const [isDeletingAssessment, setIsDeletingAssessment] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  const handleOpenAddAssessment = () => {
    setAssessmentToEdit(null);
    setIsAssessmentModalOpen(true);
  };

  const handleOpenEditAssessment = (assessment: AssessmentItem) => {
    setAssessmentToEdit(assessment);
    setIsAssessmentModalOpen(true);
  };

  const handleSaveAssessment = async (
    data: Omit<AssessmentInsert, 'class_id'> | AssessmentUpdate
  ) => {
    if (assessmentToEdit) {
      await onEditAssessment(assessmentToEdit.id, data as AssessmentUpdate);
    } else {
      await onAddAssessment(data as Omit<AssessmentInsert, 'class_id'>);
    }
  };

  const handleDeleteAssessmentConfirm = async () => {
    if (!assessmentToDelete) return;
    setIsDeletingAssessment(true);
    try {
      await onRemoveAssessment(assessmentToDelete.id);
      setAssessmentToDelete(null);
    } finally {
      setIsDeletingAssessment(false);
    }
  };

  const handleBatchSave = async () => {
    await onSaveAllDirtyGrades();
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  const getAssessmentTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'indigo';
      case 'exam':
        return 'rose';
      case 'performance_task':
        return 'emerald';
      default:
        return 'zinc';
    }
  };

  const getLetterBadgeVariant = (letter: string) => {
    if (letter.startsWith('A')) return 'emerald';
    if (letter.startsWith('B')) return 'indigo';
    if (letter.startsWith('C')) return 'amber';
    return 'rose';
  };

  return (
    <div className="space-y-6">
      {/* Top Header toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Gradebook Matrix</h2>
            <Badge variant="indigo">{assessments.length} Assessments</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {currentClass
              ? `${currentClass.name} • Batch grade scoring with real-time weighted computations`
              : 'Class assessment and grading matrix'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Pills */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                filterType === 'all'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType('quiz')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                filterType === 'quiz'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Quizzes
            </button>
            <button
              type="button"
              onClick={() => setFilterType('exam')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                filterType === 'exam'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Exams
            </button>
            <button
              type="button"
              onClick={() => setFilterType('performance_task')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                filterType === 'performance_task'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tasks
            </button>
          </div>

          {/* Batch Save Button */}
          {hasDirtyCells && (
            <button
              type="button"
              onClick={handleBatchSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition shadow-sm animate-pulse"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : `Save ${Object.keys(dirtyCells).length} Changes`}</span>
            </button>
          )}

          {saveSuccessMessage && !hasDirtyCells && (
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>Saved!</span>
            </div>
          )}

          {/* New Assessment */}
          <button
            type="button"
            onClick={handleOpenAddAssessment}
            disabled={!currentClass}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition shadow-sm whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Add Assessment</span>
          </button>
        </div>
      </div>

      {/* State View wrapper */}
      <StateView
        status={status}
        error={error}
        onRetry={onRetry}
        emptyTitle="No Assessments Yet"
        emptyMessage="Create your first quiz, exam, or performance task to start recording grades."
        emptyActionLabel="Add Assessment"
        onEmptyAction={handleOpenAddAssessment}
        loadingSkeleton={
          <div className="space-y-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 animate-pulse">
            <div className="h-10 bg-zinc-800/80 rounded-lg w-full" />
            <div className="h-24 bg-zinc-800/40 rounded-lg w-full" />
            <div className="h-24 bg-zinc-800/40 rounded-lg w-full" />
            <div className="h-24 bg-zinc-800/40 rounded-lg w-full" />
          </div>
        }
      >
        {students.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/40 rounded-xl border border-zinc-800 p-6">
            <Award className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
            <p className="text-sm text-zinc-300">
              No students are currently enrolled in this class.
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Add students under the Students tab to enter grades.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900 shadow-sm">
            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-zinc-950 sticky top-0 z-20 border-b border-zinc-800 shadow-sm">
                  <tr>
                    {/* Fixed student name column */}
                    <th
                      scope="col"
                      className="py-3 px-4 sm:px-5 font-semibold text-zinc-200 sticky left-0 bg-zinc-950 z-30 min-w-[190px] border-r border-zinc-800/80"
                    >
                      Student Roster
                    </th>

                    {/* Assessment Columns */}
                    {filteredAssessments.map((assessment) => (
                      <th
                        key={assessment.id}
                        scope="col"
                        className="py-3 px-3 text-center min-w-[140px] border-r border-zinc-800/60"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-1 group">
                            <span className="font-semibold text-zinc-100 truncate max-w-[130px] block" title={assessment.title}>
                              {assessment.title}
                            </span>
                            <div className="hidden group-hover:flex items-center gap-1">
                              <button
                                type="button"
                                title="Edit assessment"
                                onClick={() => handleOpenEditAssessment(assessment)}
                                className="text-zinc-400 hover:text-zinc-200"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                title="Delete assessment"
                                onClick={() => setAssessmentToDelete(assessment)}
                                className="text-zinc-400 hover:text-rose-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <Badge
                              variant={getAssessmentTypeBadgeVariant(assessment.type) as 'indigo'}
                              size="sm"
                            >
                              {assessment.type.replace('_', ' ')}
                            </Badge>
                            <span className="text-[11px] font-mono text-zinc-400">
                              /{assessment.total_points} pts
                            </span>
                            {assessment.weight_percentage > 0 && (
                              <span className="text-[10px] text-zinc-500 font-mono">
                                ({assessment.weight_percentage}%)
                              </span>
                            )}
                          </div>
                        </div>
                      </th>
                    ))}

                    {/* Calculated Summary Headers */}
                    <th
                      scope="col"
                      className="py-3 px-4 text-center min-w-[100px] border-l border-zinc-800/80 bg-zinc-950/90 font-semibold text-zinc-300"
                    >
                      Total Pts
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 text-center min-w-[90px] bg-zinc-950/90 font-semibold text-zinc-300"
                    >
                      Raw %
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 text-center min-w-[100px] bg-zinc-950/90 font-semibold text-zinc-300"
                    >
                      Weighted %
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 text-center min-w-[80px] bg-zinc-950/90 font-semibold text-zinc-300"
                    >
                      Grade
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {studentSummaries.map((summary) => {
                    const student = summary.student;
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-zinc-800/30 transition-colors"
                      >
                        {/* Student Name */}
                        <td className="py-2.5 px-4 sm:px-5 sticky left-0 bg-zinc-900 hover:bg-zinc-850 z-10 border-r border-zinc-800/80 font-medium whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                              {student.first_name[0]}
                              {student.last_name[0]}
                            </div>
                            <div>
                              <span className="text-zinc-100 text-xs sm:text-sm block">
                                {student.last_name}, {student.first_name}
                              </span>
                              <span className="text-[11px] font-mono text-zinc-400">
                                {student.student_id_number || 'No ID'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Assessment Score Input Cells */}
                        {filteredAssessments.map((assessment) => {
                          const score = scoreMatrix[student.id]?.[assessment.id];
                          const scoreVal = score !== undefined ? score : '';
                          const isDirty = dirtyCells[`${student.id}:${assessment.id}`];

                          return (
                            <td
                              key={assessment.id}
                              className="py-2 px-2 text-center border-r border-zinc-800/40"
                            >
                              <div className="flex items-center justify-center">
                                <input
                                  type="number"
                                  min="0"
                                  max={assessment.total_points}
                                  step="any"
                                  value={scoreVal}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? 0 : Number(e.target.value);
                                    onUpdateScore(student.id, assessment.id, val);
                                  }}
                                  onBlur={(e) => {
                                    if (isDirty) {
                                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                                      onSaveIndividualGrade(student.id, assessment.id, val);
                                    }
                                  }}
                                  className={`w-16 rounded-md px-2 py-1 text-center font-mono text-xs sm:text-sm transition ${
                                    isDirty
                                      ? 'border-amber-500 bg-amber-500/10 text-amber-200 ring-1 ring-amber-500'
                                      : 'border border-zinc-800 bg-zinc-950 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                                  }`}
                                />
                              </div>
                            </td>
                          );
                        })}

                        {/* Computed Totals */}
                        <td className="py-2.5 px-4 text-center font-mono text-xs text-zinc-300 border-l border-zinc-800/80 bg-zinc-950/30">
                          {summary.totalEarnedPoints} / {summary.totalPossiblePoints}
                        </td>

                        <td className="py-2.5 px-4 text-center font-mono text-xs text-zinc-300 bg-zinc-950/30">
                          {summary.overallPercentage}%
                        </td>

                        <td className="py-2.5 px-4 text-center font-mono text-xs font-semibold text-zinc-100 bg-zinc-950/30">
                          {summary.weightedScore}%
                        </td>

                        <td className="py-2.5 px-4 text-center bg-zinc-950/30">
                          <Badge
                            variant={getLetterBadgeVariant(summary.letterGrade) as 'emerald'}
                            size="sm"
                          >
                            {summary.letterGrade}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </StateView>

      {/* Modals */}
      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        onSave={handleSaveAssessment}
        assessmentToEdit={assessmentToEdit}
      />

      <ConfirmDialog
        isOpen={Boolean(assessmentToDelete)}
        onClose={() => setAssessmentToDelete(null)}
        onConfirm={handleDeleteAssessmentConfirm}
        title="Delete Assessment"
        message={`Are you sure you want to delete "${assessmentToDelete?.title}"? All student scores recorded for this assessment will be permanently deleted.`}
        confirmLabel="Delete Assessment"
        isDestructive={true}
        isLoading={isDeletingAssessment}
      />
    </div>
  );
};
