import { cn } from '@/lib/utils';

export default function Textarea({ 
  className, 
  ...props 
}) {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm',
        'placeholder:text-gray-400 text-white resize-vertical',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}