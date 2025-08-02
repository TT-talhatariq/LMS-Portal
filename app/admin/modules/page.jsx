// 'use client';
// import React, { useState } from 'react';
// import {
//   Home,
//   Plus,
//   Trash2,
//   Edit3,
//   BookOpen,
//   Hash,
//   ArrowRight,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from '@/components/ui/command';
// import { Check, ChevronDown } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import Link from 'next/link';
// import ConfirmDialog from '@/app/components/adminDashboard/ConfirmDialog';

// const AdminModules = () => {
//   // Mock courses data
//   const courses = [
//     { id: '1', title: 'React for Beginners' },
//     { id: '2', title: 'Advanced JavaScript' },
//     { id: '3', title: 'UI/UX Design Fundamentals' },
//   ];

//   const [modules, setModules] = useState([
//     {
//       id: '1',
//       title: 'Getting Started with React',
//       priority: 1,
//       courseId: '1',
//       courseName: 'React for Beginners',
//     },
//     {
//       id: '2',
//       title: 'Components and Props',
//       priority: 2,
//       courseId: '1',
//       courseName: 'React for Beginners',
//     },
//     {
//       id: '3',
//       title: 'JavaScript Fundamentals',
//       priority: 1,
//       courseId: '2',
//       courseName: 'Advanced JavaScript',
//     },
//   ]);

//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [editingModule, setEditingModule] = useState(null);
//   const [form, setForm] = useState({ title: '', priority: '', courseId: '' });
//   const [openPopover, setOpenPopover] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [moduleToDelete, setModuleToDelete] = useState(null);

//   const handleAdd = () => {
//     if (form.title.trim() && form.priority && form.courseId) {
//       const course = courses.find((c) => c.id === form.courseId);
//       setModules([
//         ...modules,
//         {
//           id: Date.now().toString(),
//           title: form.title.trim(),
//           priority: parseInt(form.priority),
//           courseId: form.courseId,
//           courseName: course?.title || '',
//         },
//       ]);
//       setForm({ title: '', priority: '', courseId: '' });
//       setSelectedCourse(null);
//       setIsAddDialogOpen(false);
//     }
//   };

//   const handleEdit = (module) => {
//     setEditingModule(module);
//     setForm({
//       title: module.title,
//       priority: module.priority.toString(),
//       courseId: module.courseId,
//     });
//     setSelectedCourse(courses.find((c) => c.id === module.courseId));
//   };

//   const handleUpdate = () => {
//     if (form.title.trim() && form.priority && form.courseId) {
//       const course = courses.find((c) => c.id === form.courseId);
//       setModules(
//         modules.map((module) =>
//           module.id === editingModule.id
//             ? {
//                 ...module,
//                 title: form.title.trim(),
//                 priority: parseInt(form.priority),
//                 courseId: form.courseId,
//                 courseName: course?.title || '',
//               }
//             : module,
//         ),
//       );
//       setEditingModule(null);
//       setForm({ title: '', priority: '', courseId: '' });
//       setSelectedCourse(null);
//     }
//   };

//   const handleDeleteClick = (module) => {
//     setModuleToDelete(module);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     setModules(modules.filter((module) => module.id !== moduleToDelete.id));
//     setDeleteDialogOpen(false);
//     setModuleToDelete(null);
//   };

//   const handleCancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setModuleToDelete(null);
//   };
//   return (
//     <>
//       <div className="space-y-8">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-white to-purple-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
//                 <Home className="h-5 w-5 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                   Manage Modules
//                 </h1>
//                 <p className="text-slate-600 text-sm">
//                   Create and manage course modules
//                 </p>
//               </div>
//             </div>

//             {/* Add Module Button */}
//             <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Module
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                   <DialogTitle>Add New Module</DialogTitle>
//                 </DialogHeader>
//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="title">Module Title</Label>
//                     <Input
//                       id="title"
//                       value={form.title}
//                       onChange={(e) =>
//                         setForm({ ...form, title: e.target.value })
//                       }
//                       placeholder="Enter module title"
//                       className="mt-2"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="priority">Priority</Label>
//                     <Input
//                       id="priority"
//                       type="number"
//                       value={form.priority}
//                       onChange={(e) =>
//                         setForm({ ...form, priority: e.target.value })
//                       }
//                       placeholder="e.g., 1"
//                       className="mt-2"
//                     />
//                   </div>
//                   <div>
//                     <Label>Select Course</Label>
//                     <Popover open={openPopover} onOpenChange={setOpenPopover}>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           role="combobox"
//                           className="w-full justify-between mt-2"
//                         >
//                           {selectedCourse
//                             ? selectedCourse.title
//                             : 'Select a course'}
//                           <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-full p-0">
//                         <Command>
//                           <CommandInput placeholder="Search courses..." />
//                           <CommandEmpty>No course found.</CommandEmpty>
//                           <CommandGroup>
//                             {courses.map((course) => (
//                               <CommandItem
//                                 key={course.id}
//                                 value={course.title}
//                                 onSelect={() => {
//                                   setForm({ ...form, courseId: course.id });
//                                   setSelectedCourse(course);
//                                   setOpenPopover(false);
//                                 }}
//                               >
//                                 <Check
//                                   className={cn(
//                                     'mr-2 h-4 w-4',
//                                     selectedCourse?.id === course.id
//                                       ? 'opacity-100'
//                                       : 'opacity-0',
//                                   )}
//                                 />
//                                 {course.title}
//                               </CommandItem>
//                             ))}
//                           </CommandGroup>
//                         </Command>
//                       </PopoverContent>
//                     </Popover>
//                   </div>
//                 </div>
//                 <DialogFooter className="gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setIsAddDialogOpen(false);
//                       setSelectedCourse(null);
//                       setForm({ title: '', priority: '', courseId: '' });
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                   <Button onClick={handleAdd}>
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Module
//                   </Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>

