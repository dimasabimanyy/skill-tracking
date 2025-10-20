'use client';
import { Search } from 'lucide-react';
import Input from '@/components/ui/Input';

export default function SearchBar({ value, onChange, placeholder = "Search skills..." }) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}