'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const AdminCourses = () => {
  const [courses, setCourses] = useState([
    { id: '1', title: 'React for Beginners' },
    { id: '2', title: 'Advanced JavaScript' },
    { id: '3', title: 'UI/UX Design Fundamentals' },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({ title: '' });

  const handleAdd = () => {
    if (form.title.trim()) {
      setCourses([
        ...courses,
        {
          id: Date.now().toString(),
          title: form.title.trim(),
        },
      ]);
      setForm({ title: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setForm({ title: course.title });
  };

  const handleUpdate = () => {
    if (form.title.trim()) {
      setCourses(
        courses.map((course) =>
          course.id === editingCourse.id
            ? { ...course, title: form.title.trim() }
            : course,
        ),
      );
      setEditingCourse(null);
      setForm({ title: '' });
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  return (
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

          {/* Add Course Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold text-slate-800">Add New Course</DialogTitle>
                    <p className="text-slate-600 text-sm">Create a new educational course</p>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Course Title
                  </Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ title: e.target.value })}
                    placeholder="e.g., Introduction to React"
                    className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-blue-300 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button onClick={handleAdd} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-slate-50/50 rounded-xl p-4 hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/courses/${course.id}`}>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                    >
                      Manage Modules
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(course)}
                    className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(course.id)}
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-slate-600 font-medium mb-2">No courses yet</h3>
              <p className="text-slate-500 text-sm">Add your first course to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCourse}
        onOpenChange={() => setEditingCourse(null)}
      >
        <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-800">Edit Course</DialogTitle>
                <p className="text-slate-600 text-sm">Update course information</p>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Title
              </Label>
              <Input
                id="edit-title"
                value={form.title}
                onChange={(e) => setForm({ title: e.target.value })}
                placeholder="Enter course title"
                className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-blue-300 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingCourse(null)} className="border-slate-200 hover:bg-slate-50">
              Cancel
            </Button>
            <Button onClick={handleUpdate} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Edit3 className="h-4 w-4 mr-2" />
              Update Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourses;
