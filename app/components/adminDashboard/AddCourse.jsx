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
          <Button className="cursor-pointer" size="sm">
            + Add Course
          </Button>
        </DialogTrigger>
        <DialogContent className="[&>button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCourse();
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Course Title"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Course Description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="cursor-pointer">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddCourse;
