import React from 'react';
import { AlertCircle, RefreshCw, PlusCircle, Inbox } from 'lucide-react';
import type { DataState } from '../../types';

interface StateViewProps {
  status: DataState;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  loadingSkeleton?: React.ReactNode;
  children: React.ReactNode;
}

export const StateView: React.FC<StateViewProps> = ({
  status,
  error,
  onRetry,
  emptyTitle = 'No records found',
  emptyMessage = 'Get started by creating your first entry.',
  emptyActionLabel,
  onEmptyAction,
  loadingSkeleton,
  children,
}) => {
  if (status === 'loading') {
    if (loadingSkeleton) {
      return <>{loadingSkeleton}</>;
    }
    return (
      <div className="space-y-4 animate-pulse p-6">
        <div className="h-10 bg-zinc-800/60 rounded-lg w-full" />
        <div className="h-20 bg-zinc-800/40 rounded-lg w-full" />
        <div className="h-20 bg-zinc-800/40 rounded-lg w-full" />
        <div className="h-20 bg-zinc-800/40 rounded-lg w-full" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-8 text-center my-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/30 text-red-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-zinc-100">Unable to load data</h3>
        <p className="mt-1 text-sm text-zinc-400 max-w-md mx-auto">
          {error || 'An unexpected error occurred while communicating with the database.'}
        </p>
        {onRetry && (
          <div className="mt-6">
            <button
              onClick={onRetry}
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        )}
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-12 text-center my-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-medium text-zinc-100">{emptyTitle}</h3>
        <p className="mt-1 text-sm text-zinc-400 max-w-sm mx-auto">{emptyMessage}</p>
        {emptyActionLabel && onEmptyAction && (
          <div className="mt-6">
            <button
              onClick={onEmptyAction}
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              {emptyActionLabel}
            </button>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