//         {/* Modules List */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
//           <div className="space-y-4">
//             {modules.map((module) => (
//               <div
//                 key={module.id}
//                 className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   {/* <Home className="h-5 w-5 text-purple-600" /> */}
//                   <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
//                     <Home className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-slate-800">
//                       Module {module.priority}: {module.title}
//                     </h3>
//                     <p className="text-sm text-slate-600">
//                       Course: {module.courseName}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Link href={`/admin/courses/${module.id}`}>
//                     <Button
//                       size="sm"
//                       className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
//                     >
//                       Manage Modules
//                       <ArrowRight className="h-4 w-4 ml-1" />
//                     </Button>
//                   </Link>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleEdit(module)}
//                     className="hover:bg-purple-50"
//                   >
//                     <Edit3 className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleDeleteClick(module)}
//                     className="hover:bg-red-50 hover:text-red-600"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))}

//             {modules.length === 0 && (
//               <div className="text-center py-8 text-slate-500">
//                 No modules yet. Add your first module to get started.
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Edit Dialog */}
//         <Dialog
//           open={!!editingModule}
//           onOpenChange={() => {
//             setEditingModule(null);
//             setSelectedCourse(null);
//             setForm({ title: '', priority: '', courseId: '' });
//           }}
//         >
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>Edit Module</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="edit-title">Module Title</Label>
//                 <Input
//                   id="edit-title"
//                   value={form.title}
//                   onChange={(e) => setForm({ ...form, title: e.target.value })}
//                   placeholder="Enter module title"
//                   className="mt-2"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="edit-priority">Priority</Label>
//                 <Input
//                   id="edit-priority"
//                   type="number"
//                   value={form.priority}
//                   onChange={(e) =>
//                     setForm({ ...form, priority: e.target.value })
//                   }
//                   placeholder="e.g., 1"
//                   className="mt-2"
//                 />
//               </div>
//               <div>
//                 <Label>Select Course</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       role="combobox"
//                       className="w-full justify-between mt-2"
//                     >
//                       {selectedCourse
//                         ? selectedCourse.title
//                         : 'Select a course'}
//                       <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-full p-0">
//                     <Command>
//                       <CommandInput placeholder="Search courses..." />
//                       <CommandEmpty>No course found.</CommandEmpty>
//                       <CommandGroup>
//                         {courses.map((course) => (
//                           <CommandItem
//                             key={course.id}
//                             value={course.title}
//                             onSelect={() => {
//                               setForm({ ...form, courseId: course.id });
//                               setSelectedCourse(course);
//                             }}
//                           >
//                             <Check
//                               className={cn(
//                                 'mr-2 h-4 w-4',
//                                 selectedCourse?.id === course.id
//                                   ? 'opacity-100'
//                                   : 'opacity-0',
//                               )}
//                             />
//                             {course.title}
//                           </CommandItem>
//                         ))}
//                       </CommandGroup>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//               </div>
//             </div>
//             <DialogFooter className="gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setEditingModule(null);
//                   setSelectedCourse(null);
//                   setForm({ title: '', priority: '', courseId: '' });
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleUpdate}>
//                 <Edit3 className="h-4 w-4 mr-2" />
//                 Update Module
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <ConfirmDialog
//         open={deleteDialogOpen}
//         onOpenChange={setDeleteDialogOpen}
//         title="Delete Module"
//         description={`Are you sure you want to delete "${moduleToDelete?.title}"? This action cannot be undone.`}
//         onConfirm={handleConfirmDelete}
//         onCancel={handleCancelDelete}
//         confirmLabel="Delete"
//         cancelLabel="Cancel"
//       />
//     </>
//   );
// };

// export default AdminModules;
