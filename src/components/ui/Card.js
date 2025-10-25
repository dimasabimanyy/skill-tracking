'use client';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const cardVariants = {
  default: {
    light: 'surface-base',
    dark: 'surface-base'
  },
  elevated: {
    light: 'surface-elevated',
    dark: 'surface-elevated'
  },
  interactive: {
    light: 'surface-base hover-lift cursor-pointer hover:border-gray-300',
    dark: 'surface-base hover-lift cursor-pointer hover:border-neutral-700'
  },
  glass: {
    light: 'bg-white/80 backdrop-blur-xl border border-gray-200/60 shadow-sm',
    dark: 'bg-neutral-950/80 backdrop-blur-xl border border-neutral-800/60 shadow-sm'
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
    // Base card styles - warm and inviting
    'rounded-xl p-6 transition-all duration-200 ease-out',
    // Variant styles
    cardVariants[variant]?.[theme] || cardVariants[variant],
    // Hover effect if not already included in variant
    hover && variant === 'default' && 'hover-lift',
    // Custom classes
    className
  );

  if (hover || variant === 'interactive') {
    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        whileHover={{ 
          y: -1,
          transition: { duration: 0.15, ease: "easeOut" }
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