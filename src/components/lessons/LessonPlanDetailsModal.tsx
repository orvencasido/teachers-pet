import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Calendar,
  Clock,
  Target,
  Layers,
  CheckCircle,
  HelpCircle,
  FileText,
} from 'lucide-react';
import type { LessonPlanItem, LessonPlanStatus } from '../../types';

interface LessonPlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: LessonPlanItem | null;
  onEdit: (plan: LessonPlanItem) => void;
}

export const LessonPlanDetailsModal: React.FC<LessonPlanDetailsModalProps> = ({
  isOpen,
  onClose,
  plan,
  onEdit,
}) => {
  if (!plan) return null;

  const getStatusBadgeVariant = (status: LessonPlanStatus) => {
    switch (status) {
      case 'ready':
        return 'emerald';
      case 'completed':
        return 'indigo';
      case 'draft':
      default:
        return 'zinc';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plan.title}
      description={`${plan.subject} • Grade ${plan.grade_level}`}
      maxWidth="2xl"
    >
      <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
        {/* Meta badges strip */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-zinc-800/80">
          <Badge variant={getStatusBadgeVariant(plan.status as LessonPlanStatus)}>
            {plan.status.toUpperCase()}
          </Badge>
          {plan.unit && <Badge variant="indigo">{plan.unit}</Badge>}
          <div className="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-950/60 px-2.5 py-1 rounded-md border border-zinc-800">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span>{plan.duration_minutes} mins</span>
          </div>
          {plan.target_date && (
            <div className="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-950/60 px-2.5 py-1 rounded-md border border-zinc-800">
              <Calendar className="h-3.5 w-3.5 text-zinc-500" />
              <span>{plan.target_date}</span>
            </div>
          )}
        </div>

        {/* Learning Objectives */}
        <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Target className="h-4 w-4" />
            <span>Learning Objectives</span>
          </div>
          <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
            {plan.objectives || 'No specific objectives noted.'}
          </p>
        </div>

        {/* Required Materials */}
        <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Layers className="h-4 w-4" />
            <span>Materials & Equipment</span>
          </div>
          <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {plan.materials || 'Standard classroom materials.'}
          </p>
        </div>

        {/* Step-by-step Procedure */}
        <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            <span>Procedure & Activities</span>
          </div>
          <div className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/60">
            {plan.procedure || 'No detailed procedure recorded.'}
          </div>
        </div>

        {/* Assessment & Evaluation */}
        <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <HelpCircle className="h-4 w-4" />
            <span>Assessment & Rubric</span>
          </div>
          <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {plan.assessment || 'Formative check / observation.'}
          </p>
        </div>

        {/* Follow-up Notes */}
        {plan.notes && (
          <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <FileText className="h-4 w-4" />
              <span>Notes & Adaptations</span>
            </div>
            <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {plan.notes}
            </p>
          </div>
        )}

        {/* Modal actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80 sticky bottom-0 bg-zinc-900 py-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(plan);
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition shadow-sm"
          >
            Edit Lesson Plan
          </button>
        </div>
      </div>
    </Modal>
  );
};
