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

  const handleAddStudent = (form) => {
    if (!form.studentName.trim()) return;

    const newStudent = {
      name: form.studentName.trim(),
      email: form.email.trim(),
      role: 'student',
      created_at: new Date().toISOString(),
    };

    setProfiles((prev) => [...prev, newStudent]);
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">User Profiles</h2>

        <AddStudent onAddStudent={handleAddStudent} />
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
          {profiles.map((profile, index) => (
            <TableRow key={index}>
              <TableCell>{profile.name || 'N/A'}</TableCell>
              <TableCell>{profile.email || 'N/A'}</TableCell>
              <TableCell>
                <Badge
                  variant={profile.role === 'admin' ? 'destructive' : 'outline'}
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
                    onClick={() =>
                      setProfiles((prev) =>
                        prev.filter((p) => p.id !== profile.id),
                      )
                    }
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageStudent;
