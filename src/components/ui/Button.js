'use client';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const buttonVariants = {
  // Primary - confident, decisive action
  default: {
    light: 'bg-neutral-900 text-white border-transparent hover:bg-neutral-800 focus:ring-neutral-500/30 shadow-sm',
    dark: 'bg-white text-neutral-900 border-transparent hover:bg-neutral-100 focus:ring-white/30 shadow-sm'
  },
  primary: {
    light: 'bg-neutral-900 text-white border-transparent hover:bg-neutral-800 focus:ring-neutral-500/30 shadow-sm',
    dark: 'bg-white text-neutral-900 border-transparent hover:bg-neutral-100 focus:ring-white/30 shadow-sm'
  },
  
  // Secondary - subtle, supportive
  secondary: {
    light: 'bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200 hover:text-neutral-900 focus:ring-neutral-300/50',
    dark: 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 hover:text-white focus:ring-neutral-600/50'
  },
  outline: {
    light: 'bg-transparent text-neutral-700 border border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus:ring-neutral-300/50',
    dark: 'bg-transparent text-neutral-300 border border-neutral-700 hover:bg-neutral-800 hover:text-white focus:ring-neutral-600/50'
  },
  
  // Ghost - minimal, unobtrusive
  ghost: {
    light: 'bg-transparent text-neutral-600 border-transparent hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-300/50',
    dark: 'bg-transparent text-neutral-400 border-transparent hover:bg-neutral-800 hover:text-white focus:ring-neutral-600/50'
  },
  
  // Status styles - only when needed
  danger: {
    light: 'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500/30 shadow-sm',
    dark: 'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500/30 shadow-sm'
  },
  success: {
    light: 'bg-green-600 text-white border-transparent hover:bg-green-700 focus:ring-green-500/30 shadow-sm',
    dark: 'bg-green-600 text-white border-transparent hover:bg-green-700 focus:ring-green-500/30 shadow-sm'
  },
};

const sizeVariants = {
  xs: 'px-2 py-1 text-xs font-medium',
  sm: 'px-3 py-1.5 text-sm font-medium',
  default: 'px-4 py-2 text-sm font-medium',
  md: 'px-4 py-2 text-sm font-medium',
  lg: 'px-5 py-2.5 text-sm font-medium',
  xl: 'px-6 py-3 text-base font-medium',
};

const Button = forwardRef(({ 
  children, 
  variant = 'default', 
  size = 'default',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}, ref) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;
  
  const baseClasses = cn(
    // Base styles - warmer and more inviting
    'inline-flex items-center justify-center gap-2 rounded-full border font-medium',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    theme === 'light' ? 'focus:ring-offset-white' : 'focus:ring-offset-[#0a0a0a]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'shadow-sm hover:shadow-md',
    // Variant styles
    buttonVariants[variant]?.[theme] || buttonVariants[variant],
    // Size styles
    sizeVariants[size],
    // Custom classes
    className
  );

  const MotionButton = motion.button;

  return (
    <MotionButton
      ref={ref}
      className={baseClasses}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15, ease: "easeOut" }}
      {...props}
    >
      {loading && (
        <Loader2 size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} className="animate-spin" />
      )}
      {children}
    </MotionButton>
  );
});

Button.displayName = 'Button';

export default Button;