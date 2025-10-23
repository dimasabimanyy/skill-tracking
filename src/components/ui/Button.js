'use client';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const buttonVariants = {
  // Primary styles
  default: {
    light: 'bg-blue-600 text-white border-transparent hover:bg-blue-700 focus:ring-blue-500/50 shadow-lg shadow-blue-600/20',
    dark: 'bg-blue-600 text-white border-transparent hover:bg-blue-700 focus:ring-blue-500/50 shadow-lg shadow-blue-600/20'
  },
  primary: {
    light: 'bg-blue-600 text-white border-transparent hover:bg-blue-700 focus:ring-blue-500/50 shadow-lg shadow-blue-600/20',
    dark: 'bg-blue-600 text-white border-transparent hover:bg-blue-700 focus:ring-blue-500/50 shadow-lg shadow-blue-600/20'
  },
  
  // Secondary styles
  secondary: {
    light: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:text-gray-900 focus:ring-gray-300/50',
    dark: 'bg-white/[0.05] text-gray-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white focus:ring-white/20'
  },
  outline: {
    light: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-300/50 shadow-sm',
    dark: 'bg-white/[0.05] text-gray-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white focus:ring-white/20'
  },
  
  // Ghost styles
  ghost: {
    light: 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300/50',
    dark: 'bg-transparent text-gray-400 border-transparent hover:bg-white/[0.05] hover:text-white focus:ring-white/10'
  },
  
  // Status styles
  danger: {
    light: 'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500/50 shadow-lg shadow-red-600/20',
    dark: 'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500/50 shadow-lg shadow-red-600/20'
  },
  success: {
    light: 'bg-green-600 text-white border-transparent hover:bg-green-700 focus:ring-green-500/50 shadow-lg shadow-green-600/20',
    dark: 'bg-green-600 text-white border-transparent hover:bg-green-700 focus:ring-green-500/50 shadow-lg shadow-green-600/20'
  },
};

const sizeVariants = {
  xs: 'px-2.5 py-1.5 text-xs font-medium',
  sm: 'px-3 py-2 text-sm font-medium',
  default: 'px-4 py-2.5 text-sm font-medium',
  md: 'px-4 py-2.5 text-sm font-medium',
  lg: 'px-6 py-3 text-base font-medium',
  xl: 'px-8 py-4 text-lg font-medium',
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
    // Base styles
    'inline-flex items-center justify-center gap-2 rounded-xl border font-medium',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    theme === 'light' ? 'focus:ring-offset-white' : 'focus:ring-offset-[#0a0a0a]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
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
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.1 }}
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