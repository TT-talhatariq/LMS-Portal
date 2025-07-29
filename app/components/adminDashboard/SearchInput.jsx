'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  label = 'Search',
  inputId = 'search',
  ...props
}) => {
  return (
    <div className="relative">
      <Label htmlFor={inputId} className="sr-only">
        {label}
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          id={inputId}
          name={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl shadow-sm focus:shadow-md focus:border-blue-300 focus:ring-blue-100 transition-all duration-200 placeholder:text-slate-400"
          {...props}
        />
      </div>
    </div>
  );
};

export default SearchInput;
