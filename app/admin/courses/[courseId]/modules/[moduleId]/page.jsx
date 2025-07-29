'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Play,
  Home,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  BookOpen,
  Link as LinkIcon,
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
import ConfirmDialog from '@/app/components/adminDashboard/ConfirmDialog';

const AdminModuleDetail = () => {
  const { courseId, moduleId } = useParams();

  // Mock data - in real app, fetch based on courseId and moduleId
  const course = {
    id: courseId,
    title: 'React for Beginners',
  };

  const module = {
    id: moduleId,
    title: 'State and Event Handling',
  };

  const [videos, setVideos] = useState([
    {
      id: '9',
      title: 'Understanding State',
      bunnyStreamUrl: 'https://iframe.videodelivery.net/VIDEO_ID_1',
    },
    {
      id: '10',
      title: 'useState Hook Deep Dive',
      bunnyStreamUrl: 'https://iframe.videodelivery.net/VIDEO_ID_2',
    },
    {
      id: '11',
      title: 'Event Handling Fundamentals',
      bunnyStreamUrl: 'https://iframe.videodelivery.net/VIDEO_ID_3',
    },
    {
      id: '12',
      title: 'Forms in React',
      bunnyStreamUrl: 'https://iframe.videodelivery.net/VIDEO_ID_4',
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [form, setForm] = useState({ title: '', bunnyStreamUrl: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const handleAdd = () => {
    if (form.title.trim() && form.bunnyStreamUrl.trim()) {
      setVideos([
        ...videos,
        {
          id: Date.now().toString(),
          title: form.title.trim(),
          bunnyStreamUrl: form.bunnyStreamUrl.trim(),
        },
      ]);
      setForm({ title: '', bunnyStreamUrl: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setForm({
      title: video.title,
      bunnyStreamUrl: video.bunnyStreamUrl,
    });
  };

  const handleUpdate = () => {
    if (form.title.trim() && form.bunnyStreamUrl.trim()) {
      setVideos(
        videos.map((video) =>
          video.id === editingVideo.id
            ? {
                ...video,
                title: form.title.trim(),
                bunnyStreamUrl: form.bunnyStreamUrl.trim(),
              }
            : video,
        ),
      );
      setEditingVideo(null);
      setForm({ title: '', bunnyStreamUrl: '' });
    }
  };

  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setVideos(videos.filter((video) => video.id !== id));
    setDeleteDialogOpen(false);
    setVideoToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setVideoToDelete(null);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Module Header */}
        <div className="bg-gradient-to-r from-white to-indigo-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.title}</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {module.title}
                </h1>
                <p className="text-slate-600 text-sm">Manage module videos</p>
              </div>
            </div>

            {/* Add Video Button */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
                <DialogHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-semibold text-slate-800">
                        Add New Video
                      </DialogTitle>
                      <p className="text-slate-600 text-sm">
                        Create a new video for this module
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
                      <Play className="h-4 w-4" />
                      Video Title
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="e.g., Understanding React State"
                      className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-cyan-300 focus:ring-cyan-100 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="bunnyStreamUrl"
                      className="text-sm font-medium text-slate-700 flex items-center gap-2"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Bunny Stream URL
                    </Label>
                    <Input
                      id="bunnyStreamUrl"
                      value={form.bunnyStreamUrl}
                      onChange={(e) =>
                        setForm({ ...form, bunnyStreamUrl: e.target.value })
                      }
                      placeholder="https://iframe.videodelivery.net/VIDEO_ID"
                      className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-cyan-300 focus:ring-cyan-100 transition-all duration-200"
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
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Video
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href={`/admin/courses/${courseId}`}>
            <Button variant="outline" className="hover:bg-slate-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
        </div>

        {/* Videos List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Module Videos
          </h2>

          <div className="space-y-4">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="group bg-slate-50/50 rounded-xl p-4 hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <Play className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {index + 1} {video.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <LinkIcon className="h-3 w-3 text-slate-400" />
                        <code className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-md font-mono">
                          {video.bunnyStreamUrl}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(video)}
                      className="hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all duration-200"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClick(video)}
                      className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {videos.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-slate-600 font-medium mb-2">
                  No videos yet
                </h3>
                <p className="text-slate-500 text-sm">
                  Add your first video to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog
          open={!!editingVideo}
          onOpenChange={() => setEditingVideo(null)}
        >
          <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Play className="h-4 w-4 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-slate-800">
                    Edit Video
                  </DialogTitle>
                  <p className="text-slate-600 text-sm">
                    Update video information
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
                  <Play className="h-4 w-4" />
                  Video Title
                </Label>
                <Input
                  id="edit-title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter video title"
                  className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-cyan-300 focus:ring-cyan-100 transition-all duration-200"
                />
              </div>
              <div>
                <Label
                  htmlFor="edit-bunnyStreamUrl"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <LinkIcon className="h-4 w-4" />
                  Bunny Stream URL
                </Label>
                <Input
                  id="edit-bunnyStreamUrl"
                  value={form.bunnyStreamUrl}
                  onChange={(e) =>
                    setForm({ ...form, bunnyStreamUrl: e.target.value })
                  }
                  placeholder="https://iframe.videodelivery.net/VIDEO_ID"
                  className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-cyan-300 focus:ring-cyan-100 transition-all duration-200"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingVideo(null)}
                className="border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Update Video
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Video"
        description={`Are you sure you want to delete "${videoToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
};

export default AdminModuleDetail;
