import { cn } from '@/lib/utils';

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg',
        'hover:border-gray-600 transition-colors duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}