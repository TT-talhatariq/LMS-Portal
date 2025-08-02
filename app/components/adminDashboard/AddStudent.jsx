'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Plus,
  User,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  LockIcon,
  BookOpen,
} from 'lucide-react';
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
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCourses } from '@/lib/actions/students';

const AddStudent = ({ onAddStudent, disabled = false }) => {
  const [form, setForm] = useState({
    studentName: '',
    email: '',
    password: '',
    courseIds: [], 
  });
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]); 
  const [openPopover, setOpenPopover] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const coursesData = await getCourses();
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = async () => {
    if (!form.studentName.trim() || !form.email.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddStudent({
        ...form,
        name: form.studentName.trim(), 
        courseIds: form.courseIds, 
      });
      setForm({ studentName: '', email: '', password: '', courseIds: [] });
      setSelectedCourses([]);
      setOpen(false);
    } catch (error) {
      console.error('Error in AddStudent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = form.studentName.trim() && form.email.trim();
  const isLoading = isSubmitting || disabled;

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
            disabled={disabled}
          >
            {disabled ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Add Student
          </Button>
        </DialogTrigger>
        <DialogContent className="[&>button]:cursor-pointer sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-800">
                  Add New Student
                </DialogTitle>
                <p className="text-slate-600 text-sm">
                  Create a new student account
                </p>
              </div>
            </div>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isFormValid && !isLoading) {
                handleAddStudent();
              }
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Student Name *
                </Label>
                <Input
                  id="name"
                  name="studentName"
                  type="text"
                  value={form.studentName}
                  onChange={handleChange}
                  placeholder="e.g., John Doe"
                  className="w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-green-300 focus:ring-green-100 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Student Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g., john.doe@example.com"
                  className="w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-green-300 focus:ring-green-100 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="relative space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <LockIcon className="h-4 w-4" />
                  Create Password *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  className="w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-green-300 focus:ring-green-100 transition-all duration-200"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[70%] -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Select Courses (Optional)
                </Label>
                <Popover open={openPopover} onOpenChange={setOpenPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      type="button"
                      className="w-full justify-between bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-green-300 focus:ring-green-100 transition-all duration-200 h-auto min-h-[40px] p-3"
                      disabled={isLoading || loadingCourses}
                    >
                      <div className="flex flex-wrap gap-1 flex-1 text-left">
                        {loadingCourses ? (
                          <div className="flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Loading courses...
                          </div>
                        ) : selectedCourses.length > 0 ? (
                          selectedCourses.map((course) => (
                            <Badge
                              key={course.id}
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 border-blue-200 text-xs"
                            >
                              {course.title}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-slate-500">Select courses (optional)</span>
                        )}
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search courses..." />
                      <CommandEmpty>No course found.</CommandEmpty>
                      <CommandGroup>
                        {courses.map((course) => {
                          const isSelected = selectedCourses.some(sc => sc.id === course.id);
                          return (
                            <CommandItem
                              key={course.id}
                              value={course.title}
                              onSelect={() => {
                                if (isSelected) {
                                  // Remove course
                                  const newSelected = selectedCourses.filter(sc => sc.id !== course.id);
                                  const newIds = newSelected.map(sc => sc.id);
                                  setSelectedCourses(newSelected);
                                  setForm({ ...form, courseIds: newIds });
                                } else {
                                  // Add course
                                  const newSelected = [...selectedCourses, course];
                                  const newIds = newSelected.map(sc => sc.id);
                                  setSelectedCourses(newSelected);
                                  setForm({ ...form, courseIds: newIds });
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  isSelected ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{course.title}</span>
                                {course.description && (
                                  <span className="text-xs text-slate-500 truncate">
                                    {course.description}
                                  </span>
                                )}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-slate-500">
                  You can select multiple courses. Click again to deselect.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setForm({ studentName: '', email: '', password: '', courseIds: [] });
                  setSelectedCourses([]);
                }}
                className="cursor-pointer border-slate-200 hover:bg-slate-50"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormValid || isLoading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Student
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddStudent;