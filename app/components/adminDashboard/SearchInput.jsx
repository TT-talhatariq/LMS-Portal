'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  label = 'Search',
  inputId = 'search',
  ...props
}) => {
  return (
    <div>
      <Label htmlFor={inputId} className="sr-only">
        {label}
      </Label>
      <Input
        id={inputId}
        name={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
        {...props}
      />
    </div>
  );
};

export default SearchInput;