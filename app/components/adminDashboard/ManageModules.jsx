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
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">Manage Modules</h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <div className="w-full md:w-64">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by module name"
              label="Search Module"
            />
          </div>
          <AddModules onAddModule={handleAddModule} courses={courses} />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredModules.length > 0 ? (
            filteredModules.map((module) => (
              <TableRow key={module.id}>
                <TableCell>{module.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getCourseTitle(module.course_id)}
                  </Badge>
                </TableCell>
                <TableCell>{module.position}</TableCell>
                <TableCell>
                  {new Date(module.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => handleDeleteModule(module.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No modules found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageModules;
