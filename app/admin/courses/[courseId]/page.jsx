'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  BookOpen,
  Home,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ConfirmDialog from '@/app/components/adminDashboard/ConfirmDialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addModule,
  deleteModule,
  getModules,
  updateModule,
} from '@/lib/actions/modules';
import { toast } from 'sonner';
import LoadingSkeleton from '@/app/components/common/LoadingSkeleton';
import { getCourseById } from '@/lib/actions/courses';

const AdminCourseDetail = () => {
  const queryClient = useQueryClient();
  const { courseId } = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [form, setForm] = useState({ title: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [dialogMode, setDialogMode] = useState('add');

  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => getModules(courseId),
  });

  const { data: course, isLoading: loadingCourseTitle } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => getCourseById(courseId),
  });

  const resetForm = () => {
    setForm({ title: '' });
    setEditingModule(null);
  };

  const { mutate: addModuleMutation, isPending: savingModulePending } =
    useMutation({
      mutationFn: addModule,
      onSuccess: () => {
        toast.success('Module added successfully');
        queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
        resetForm();
        setIsDialogOpen(false);
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to add module');
      },
    });

  const handleAdd = async () => {
    if (form.title.trim()) {
      const maxPosition =
        modules.length > 0 ? Math.max(...modules.map((m) => m.position)) : 0;
      const newPosition = maxPosition + 1;

      addModuleMutation({
        course_id: courseId,
        title: form.title.trim(),
        position: newPosition,
      });
    }
  };

  const handleEdit = (module) => {
    setDialogMode('edit');
    setEditingModule(module);
    setForm({
      title: module.title,
    });
    setIsDialogOpen(true);
  };

  const { mutate: updateModuleMutation, isPending: updatingModulePending } =
    useMutation({
      mutationFn: updateModule,
      onSuccess: () => {
        toast.success('Module updated successfully');
        queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
        resetForm();
        setIsDialogOpen(false);
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update module');
      },
    });

  const handleUpdate = async () => {
    if (!form.title.trim()) {
      toast.error('Module title is required');
      return;
    }

    if (form.title.trim() && editingModule) {
      updateModuleMutation({
        moduleId: editingModule.id,
        updates: {
          title: form.title.trim(),
          position: editingModule.position,
        },
      });
    }
  };

  const handleDeleteClick = (module) => {
    setModuleToDelete(module);
    setDeleteDialogOpen(true);
  };

  const { mutate: deleteModuleMutation, isPending: deletingModulePending } =
    useMutation({
      mutationFn: deleteModule,
      onSuccess: () => {
        toast.success('Module deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
        setDeleteDialogOpen(false);
        setModuleToDelete(null);
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to delete module');
        setDeleteDialogOpen(false);
        setModuleToDelete(null);
      },
    });

  const handleConfirmDelete = async () => {
    if (moduleToDelete) {
      deleteModuleMutation(moduleToDelete.id);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setModuleToDelete(null);
  };

  const sortedModules = [...modules].sort((a, b) => a.position - b.position);

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-blue-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                {loadingCourseTitle ? (
                  <div className="h-6 w-40 bg-slate-200 rounded-md animate-pulse" />
                ) : course ? (
                  <h2 className="text-xl font-semibold text-slate-800">
                    {course.title}
                  </h2>
                ) : (
                  <div className="text-sm text-destructive font-medium">
                    Course title not found
                  </div>
                )}

                <p className="text-slate-600 text-sm">Manage course modules</p>
              </div>
            </div>
            <Button
              onClick={() => {
                setDialogMode('add');
                setIsDialogOpen(true);
                resetForm();
              }}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              disabled={savingModulePending || updatingModulePending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/admin/courses">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) {
                setIsDialogOpen(false);
                resetForm();
              }
            }}
          >
            {/* <DialogTrigger asChild>
              
            </DialogTrigger> */}

            <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold text-slate-800">
                      {dialogMode === 'add' ? 'Add New Module' : 'Edit Module'}
                    </DialogTitle>
                    <p className="text-slate-600 text-sm">
                      {dialogMode === 'add'
                        ? 'Create a new module for this course'
                        : 'Update module information'}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-slate-700 flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Module Title
                  </Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g., Introduction to Variables"
                    className="mt-2"
                    disabled={savingModulePending || updatingModulePending}
                  />
                </div>
              </div>

              <DialogFooter className="mt-6 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  disabled={savingModulePending || updatingModulePending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={dialogMode === 'add' ? handleAdd : handleUpdate}
                  className="text-white bg-gradient-to-r from-blue-500 to-indigo-500"
                  disabled={!form.title.trim()}
                >
                  {(savingModulePending || updatingModulePending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {dialogMode === 'add' ? (
                    <>
                      {!savingModulePending && (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {savingModulePending ? 'Creating...' : 'Create Module'}
                    </>
                  ) : (
                    <>
                      {!updatingModulePending && (
                        <Edit3 className="h-4 w-4 mr-2" />
                      )}
                      {updatingModulePending ? 'Updating...' : 'Update Module'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Module List */}
        <div className="bg-white/80 rounded-2xl p-6 border shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Course Modules
          </h2>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead>Module</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modulesLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12">
                    <LoadingSkeleton />
                  </TableCell>
                </TableRow>
              ) : sortedModules.length > 0 ? (
                sortedModules.map((module) => (
                  <TableRow
                    key={module.id}
                    className="hover:bg-green-50/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <Home className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-medium text-slate-800">
                          Module {module.position}: {module.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-600 border-slate-200"
                      >
                        {module.created_at
                          ? new Date(module.created_at).toLocaleDateString()
                          : 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/courses/${courseId}/modules/${module.id}`}
                      >
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                        >
                          Videos <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(module)}
                        className="hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
                        disabled={
                          updatingModulePending || deletingModulePending
                        }
                      >
                        {updatingModulePending &&
                        editingModule?.id === module.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit3 className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(module)}
                        className="hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                        disabled={
                          deletingModulePending || updatingModulePending
                        }
                      >
                        {deletingModulePending &&
                        moduleToDelete?.id === module.id ? (
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
                  <TableCell colSpan={3} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <Home className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-slate-600 font-medium">
                          No modules found
                        </p>
                        <p className="text-slate-500 text-sm">
                          Add your first module to get started.
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

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Module"
        description={`Are you sure you want to delete "${moduleToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel={deletingModulePending ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        loading={deletingModulePending}
      />
    </>
  );
};

export default AdminCourseDetail;
