import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'brand', 
  size = 'md',
  className = '', 
  ...props 
}) => {
  const variants = {
    brand: "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20",
    success: "bg-success-50 dark:bg-success-500/10 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-500/20",
    warning: "bg-warning-50 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400 border border-warning-200 dark:border-warning-500/20",
    error: "bg-error-50 dark:bg-error-500/10 text-error-700 dark:text-error-400 border border-error-200 dark:border-error-500/20",
    info: "bg-info-50 dark:bg-info-500/10 text-info-700 dark:text-info-400 border border-info-200 dark:border-info-500/20",
    neutral: "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
