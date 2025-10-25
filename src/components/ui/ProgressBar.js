'use client';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

export default function ProgressBar({ 
  value = 0, 
  className, 
  showPercentage = false,
  ...props 
}) {
  const { theme } = useTheme();
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  const getProgressColor = (value) => {
    if (value === 0) return theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-700';
    if (value < 50) return 'bg-amber-500';
    if (value < 100) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  const getTrackColor = () => {
    return theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800';
  };

  const getTextColor = () => {
    return theme === 'light' ? 'text-neutral-600' : 'text-neutral-400';
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="flex items-center gap-3">
        <div className={cn('flex-1 rounded-full h-2 overflow-hidden', getTrackColor())}>
          <div
            className={cn('h-full rounded-full transition-all duration-500 ease-out', getProgressColor(clampedValue))}
            style={{ width: `${clampedValue}%` }}
          />
        </div>
        {showPercentage && (
          <span className={cn('text-xs font-medium min-w-[3ch] text-right', getTextColor())}>
            {Math.round(clampedValue)}%
          </span>
        )}
      </div>
    </div>
  );
}