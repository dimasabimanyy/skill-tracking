'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const badgeVariants = {
  // Status variants
  gray: 'bg-white/[0.05] text-gray-300 border-white/[0.08] shadow-sm',
  yellow: 'bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-sm shadow-amber-500/10',
  green: 'bg-green-500/10 text-green-300 border-green-500/20 shadow-sm shadow-green-500/10',
  red: 'bg-red-500/10 text-red-300 border-red-500/20 shadow-sm shadow-red-500/10',
  blue: 'bg-blue-500/10 text-blue-300 border-blue-500/20 shadow-sm shadow-blue-500/10',
  
  // Special variants
  primary: 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20',
  secondary: 'bg-white/[0.08] text-white border-white/[0.12] shadow-sm',
  outline: 'bg-transparent text-gray-300 border-white/[0.20]',
};

const sizeVariants = {
  xs: 'px-1.5 py-0.5 text-xs font-medium',
  sm: 'px-2 py-1 text-xs font-medium',
  md: 'px-2.5 py-1 text-sm font-medium',
  lg: 'px-3 py-1.5 text-sm font-medium',
};

export default function Badge({ 
  children, 
  variant = 'gray', 
  size = 'sm',
  className = '',
  animate = false,
  ...props 
}) {
  const baseClasses = cn(
    'inline-flex items-center gap-1 rounded-lg border font-medium transition-all duration-200',
    badgeVariants[variant],
    sizeVariants[size],
    className
  );

  if (animate) {
    return (
      <motion.span
        className={baseClasses}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        {...props}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={baseClasses} {...props}>
      {children}
    </span>
  );
}