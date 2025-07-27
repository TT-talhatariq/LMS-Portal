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

const AddStudent = ({ onAddStudent }) => {
  const [form, setForm] = useState({
    studentName: '',
    email: '',
    password: '',
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = () => {
    onAddStudent(form);
    setForm({ studentName: '', email: '', password: '' });
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" size="sm">
            + Add Student
          </Button>
        </DialogTrigger>
        <DialogContent className="[&>button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Student Name</Label>
              <Input
                id="name"
                name="studentName"
                type="text"
                value={form.studentName}
                onChange={handleChange}
                placeholder="Enter student name"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Student Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter student email"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Student Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter student password"
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button className="cursor-pointer" onClick={handleAddStudent}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddStudent;
