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
  Edit3,
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
import { useQuery } from '@tanstack/react-query';

const AddEditStudent = ({
  onAddStudent,
  onEditStudent,
  isAdding,
  isEditing,
  editingStudent = null,
  trigger = null, // Custom trigger component for edit mode
}) => {
  const [form, setForm] = useState({
    studentName: '',
    email: '',
    password: '',
    courseIds: [],
  });
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [openPopover, setOpenPopover] = useState(false);

  const isEditMode = !!editingStudent;
  const isProcessing = isAdding || isEditing;

  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  // Reset form when dialog opens/closes or when editingStudent changes
  useEffect(() => {
    if (open && isEditMode && editingStudent) {
      // Populate form with existing student data
      setForm({
        studentName: editingStudent.name || '',
        email: editingStudent.email || '',
        password: '',
        courseIds:
          editingStudent.enrollments
            ?.map((e) => e.courses?.id)
            .filter(Boolean) || [],
      });

      const studentCourses =
        editingStudent.enrollments
          ?.map((e) => ({
            id: e.courses?.id,
            title: e.courses?.title,
            description: e.courses?.description,
          }))
          .filter((course) => course.id) || [];

      setSelectedCourses(studentCourses);
    } else if (open && !isEditMode) {
      // Reset form for add mode
      setForm({
        studentName: '',
        email: '',
        password: '',
        courseIds: [],
      });
      setSelectedCourses([]);
    }
  }, [open, isEditMode, editingStudent]);

  useEffect(() => {
    if (
      courses.length > 0 &&
      form.courseIds.length > 0 &&
      selectedCourses.length === 0
    ) {
      const studentCourses = courses.filter((course) =>
        form.courseIds.includes(course.id),
      );
      setSelectedCourses(studentCourses);
    }
  }, [courses, form.courseIds, selectedCourses.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const submitData = {
      ...form,
      name: form.studentName,
    };

    if (isEditMode) {
      onEditStudent(editingStudent.id, submitData, () => {
        closeDialog();
      });
    } else {
      onAddStudent(submitData, () => {
        closeDialog();
      });
    }
  };

  const closeDialog = () => {
    setOpen(false);
    setForm({ studentName: '', email: '', password: '', courseIds: [] });
    setSelectedCourses([]);
    setShowPassword(false);
  };

  const isFormValid = form.studentName.trim() && form.email.trim();
  // For edit mode, password is optional
  const isSubmitDisabled = !isFormValid || isProcessing;

  const handleCourseSelect = (course) => {
    const isSelected = selectedCourses.some((sc) => sc.id === course.id);

    if (isSelected) {
      // Remove course
      const newSelected = selectedCourses.filter((sc) => sc.id !== course.id);
      const newIds = newSelected.map((sc) => sc.id);
      setSelectedCourses(newSelected);
      setForm((prev) => ({ ...prev, courseIds: newIds }));
    } else {
      // Add course
      const newSelected = [...selectedCourses, course];
      const newIds = newSelected.map((sc) => sc.id);
      setSelectedCourses(newSelected);
      setForm((prev) => ({ ...prev, courseIds: newIds }));
    }
  };

  // Default trigger for add mode
  const defaultTrigger = (
    <Button
      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      disabled={isProcessing}
    >
      {isAdding ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Plus className="h-4 w-4 mr-2" />
      )}
      Add Student
    </Button>
  );

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
        <DialogContent className="[&>button]:cursor-pointer sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                {isEditMode ? (
                  <Edit3 className="h-5 w-5 text-white" />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-800">
                  {isEditMode ? 'Edit Student' : 'Add New Student'}
                </DialogTitle>
                <p className="text-slate-600 text-sm">
                  {isEditMode
                    ? 'Update student account details'
                    : 'Create a new student account'}
                </p>
              </div>
            </div>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isFormValid) {
                handleSubmit();
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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
                />
              </div>

              <div className="relative space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <LockIcon className="h-4 w-4" />
                  {isEditMode
                    ? 'New Password (leave empty to keep current)'
                    : 'Create Password *'}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    isEditMode
                      ? 'Enter new password or leave empty'
                      : 'Create a secure password'
                  }
                  className="w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-green-300 focus:ring-green-100 transition-all duration-200"
                  disabled={isProcessing}
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
                      className="w-full justify-between bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-indigo-300 focus:ring-indigo-100 transition-all duration-200 h-auto min-h-[40px] p-3"
                      disabled={isProcessing}
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
                          <span className="text-slate-500">
                            Select courses (optional)
                          </span>
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
                          const isSelected = selectedCourses.some(
                            (sc) => sc.id === course.id,
                          );
                          return (
                            <CommandItem
                              key={course.id}
                              value={course.title}
                              onSelect={() => handleCourseSelect(course)}
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
                onClick={closeDialog}
                className="cursor-pointer border-slate-200 hover:bg-slate-50"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={`bg-gradient-to-r  from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                 text-white transition-all duration-200`}
                disabled={isSubmitDisabled}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {isEditMode ? (
                      <Edit3 className="h-4 w-4 mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {isEditMode ? 'Update Student' : 'Create Student'}
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

export default AddEditStudent;
