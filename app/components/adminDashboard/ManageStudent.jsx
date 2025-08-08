'use client';

import { useState, useEffect } from 'react';
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
import AddEditStudent from './AddEditStudent';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

import { toast } from 'sonner';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from '@/lib/actions/students';
import CSVUploadStudent from './UploadStudentCSV';

const STUDENTS_PER_PAGE = 9;

const ManageStudent = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const { 
    data: studentsData, 
    isLoading: loadingProfiles,
    error: studentsError 
  } = useQuery({
    queryKey: ['profiles', currentPage, debouncedSearchTerm, STUDENTS_PER_PAGE],
    queryFn: () => getStudents({
      page: currentPage,
      limit: STUDENTS_PER_PAGE,
      searchTerm: debouncedSearchTerm
    }),
    keepPreviousData: true, 
  });

  const profiles = studentsData?.data || [];
  const totalCount = studentsData?.count || 0;
  const totalPages = studentsData?.totalPages || 0;
  const hasNextPage = studentsData?.hasNextPage || false;
  const hasPreviousPage = studentsData?.hasPreviousPage || false;

  const { mutate: addStudentMutation, isPending: savingStudent } = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      toast.success('Student added successfully');
      queryClient.invalidateQueries({
        queryKey: ['profiles']
      });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to add student');
    },
  });

  const { mutate: updateStudentMutation, isPending: updatingStudent } =
    useMutation({
      mutationFn: ({ id, data }) => updateStudent(id, data),
      onSuccess: () => {
        toast.success('Student updated successfully');
        queryClient.invalidateQueries({
          queryKey: ['profiles']
        });
        setEditingStudent(null);
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update student');
      },
    });

  const { mutate: deleteStudentMutation, isLoading: deletingStudent } =
    useMutation({
      mutationFn: deleteStudent,
      onMutate: (studentId) => {
        setDeletingStudentId(studentId);
      },
      onSuccess: () => {
        toast.success('Student deleted successfully');
        queryClient.invalidateQueries({
          queryKey: ['profiles']
        });
        setDeletingStudentId(null);
        if (profiles.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to delete student');
        setDeletingStudentId(null);
      },
    });

  const handleAddStudent = async (form, closeDialog) => {
    if (!form.studentName?.trim() && !form.name?.trim()) {
      toast.error('Student name is required');
      return;
    }

    if (!form.email?.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!form.password?.trim()) {
      toast.error('Password is required');
      return;
    }

    addStudentMutation(
      {
        name: form.name || form.studentName.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        courseIds: form.courseIds || [],
      },
      {
        onSuccess: () => {
          closeDialog();
        },
      },
    );
  };

  const handleEditStudent = async (studentId, form, closeDialog) => {
    if (!form.studentName?.trim() && !form.name?.trim()) {
      toast.error('Student name is required');
      return;
    }

    if (!form.email?.trim()) {
      toast.error('Email is required');
      return;
    }

    const updateData = {
      name: form.name || form.studentName.trim(),
      email: form.email.trim(),
      courseIds: form.courseIds || [],
    };

    if (form.password?.trim()) {
      updateData.password = form.password.trim();
    }

    updateStudentMutation(
      { id: studentId, data: updateData },
      {
        onSuccess: () => {
          closeDialog();
        },
      },
    );
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!studentToDelete) return;
    deleteStudentMutation(studentToDelete.id);
    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const formatEnrollments = (enrollments) =>
    !enrollments || enrollments.length === 0
      ? 'No enrollments'
      : enrollments.map((e) => e.courses?.title || 'Unknown Course').join(', ');

  const getEnrollmentCount = (enrollments) => enrollments?.length || 0;

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const renderPaginationItems = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages > 0) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
    }

    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2) + 1);
    let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxPagesToShow / 2) - 1);

    if (currentPage <= Math.floor(maxPagesToShow / 2) + 1) {
      endPage = Math.min(totalPages - 1, maxPagesToShow);
    }
    if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
      startPage = Math.max(2, totalPages - maxPagesToShow + 1);
    }

    if (startPage > 2) {
      pages.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages - 1) {
      pages.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    if (totalPages > 1 && !pages.some(p => p.key === totalPages.toString())) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-white to-green-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                {loadingProfiles ? '...' : totalCount} student
                {totalCount !== 1 ? 's' : ''}
                {debouncedSearchTerm && (
                  <span className="ml-1 text-blue-600">
                    (filtered)
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search students by name..."
                label="Search Student"
              />
            </div>
            <div className="flex items-center gap-2">
              <CSVUploadStudent
                onUploadComplete={(results) => {
                  queryClient.invalidateQueries({
                    queryKey: ['profiles']
                  });
                  const successCount = results.filter(
                    (r) => r.status === 'success',
                  ).length;
                  if (successCount > 0) {
                    toast.success(
                      `Successfully imported ${successCount} students`,
                    );
                  }
                }}
              />
              <AddEditStudent
                onAddStudent={handleAddStudent}
                isAdding={savingStudent}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Student Profiles
                </h3>
                <p className="text-slate-600 text-sm">
                  View and manage all student accounts and their course enrollments
                  {totalPages > 1 && (
                    <span className="ml-1">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Enrollments</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingProfiles ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <LoadingSkeleton count={5} />
                    </TableCell>
                  </TableRow>
                ) : profiles.length > 0 ? (
                  profiles.map((profile) => (
                    <TableRow
                      key={profile.id}
                      className="hover:bg-green-50/30 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                            <User className="h-4 w-4 text-indigo-600" />
                          </div>
                          <span>{profile.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span>{profile.email || 'N/A'}</span>
                        </div>
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
                            {profile.enrollments?.length > 0 && (
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
                      <TableCell className="flex items-center justify-end">
                        <AddEditStudent
                          onEditStudent={handleEditStudent}
                          isEditing={updatingStudent}
                          editingStudent={profile}
                          trigger={
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(profile)}
                          disabled={deletingStudentId === profile.id}
                          className="ml-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingStudentId === profile.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
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

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPreviousPage}
                      className={!hasPreviousPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                      className={!hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Student"
        description={`Are you sure you want to delete "${studentToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel={deletingStudentId ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        disabled={!!deletingStudentId}
      />
    </>
  );
};

export default ManageStudent;