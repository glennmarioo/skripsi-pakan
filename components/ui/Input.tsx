import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 dark:bg-slate-900/50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 ${
              icon ? 'pl-10' : ''
            } ${
              error 
                ? 'border-error-500 focus:ring-error-500 bg-error-50/50 dark:bg-error-500/10' 
                : 'border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs font-medium text-error-600 dark:text-error-400 animate-fade-in-up">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
