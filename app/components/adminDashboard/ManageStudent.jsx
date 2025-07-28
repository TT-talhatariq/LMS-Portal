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
import AddStudent from './AddStudent';
import SearchStudent from './SearchStudent';

const initialProfiles = [
  {
    id: '1',
    name: 'Muhammad Afaq',
    email: 'Vzg2b@example.com',
    role: 'student',
    created_at: '2024-06-10T12:34:56.000Z',
  },
  {
    id: '2',
    name: 'Ali Raza',
    email: 'H7dEj@example.com',
    role: 'student',
    created_at: '2024-06-12T09:20:30.000Z',
  },
  {
    id: '3',
    name: 'Sara Khan',
    email: 'TtDl5@example.com',
    role: 'student',
    created_at: '2024-06-15T15:45:00.000Z',
  },
];

const ManageStudent = () => {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddStudent = (form) => {
    if (!form.studentName.trim()) return;

    const newStudent = {
      id: Date.now().toString(), // Ensure unique id
      name: form.studentName.trim(),
      email: form.email.trim(),
      role: 'student',
      created_at: new Date().toISOString(),
    };

    setProfiles((prev) => [...prev, newStudent]);
  };

  const handleDeleteStudent = (id) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredStudents = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">User Profiles</h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <div className="w-full md:w-64">
            <SearchStudent searchTerm={searchTerm} onSearch={setSearchTerm} />
          </div>
          <div className="w-full md:w-auto">
            <AddStudent onAddStudent={handleAddStudent} />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.name || 'N/A'}</TableCell>
                <TableCell>{profile.email || 'N/A'}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      profile.role === 'admin' ? 'destructive' : 'outline'
                    }
                  >
                    {profile.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(profile.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {profile.role === 'student' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteStudent(profile.id)}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No students found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageStudent;
