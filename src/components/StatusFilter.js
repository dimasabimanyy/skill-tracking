'use client';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Completed' },
];

export default function StatusFilter({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {filterOptions.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChange(option.value)}
          className={cn(
            'whitespace-nowrap',
            value === option.value ? 'bg-blue-600' : 'text-gray-400'
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}