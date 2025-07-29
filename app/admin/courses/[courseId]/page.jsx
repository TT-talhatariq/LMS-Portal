'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  BookOpen,
  Home,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
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

const AdminCourseDetail = () => {
  const { courseId } = useParams();

  // Mock data - in real app, fetch based on courseId
  const course = {
    id: courseId,
    title: 'React for Beginners',
  };

  const [modules, setModules] = useState([
    {
      id: '1',
      title: 'Getting Started with React',
      priority: 1,
    },
    {
      id: '2',
      title: 'Components and Props',
      priority: 2,
    },
    {
      id: '3',
      title: 'State and Event Handling',
      priority: 3,
    },
    {
      id: '4',
      title: 'Advanced State Management',
      priority: 4,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [form, setForm] = useState({ title: '', priority: '' });

  const handleAdd = () => {
    if (form.title.trim() && form.priority) {
      setModules([
        ...modules,
        {
          id: Date.now().toString(),
          title: form.title.trim(),
          priority: parseInt(form.priority),
        },
      ]);
      setForm({ title: '', priority: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = (module) => {
    setEditingModule(module);
    setForm({
      title: module.title,
      priority: module.priority.toString(),
    });
  };

  const handleUpdate = () => {
    if (form.title.trim() && form.priority) {
      setModules(
        modules.map((module) =>
          module.id === editingModule.id
            ? {
                ...module,
                title: form.title.trim(),
                priority: parseInt(form.priority),
              }
            : module,
        ),
      );
      setEditingModule(null);
      setForm({ title: '', priority: '' });
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this module?')) {
      setModules(modules.filter((module) => module.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-white to-blue-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                <span>Course Management</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {course.title}
              </h1>
              <p className="text-slate-600 text-sm">Manage course modules</p>
            </div>
          </div>

          {/* Add Module Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold text-slate-800">
                      Add New Module
                    </DialogTitle>
                    <p className="text-slate-600 text-sm">
                      Create a new module for this course
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
                    className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-purple-300 focus:ring-purple-100 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="priority"
                    className="text-sm font-medium text-slate-700 flex items-center gap-2"
                  >
                    <span className="text-lg">#</span>
                    Priority
                  </Label>
                  <Input
                    id="priority"
                    type="number"
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                    placeholder="e.g., 1"
                    className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-purple-300 focus:ring-purple-100 transition-all duration-200"
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
                <Button
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Module
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/admin/courses">
          <Button variant="outline" className="hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
      </div>

      {/* Modules List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Course Modules
        </h2>

        <div className="space-y-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className="group bg-slate-50/50 rounded-xl p-4 hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                    <Home className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">
                      Module {module.priority}: {module.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/courses/${courseId}/modules/${module.id}`}
                  >
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                    >
                      Manage Videos
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(module)}
                    className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all duration-200"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(module.id)}
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {modules.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-slate-600 font-medium mb-2">
                No modules yet
              </h3>
              <p className="text-slate-500 text-sm">
                Add your first module to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingModule}
        onOpenChange={() => setEditingModule(null)}
      >
        <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-800">
                  Edit Module
                </DialogTitle>
                <p className="text-slate-600 text-sm">
                  Update module information
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="edit-title"
                className="text-sm font-medium text-slate-700 flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Module Title
              </Label>
              <Input
                id="edit-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter module title"
                className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-purple-300 focus:ring-purple-100 transition-all duration-200"
              />
            </div>
            <div>
              <Label
                htmlFor="edit-priority"
                className="text-sm font-medium text-slate-700 flex items-center gap-2"
              >
                <span className="text-lg">#</span>
                Priority
              </Label>
              <Input
                id="edit-priority"
                type="number"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                placeholder="e.g., 1"
                className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-purple-300 focus:ring-purple-100 transition-all duration-200"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingModule(null)}
              className="border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Update Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseDetail;
