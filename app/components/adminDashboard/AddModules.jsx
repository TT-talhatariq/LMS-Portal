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
import { Check, ChevronDown } from 'lucide-react';

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
          <Button size="sm" className="cursor-pointer">
            + Add Module
          </Button>
        </DialogTrigger>
        <DialogContent className="[&>button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Add New Module</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label htmlFor="title">Module Title</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter module title"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                type="number"
                value={form.position}
                onChange={handleChange}
                required
                placeholder="e.g., 1"
              />
            </div>

            <div className="space-y-1">
              <Label>Select Course</Label>
              <Popover
                open={openCoursePopover}
                onOpenChange={setOpenCoursePopover}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedCourse ? selectedCourse.title : 'Select a course'}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Search courses..." />
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
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedCourse?.id === course.id
                                ? 'opacity-100'
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

            <DialogFooter className="pt-4">
              <Button className="cursor-pointer" type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddModules;
