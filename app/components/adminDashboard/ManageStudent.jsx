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
import SearchInput from './SearchInput';
import { Users, Calendar, Trash2, Mail, User } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

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
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleAddStudent = (form) => {
    if (!form.studentName.trim()) return;

    const newStudent = {
      id: Date.now().toString(),
      name: form.studentName.trim(),
      email: form.email.trim(),
      role: 'student',
      created_at: new Date().toISOString(),
    };

    setProfiles((prev) => [...prev, newStudent]);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setProfiles(
      profiles.filter((student) => student.id !== studentToDelete.id),
    );
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const filteredStudents = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-white to-green-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Manage Students
                </h1>
                <p className="text-slate-600 text-sm">
                  Manage student profiles and accounts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="h-4 w-4" />
              <span>
                {filteredStudents.length} student
                {filteredStudents.length !== 1 ? 's' : ''} found
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
                placeholder="Search students by name..."
                label="Search Student"
              />
            </div>
            <AddStudent onAddStudent={handleAddStudent} />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-800">
              Student Profiles
            </h3>
            <p className="text-slate-600 text-sm">
              View and manage all student accounts
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="font-semibold text-slate-700">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Role
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
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((profile) => (
                    <TableRow
                      key={profile.id}
                      className="hover:bg-green-50/30 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                            <User className="h-4 w-4 text-indigo-600" />
                          </div>
                          <span>{profile.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span>{profile.email || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            profile.role === 'admin' ? 'destructive' : 'outline'
                          }
                          className={
                            profile.role === 'admin'
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }
                        >
                          {profile.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-600 border-slate-200"
                        >
                          {new Date(profile.created_at).toLocaleDateString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {profile.role === 'student' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(profile)}
                            className="hover:bg-red-50 cursor-pointer hover:border-red-200 hover:text-red-600 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <Users className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-slate-600 font-medium">
                            No students found
                          </p>
                          <p className="text-slate-500 text-sm">
                            Try adjusting your search or add a new student
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
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Student"
        description={`Are you sure you want to delete "${studentToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
};

export default ManageStudent;
