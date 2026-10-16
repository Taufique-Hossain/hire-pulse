import React from 'react';
import { RotateCcw, X, CheckCircle2 } from 'lucide-react';

export default function UndoToast({
  toast,
  onUndo,
  onDismiss
}) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-pop-in">
      <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 text-white border border-emerald-500/40 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3">
        {/* Progress bar countdown line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full animate-splash-progress" 
            style={{ animationDuration: '5s' }}
          />
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="font-medium text-slate-200">
            {toast.message}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onUndo}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold border border-emerald-500/40 cursor-pointer transition active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 cursor-pointer transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
