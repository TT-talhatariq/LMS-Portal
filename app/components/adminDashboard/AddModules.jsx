'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Plus, Home, BookOpen, Hash } from 'lucide-react';

const AddModules = ({ onAddModule, courses }) => {
  const [form, setForm] = useState({
    title: '',
    position: 0,
    course_id: '',
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [openCoursePopover, setOpenCoursePopover] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'position' ? parseInt(value) : value,
    }));
  };

  const handleAdd = () => {
    if (!form.title || !form.course_id) return;

    onAddModule(form);
    setForm({ title: '', position: 0, course_id: '' });
    setSelectedCourse(null);
    setOpenDialog(false);
  };

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="cursor-pointer bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </DialogTrigger>
        <DialogContent className="[&>button]:cursor-pointer sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
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
                  Create a new course module
                </p>
              </div>
            </div>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Module Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Introduction to Variables"
                  className="w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-purple-300 focus:ring-purple-100 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="position"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <Hash className="h-4 w-4" />
                  Position
                </Label>
                <Input
                  id="position"
                  name="position"
                  type="number"
                  value={form.position}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 1"
                  className="w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-purple-300 focus:ring-purple-100 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Select Course
                </Label>
                <Popover
                  open={openCoursePopover}
                  onOpenChange={setOpenCoursePopover}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl hover:border-purple-300 focus:border-purple-300 focus:ring-purple-100 transition-all duration-200"
                    >
                      {selectedCourse
                        ? selectedCourse.title
                        : 'Select a course'}
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0 bg-white/95 backdrop-blur-md border-slate-200"
                    align="start"
                  >
                    <Command>
                      <CommandInput
                        placeholder="Search courses..."
                        className="border-0"
                      />
                      <CommandEmpty>No course found.</CommandEmpty>
                      <CommandGroup>
                        {courses.map((course) => (
                          <CommandItem
                            key={course.id}
                            value={course.title}
                            onSelect={() => {
                              setForm((prev) => ({
                                ...prev,
                                course_id: course.id,
                              }));
                              setSelectedCourse(course);
                              setOpenCoursePopover(false);
                            }}
                            className="hover:bg-purple-50 cursor-pointer"
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedCourse?.id === course.id
                                  ? 'opacity-100 text-purple-600'
                                  : 'opacity-0',
                              )}
                            />
                            {course.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
                className="cursor-pointer border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Module
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddModules;
