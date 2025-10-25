'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const badgeVariants = {
  // Status variants - refined, minimal
  gray: {
    light: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    dark: 'bg-neutral-800 text-neutral-300 border-neutral-700'
  },
  yellow: {
    light: 'bg-amber-50 text-amber-700 border-amber-200',
    dark: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
  },
  green: {
    light: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dark: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
  },
  red: {
    light: 'bg-red-50 text-red-700 border-red-200',
    dark: 'bg-red-500/10 text-red-300 border-red-500/20'
  },
  blue: {
    light: 'bg-blue-50 text-blue-700 border-blue-200',
    dark: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
  },
  
  // Special variants - more restrained
  primary: {
    light: 'bg-neutral-900 text-white border-transparent',
    dark: 'bg-white text-neutral-900 border-transparent'
  },
  secondary: {
    light: 'bg-transparent text-neutral-600 border-neutral-200',
    dark: 'bg-transparent text-neutral-400 border-neutral-700'
  },
  outline: {
    light: 'bg-transparent text-neutral-600 border-neutral-300',
    dark: 'bg-transparent text-neutral-400 border-neutral-600'
  },
};

const sizeVariants = {
  xs: 'px-1.5 py-0.5 text-xs font-medium',
  sm: 'px-2 py-0.5 text-xs font-medium',
  md: 'px-2.5 py-1 text-sm font-medium',
  lg: 'px-3 py-1 text-sm font-medium',
};

export default function Badge({ 
  children, 
  variant = 'gray', 
  size = 'sm',
  className = '',
  animate = false,
  ...props 
}) {
  const { theme } = useTheme();

  const baseClasses = cn(
    'inline-flex items-center gap-1 rounded-md border font-medium transition-all duration-200',
    badgeVariants[variant]?.[theme] || badgeVariants[variant],
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