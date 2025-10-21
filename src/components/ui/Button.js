'use client';
// import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const buttonVariants = {
  default: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
  outline: 'border border-gray-600 hover:bg-gray-800 hover:border-gray-500 text-white bg-transparent',
  ghost: 'hover:bg-gray-800 text-gray-300 border-transparent',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
};

const sizeVariants = {
  default: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1.5 text-xs',
  lg: 'px-6 py-3 text-base',
};

export default function Button({ 
  children, 
  variant = 'default', 
  size = 'default',
  className, 
  disabled = false,
  ...props 
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'hover:scale-105 active:scale-95 transition-transform',
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}