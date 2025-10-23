'use client';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const cardVariants = {
  default: {
    light: 'bg-white border border-gray-200 shadow-md shadow-gray-200/50',
    dark: 'bg-[#111111] border border-white/[0.08] shadow-xl shadow-black/20'
  },
  elevated: {
    light: 'bg-white border border-gray-200 shadow-lg shadow-gray-300/60',
    dark: 'bg-[#1a1a1a] border border-white/[0.12] shadow-2xl shadow-black/40'
  },
  interactive: {
    light: 'bg-white border border-gray-200 shadow-md shadow-gray-200/50 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-300/60 cursor-pointer',
    dark: 'bg-[#111111] border border-white/[0.08] shadow-xl shadow-black/20 hover:border-white/[0.12] hover:shadow-2xl hover:shadow-black/30 cursor-pointer'
  },
  glass: {
    light: 'bg-white/80 backdrop-blur-xl border border-gray-200/60 shadow-md shadow-gray-200/40',
    dark: 'bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-xl shadow-black/20'
  },
};

const Card = forwardRef(({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  ...props 
}, ref) => {
  const { theme } = useTheme();

  const baseClasses = cn(
    // Base card styles
    'rounded-2xl p-6 transition-all duration-300 ease-in-out',
    // Variant styles
    cardVariants[variant]?.[theme] || cardVariants[variant],
    // Hover effect if not already included in variant
    hover && variant === 'default' && (
      theme === 'light' 
        ? 'hover:border-gray-300 hover:shadow-lg hover:shadow-gray-300/60'
        : 'hover:border-white/[0.12] hover:shadow-2xl hover:shadow-black/30'
    ),
    // Custom classes
    className
  );

  if (hover || variant === 'interactive') {
    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        whileHover={{ 
          y: -2,
          transition: { duration: 0.2, ease: "easeInOut" }
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      ref={ref}
      className={baseClasses}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;