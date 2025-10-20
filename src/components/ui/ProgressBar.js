'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ProgressBar({ 
  value = 0, 
  className, 
  showPercentage = false,
  ...props 
}) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  const getProgressColor = (value) => {
    if (value === 0) return 'bg-gray-600';
    if (value < 50) return 'bg-yellow-500';
    if (value < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', getProgressColor(clampedValue))}
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        {showPercentage && (
          <span className="text-xs text-gray-400 min-w-[3ch] text-right">
            {Math.round(clampedValue)}%
          </span>
        )}
      </div>
    </div>
  );
}