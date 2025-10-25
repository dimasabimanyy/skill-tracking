import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

export default function Input({ 
  className, 
  type = 'text', 
  ...props 
}) {
  const { theme } = useTheme();
  
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-lg border px-3 py-2 text-sm font-medium',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Theme styles
        theme === 'light' 
          ? 'bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500/30 focus:ring-offset-white'
          : 'bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-neutral-500/30 focus:ring-offset-[#0a0a0a]',
        className
      )}
      {...props}
    />
  );
}