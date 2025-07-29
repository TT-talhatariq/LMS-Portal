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
import { Badge } from '@/components/ui/badge';
import AddCourse from '@/app/components/adminDashboard/AddCourse';
import SearchInput from './SearchInput';
import { BookOpen, Calendar, Trash2, Plus } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-white to-blue-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Manage Courses
              </h1>
              <p className="text-slate-600 text-sm">Create and manage your educational courses</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>{filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found</span>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search courses by name..."
              label="Search Course"
            />
          </div>
          <AddCourse onAddCourse={handleAddCourse} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800">Course List</h3>
          <p className="text-slate-600 text-sm">Manage all your courses in one place</p>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="font-semibold text-slate-700">Title</TableHead>
                <TableHead className="font-semibold text-slate-700">Description</TableHead>
                <TableHead className="font-semibold text-slate-700">Created At</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell className="font-medium text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <span>{course.title || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 max-w-xs">
                      <div className="truncate" title={course.description}>
                        {course.description || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                        {new Date(course.created_at).toLocaleDateString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-slate-600 font-medium">No courses found</p>
                        <p className="text-slate-500 text-sm">Try adjusting your search or add a new course</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;
