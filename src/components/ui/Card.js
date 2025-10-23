'use client';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const cardVariants = {
  default: 'bg-[#111111] border-white/[0.08] shadow-xl shadow-black/20',
  elevated: 'bg-[#1a1a1a] border-white/[0.12] shadow-2xl shadow-black/40',
  interactive: 'bg-[#111111] border-white/[0.08] shadow-xl shadow-black/20 hover:border-white/[0.12] hover:shadow-2xl hover:shadow-black/30 cursor-pointer',
  glass: 'bg-white/[0.02] backdrop-blur-xl border-white/[0.08] shadow-xl shadow-black/20',
};

const Card = forwardRef(({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  ...props 
}, ref) => {
  const baseClasses = cn(
    // Base card styles
    'rounded-2xl p-6 transition-all duration-300 ease-in-out',
    // Variant styles
    cardVariants[variant],
    // Hover effect if not already included in variant
    hover && variant === 'default' && 'hover:border-white/[0.12] hover:shadow-2xl hover:shadow-black/30',
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