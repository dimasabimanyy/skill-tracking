import { cn } from '@/lib/utils';

const badgeVariants = {
  gray: 'bg-gray-700 text-gray-300 border-gray-600',
  yellow: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  green: 'bg-green-900/50 text-green-300 border-green-700',
  red: 'bg-red-900/50 text-red-300 border-red-700',
  blue: 'bg-blue-900/50 text-blue-300 border-blue-700',
};

export default function Badge({ 
  children, 
  variant = 'gray', 
  className, 
  ...props 
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}