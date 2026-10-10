import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Clock,
  Calendar,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  FileEdit,
  CheckCheck,
} from 'lucide-react';
import { StateView } from '../common/StateView';
import { Badge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { LessonPlanModal } from './LessonPlanModal';
import { LessonPlanDetailsModal } from './LessonPlanDetailsModal';
import type {
  LessonPlanItem,
  LessonPlanInsert,
  LessonPlanUpdate,
  LessonPlanStatus,
  DataState,
  ClassItem,
} from '../../types';

interface LessonPlansViewProps {
  lessonPlans: LessonPlanItem[];
  filteredPlans: LessonPlanItem[];
  plansByStatus: {
    draft: LessonPlanItem[];
    ready: LessonPlanItem[];
    completed: LessonPlanItem[];
  };
  units: string[];
  status: DataState;
  error: string | null;
  filterStatus: LessonPlanStatus | 'all';
  setFilterStatus: (s: LessonPlanStatus | 'all') => void;
  filterUnit: string | 'all';
  setFilterUnit: (u: string | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddPlan: (data: Omit<LessonPlanInsert, 'class_id'>) => Promise<LessonPlanItem>;
  onEditPlan: (id: string, data: LessonPlanUpdate) => Promise<LessonPlanItem>;
  onRemovePlan: (id: string) => Promise<void>;
  onRetry: () => void;
  currentClass: ClassItem | null;
}

export const LessonPlansView: React.FC<LessonPlansViewProps> = ({
  lessonPlans,
  filteredPlans,
  plansByStatus,
  units,
  status,
  error,
  filterStatus,
  setFilterStatus,
  filterUnit,
  setFilterUnit,
  searchQuery,
  setSearchQuery,
  onAddPlan,
  onEditPlan,
  onRemovePlan,
  onRetry,
  currentClass,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<LessonPlanItem | null>(null);
  const [selectedPlanForDetails, setSelectedPlanForDetails] = useState<LessonPlanItem | null>(null);
  const [planToDelete, setPlanToDelete] = useState<LessonPlanItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setPlanToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: LessonPlanItem) => {
    setPlanToEdit(plan);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Omit<LessonPlanInsert, 'class_id'> | LessonPlanUpdate) => {
    if (planToEdit) {
      await onEditPlan(planToEdit.id, data as LessonPlanUpdate);
    } else {
      await onAddPlan(data as Omit<LessonPlanInsert, 'class_id'>);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    setIsDeleting(true);
    try {
      await onRemovePlan(planToDelete.id);
      setPlanToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeVariant = (s: string) => {
    switch (s) {
      case 'ready':
        return 'emerald';
      case 'completed':
        return 'indigo';
      case 'draft':
      default:
        return 'zinc';
    }
  };

  const renderPlanCard = (plan: LessonPlanItem) => (
    <div
      key={plan.id}
      className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col justify-between space-y-3 group shadow-sm"
    >
      <div className="space-y-2">
        {/* Badges row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={getStatusBadgeVariant(plan.status) as 'zinc'} size="sm">
              {plan.status.toUpperCase()}
            </Badge>
            {plan.unit && <Badge variant="indigo" size="sm">{plan.unit}</Badge>}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              type="button"
              onClick={() => setSelectedPlanForDetails(plan)}
              title="View full lesson plan"
              className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenEdit(plan)}
              title="Edit lesson plan"
              className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPlanToDelete(plan)}
              title="Delete lesson plan"
              className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-semibold text-zinc-100 leading-snug">
          {plan.title}
        </h4>

        {/* Objectives excerpt */}
        {plan.objectives && (
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {plan.objectives}
          </p>
        )}
      </div>

      {/* Footer metadata */}
      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-zinc-500" />
          <span>{plan.duration_minutes}m</span>
        </div>

        {plan.target_date && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            <span>{plan.target_date}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setSelectedPlanForDetails(plan)}
          className="text-indigo-400 hover:text-indigo-300 font-medium"
        >
          Details &rarr;
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Lesson Planning</h2>
            <Badge variant="indigo">{lessonPlans.length} Plans</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {currentClass
              ? `${currentClass.name} • Curriculum outlines, learning objectives, and procedures`
              : 'Structured lesson planning and curriculum roadmap'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-500 transition shadow-sm whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>New Lesson Plan</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="h-4 w-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by title, unit, or keywords..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-1.5 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Unit selector */}
          {units.length > 0 && (
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Units</option>
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          )}

          {/* Status filters */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                filterStatus === 'all'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('draft')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                filterStatus === 'draft'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Draft ({plansByStatus.draft.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('ready')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                filterStatus === 'ready'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ready ({plansByStatus.ready.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('completed')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                filterStatus === 'completed'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Done ({plansByStatus.completed.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Lesson Plans Display */}
      <StateView
        status={status}
        error={error}
        onRetry={onRetry}
        emptyTitle="No Lesson Plans Found"
        emptyMessage="Create structured lesson plans with objectives, procedures, and materials to streamline your classes."
        emptyActionLabel="Create First Lesson Plan"
        onEmptyAction={handleOpenAdd}
        loadingSkeleton={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            <div className="h-44 bg-zinc-900 rounded-xl border border-zinc-800" />
            <div className="h-44 bg-zinc-900 rounded-xl border border-zinc-800" />
            <div className="h-44 bg-zinc-900 rounded-xl border border-zinc-800" />
          </div>
        }
      >
        {filteredPlans.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/40 rounded-xl border border-zinc-800 p-6">
            <BookOpen className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
            <p className="text-sm text-zinc-300">
              No lesson plans match your current filters.
            </p>
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterUnit('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Reset all filters
            </button>
          </div>
        ) : filterStatus === 'all' ? (
          /* Kanban / Grouped by status view */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ready to Teach */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-emerald-500/30">
                <span className="text-xs font-bold tracking-wide uppercase text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Ready to Teach
                </span>
                <Badge variant="emerald" size="sm">{plansByStatus.ready.length}</Badge>
              </div>
              <div className="space-y-3">
                {plansByStatus.ready.length === 0 ? (
                  <p className="text-xs text-zinc-600 italic py-4 text-center">No ready plans</p>
                ) : (
                  plansByStatus.ready.map(renderPlanCard)
                )}
              </div>
            </div>

            {/* In Draft */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-zinc-700">
                <span className="text-xs font-bold tracking-wide uppercase text-zinc-300 flex items-center gap-1.5">
                  <FileEdit className="h-4 w-4" />
                  Drafts & In Progress
                </span>
                <Badge variant="zinc" size="sm">{plansByStatus.draft.length}</Badge>
              </div>
              <div className="space-y-3">
                {plansByStatus.draft.length === 0 ? (
                  <p className="text-xs text-zinc-600 italic py-4 text-center">No drafts</p>
                ) : (
                  plansByStatus.draft.map(renderPlanCard)
                )}
              </div>
            </div>

            {/* Completed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-indigo-500/30">
                <span className="text-xs font-bold tracking-wide uppercase text-indigo-400 flex items-center gap-1.5">
                  <CheckCheck className="h-4 w-4" />
                  Completed Units
                </span>
                <Badge variant="indigo" size="sm">{plansByStatus.completed.length}</Badge>
              </div>
              <div className="space-y-3">
                {plansByStatus.completed.length === 0 ? (
                  <p className="text-xs text-zinc-600 italic py-4 text-center">No completed plans</p>
                ) : (
                  plansByStatus.completed.map(renderPlanCard)
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Filtered flat list / grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlans.map(renderPlanCard)}
          </div>
        )}
      </StateView>

      {/* Modals */}
      <LessonPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        planToEdit={planToEdit}
        currentClass={currentClass}
      />

      <LessonPlanDetailsModal
        isOpen={Boolean(selectedPlanForDetails)}
        onClose={() => setSelectedPlanForDetails(null)}
        plan={selectedPlanForDetails}
        onEdit={(plan) => handleOpenEdit(plan)}
      />

      <ConfirmDialog
        isOpen={Boolean(planToDelete)}
        onClose={() => setPlanToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lesson Plan"
        message={`Are you sure you want to delete "${planToDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete Plan"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
