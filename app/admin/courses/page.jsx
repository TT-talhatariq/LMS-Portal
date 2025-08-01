'use client';

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import ConfirmDialog from '@/app/components/adminDashboard/ConfirmDialog';
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} from '@/lib/actions/courses';
import { toast } from 'sonner';
import LoadingSkeleton from '@/app/components/common/LoadingSkeleton';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({ title: '' });
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true); 
  const [savingCourse, setSavingCourse] = useState(false); 
  const [deletingCourse, setDeletingCourse] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error('Failed to load courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const openAddDialog = () => {
    setEditingCourse(null);
    setForm({ title: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (course) => {
    setEditingCourse(course);
    setForm({ title: course.title });
    setIsDialogOpen(true);
  };

const handleFormSubmit = async () => {
  if (!form.title.trim()) return;

  try {
    setSavingCourse(true);
    if (editingCourse) {
      await updateCourse(editingCourse.id, {
        title: form.title.trim(),
      });
      toast.success('Course updated successfully');
    } else {
      await addCourse({ title: form.title.trim() });
      toast.success('Course added successfully');
    }
    const updatedCourses = await getCourses();
    setCourses(updatedCourses);
    setIsDialogOpen(false);
    setForm({ title: '' });
    setEditingCourse(null);
  } catch (err) {
    console.error('Save failed:', err);
    toast.error('Failed to save course');
  } finally {
    setSavingCourse(false);
  }
};

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

const handleConfirmDelete = async () => {
  try {
    setDeletingCourse(true);
    await deleteCourse(courseToDelete.id);
    const updated = await getCourses();
    setCourses(updated);
    toast.success('Course deleted successfully');
  } catch (err) {
    console.error('Delete failed:', err);
    toast.error('Failed to delete course');
  } finally {
    setDeletingCourse(false);
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  }
};

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-blue-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Manage Courses
                </h1>
                <p className="text-slate-600 text-sm">
                  Create and manage course titles
                </p>
              </div>
            </div>
            {/* {(loading || isPending) && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{loading ? 'Loading...' : 'Processing...'}</span>
              </div>
            )} */}
            <Button
              onClick={openAddDialog}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="space-y-4">
            {loadingCourses ? (
              <LoadingSkeleton />
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-slate-50/50 rounded-xl p-4 hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                        >
                          Manage Modules
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(course)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(course)}
                        disabled={deletingCourse}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-slate-600 font-medium mb-2">
                  No courses yet
                </h3>
                <p className="text-slate-500 text-sm">
                  Add your first course to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-slate-800">
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </DialogTitle>
                  <p className="text-slate-600 text-sm">
                    {editingCourse
                      ? 'Update course information'
                      : 'Create a new educational course'}
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
                  <BookOpen className="h-4 w-4" />
                  Course Title
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ title: e.target.value })}
                  placeholder="Enter course title"
                  className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-blue-300 focus:ring-blue-100 transition-all duration-200"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleFormSubmit}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                disabled={savingCourse}
              >
                {savingCourse ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingCourse ? 'Updating...' : 'Creating...'}
                  </>
                ) : editingCourse ? (
                  <>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Update Course
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Course"
        description={`Are you sure you want to delete "${courseToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel={deletingCourse ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        disabled={deletingCourse}
      />
    </>
  );
};

export default AdminCourses;
