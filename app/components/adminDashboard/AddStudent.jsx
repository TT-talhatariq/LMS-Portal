'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, User, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

const AddStudent = ({ onAddStudent, disabled = false }) => {
  const [form, setForm] = useState({
    studentName: '',
    email: '',
    password: '',
  });
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      await onAddStudent(form);
      setForm({ studentName: '', email: '', password: '' });
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

              <div className="relative">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
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
