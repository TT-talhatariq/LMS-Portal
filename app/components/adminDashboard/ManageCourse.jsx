'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AddCourse from '@/app/components/adminDashboard/AddCourse';
import SearchInput from './SearchInput';

const initialCourses = [
  {
    id: '1',
    title: 'Intro to JavaScript',
    description: 'A basic course on JavaScript fundamentals',
    created_at: '2024-06-10T12:34:56.000Z',
  },
  {
    id: '2',
    title: 'React for Beginners',
    description: 'Learn React from scratch',
    created_at: '2024-06-15T09:20:30.000Z',
  },
  {
    id: '3',
    title: 'Advanced TailwindCSS',
    description: 'Master Tailwind CSS design system',
    created_at: '2024-06-18T15:45:00.000Z',
  },
];

const ManageCourses = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCourse = (form) => {
    if (!form.title.trim()) return;

    const newCourse = {
      id: Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim(),
      created_at: new Date().toISOString(),
    };

    setCourses((prev) => [...prev, newCourse]);
  };

  const handleDeleteCourse = (id) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">Manage Courses</h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <div className="w-full md:w-64">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by course name"
              label="Search Course"
            />
          </div>
          <div className="w-full md:w-auto">
            <AddCourse onAddCourse={handleAddCourse} />
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title || 'N/A'}</TableCell>
                <TableCell>{course.description || 'N/A'}</TableCell>
                <TableCell>
                  {new Date(course.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No courses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageCourses;
