import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCRM();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
            case 'error':
              return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
            default:
              return <Info className="w-4 h-4 text-indigo-500 shrink-0" />;
          }
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-3 flex items-start justify-between gap-3 text-xs animate-in slide-in-from-bottom-2 fade-in"
          >
            <div className="flex items-start gap-2.5">
              {getIcon()}
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{toast.title}</p>
                {toast.message && <p className="text-slate-500 dark:text-slate-400 mt-0.5">{toast.message}</p>}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
