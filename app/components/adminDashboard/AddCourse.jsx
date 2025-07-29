'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Plus, BookOpen, FileText } from 'lucide-react';

const AddCourse = ({ onAddCourse }) => {
  const [form, setForm] = useState({ title: '', description: '' });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCourse = () => {
    onAddCourse(form);
    setForm({ title: '', description: '' });
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </DialogTrigger>
        <DialogContent className="[&>button]:cursor-pointer sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-800">
                  Add New Course
                </DialogTitle>
                <p className="text-slate-600 text-sm">
                  Create a new educational course
                </p>
              </div>
            </div>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCourse();
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Course Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Introduction to React"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-blue-300 focus:ring-blue-100 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Course Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe what students will learn in this course..."
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-3 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:border-blue-300 transition-all duration-200 placeholder:text-slate-400"
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="cursor-pointer border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddCourse;
