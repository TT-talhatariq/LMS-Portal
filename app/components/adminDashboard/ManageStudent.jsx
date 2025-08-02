'use client';

import { useState, useEffect, useTransition } from 'react';
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
import {
  Users,
  Calendar,
  Trash2,
  Mail,
  User,
  Loader2,
  BookOpen,
  Edit3,
} from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { getStudents, addStudent, deleteStudent } from '@/lib/actions/students';
import { toast } from 'sonner';
import LoadingSkeleton from '../common/LoadingSkeleton';

const ManageStudent = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const students = await getStudents();
      setProfiles(students || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (form) => {
    if (!form.studentName?.trim() && !form.name?.trim()) {
      toast.error('Student name is required');
      return;
    }

    if (!form.email?.trim()) {
      toast.error('Email is required');
      return;
    }

    startTransition(async () => {
      try {
        await addStudent({
          name: form.name || form.studentName.trim(),
          email: form.email.trim(),
          password: form.password?.trim() || 'defaultPassword123',
          courseIds: form.courseIds || [], // Pass array of course IDs
        });
        toast.success('Student added successfully!');
        await fetchStudents();
      } catch (err) {
        console.error('Error adding student:', err);
        toast.error(err.message || 'Failed to add student');
      }
    });
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    startTransition(async () => {
      try {
        await deleteStudent(studentToDelete.id);
        toast.success('Student deleted successfully!');
        await fetchStudents();
        setDeleteDialogOpen(false);
        setStudentToDelete(null);
      } catch (err) {
        console.error('Error deleting student:', err);
        toast.error(err.message || 'Failed to delete student');
        setDeleteDialogOpen(false);
        setStudentToDelete(null);
      }
    });
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const filteredStudents = profiles.filter((profile) =>
    profile.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatEnrollments = (enrollments) => {
    if (!enrollments || enrollments.length === 0) {
      return 'No enrollments';
    }

    return enrollments
      .map((enrollment) => enrollment.courses?.title || 'Unknown Course')
      .join(', ');
  };

  const getEnrollmentCount = (enrollments) => {
    return enrollments ? enrollments.length : 0;
  };

  const openEditDialog = (profile) => {
    setEditingCourse(profile);
  };

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
                  Manage student profiles and course enrollments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="h-4 w-4" />
              <span>
                {loading ? '...' : filteredStudents.length} student
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
            <AddStudent onAddStudent={handleAddStudent} disabled={isPending} />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Student Profiles
                </h3>
                <p className="text-slate-600 text-sm">
                  View and manage all student accounts and their course
                  enrollments
                </p>
              </div>
              {(loading || isPending) && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{loading ? 'Loading...' : 'Processing...'}</span>
                </div>
              )}
            </div>
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
                    Enrollments
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <LoadingSkeleton />
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length > 0 ? (
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
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-slate-400" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">
                              {getEnrollmentCount(profile.enrollments)} course
                              {getEnrollmentCount(profile.enrollments) !== 1
                                ? 's'
                                : ''}
                            </span>
                            {profile.enrollments &&
                              profile.enrollments.length > 0 && (
                                <span
                                  className="text-xs text-slate-500 max-w-48 truncate"
                                  title={formatEnrollments(profile.enrollments)}
                                >
                                  {formatEnrollments(profile.enrollments)}
                                </span>
                              )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-600 border-slate-200"
                        >
                          {profile.created_at
                            ? new Date(profile.created_at).toLocaleDateString()
                            : 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(profile)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(profile)}
                          disabled={isPending}
                          className="hover:bg-red-50 cursor-pointer hover:border-red-200 hover:text-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <Users className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-slate-600 font-medium">
                            No students found
                          </p>
                          <p className="text-slate-500 text-sm">
                            {searchTerm
                              ? 'Try adjusting your search or add a new student'
                              : 'Start by adding your first student'}
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
        confirmLabel={isPending ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        disabled={isPending}
      />
    </>
  );
};

export default ManageStudent;
