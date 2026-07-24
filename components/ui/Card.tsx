import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<"div"> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ className = '', hoverable = false, children, ...props }) => {
  const baseStyles = "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden transition-colors duration-300";
  const hoverStyles = hoverable ? "transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 hover:border-brand-500/30" : "";
  
  return (
    <motion.div 
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
