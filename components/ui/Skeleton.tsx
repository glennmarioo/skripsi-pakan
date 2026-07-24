import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
  const baseClass = "animate-pulse bg-slate-200";
  
  let variantClass = "";
  if (variant === 'circular') variantClass = "rounded-full";
  if (variant === 'rectangular') variantClass = "rounded-xl";
  if (variant === 'text') variantClass = "rounded-md h-4 w-full";

  return (
    <div className={`${baseClass} ${variantClass} ${className}`} />
  );
};
