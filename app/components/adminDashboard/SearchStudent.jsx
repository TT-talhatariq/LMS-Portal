'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SearchStudent = ({ searchTerm, onSearch }) => {
  return (
    <div>
      <Label htmlFor="search" className="sr-only">
        Search Student
      </Label>
      <Input
        id="search"
        name="search"
        type="text"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by student name"
        className="w-full"
      />
    </div>
  );
};

export default SearchStudent;
