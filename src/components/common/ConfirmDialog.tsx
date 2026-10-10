import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex items-start gap-4">
        <div
          className={`rounded-full p-2.5 ${
            isDestructive ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'
          }`}
        >
          <AlertTriangle className="h-6 w-6" />
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed pt-1">{message}</p>
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
            isDestructive
              ? 'bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900'
              : 'bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900'
          }`}
        >
          {isLoading ? 'Processing...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};
