'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AddModules from './AddModules';
import SearchInput from './SearchInput';
import { Home, Calendar, Trash2, BookOpen, Hash } from 'lucide-react';

const courses = [
  { id: '1', title: 'React Basics' },
  { id: '2', title: 'Advanced JavaScript' },
  { id: '3', title: 'UI/UX Design' },
];

const initialModules = [
  {
    id: '1',
    course_id: '1',
    title: 'Module 1: Basics',
    position: 1,
    created_at: '2024-06-10T12:34:56.000Z',
  },
  {
    id: '2',
    course_id: '1',
    title: 'Module 2: Intermediate',
    position: 2,
    created_at: '2024-06-11T09:00:00.000Z',
  },
  {
    id: '3',
    course_id: '2',
    title: 'Advanced Concepts',
    position: 1,
    created_at: '2024-06-13T15:30:00.000Z',
  },
];

const ManageModules = () => {
  const [modules, setModules] = useState(initialModules);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddModule = (form) => {
    const newModule = {
      id: Date.now().toString(),
      ...form,
      created_at: new Date().toISOString(),
    };
    setModules((prev) => [...prev, newModule]);
  };

  const handleDeleteModule = (id) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const filteredModules = modules.filter((module) =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getCourseTitle = (id) =>
    courses.find((c) => c.id === id)?.title || 'Unknown Course';

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-white to-purple-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Manage Modules
              </h1>
              <p className="text-slate-600 text-sm">
                Organize course content into structured modules
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>
              {filteredModules.length} module
              {filteredModules.length !== 1 ? 's' : ''} found
            </span>
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
              placeholder="Search modules by name..."
              label="Search Module"
            />
          </div>
          <AddModules onAddModule={handleAddModule} courses={courses} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800">Module List</h3>
          <p className="text-slate-600 text-sm">
            Manage course modules and their organization
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="font-semibold text-slate-700">
                  Title
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Course
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Position
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Created At
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModules.length > 0 ? (
                filteredModules.map((module) => (
                  <TableRow
                    key={module.id}
                    className="hover:bg-purple-50/30 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                          <Home className="h-4 w-4 text-purple-600" />
                        </div>
                        <span>{module.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-slate-400" />
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {getCourseTitle(module.course_id)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-slate-400" />
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-600 border-slate-200"
                        >
                          {module.position}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-600 border-slate-200"
                      >
                        {new Date(module.created_at).toLocaleDateString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => handleDeleteModule(module.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <Home className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-slate-600 font-medium">
                          No modules found
                        </p>
                        <p className="text-slate-500 text-sm">
                          Try adjusting your search or add a new module
                        </p>
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

export default ManageModules;
