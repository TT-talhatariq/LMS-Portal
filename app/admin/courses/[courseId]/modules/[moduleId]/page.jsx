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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCourseById } from '@/lib/actions/courses';
import { getModuleById } from '@/lib/actions/modules';
import {
  addVideo,
  deleteVideo,
  getVideos,
  updateVideo,
} from '@/lib/actions/videos';
import { toast } from 'sonner';
import LoadingSkeleton from '@/app/components/common/LoadingSkeleton';

const AdminModuleDetail = () => {
  const { courseId, moduleId } = useParams();
  const queryClient = useQueryClient();

  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [editingVideo, setEditingVideo] = useState(null);
  const [form, setForm] = useState({ title: '', bunny_video_id: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const { data: course, isLoading: loadingCourseTitle } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => getCourseById(courseId),
  });
  const { data: moduleTitle, isLoading: loadingModuleTitle } = useQuery({
    queryKey: ['modules', moduleId],
    queryFn: () => getModuleById(moduleId),
  });

  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ['videos', moduleId],
    queryFn: () => getVideos(moduleId),
  });

  const openAddDialog = () => {
    setDialogMode('add');
    setForm({ title: '', bunny_video_id: '' });
    setEditingVideo(null);
    setIsVideoDialogOpen(true);
  };

  const openEditDialog = (video) => {
    setDialogMode('edit');
    setEditingVideo(video);
    setForm({
      title: video.title,
      bunny_video_id: video.bunny_video_id,
    });
    setIsVideoDialogOpen(true);
  };

  const closeVideoDialog = () => {
    setIsVideoDialogOpen(false);
    setDialogMode('add');
    setEditingVideo(null);
    setForm({ title: '', bunny_video_id: '' });
  };

  const { mutate: addVideoMutation, isPending: savingVideoPending } =
    useMutation({
      mutationFn: addVideo,
      onSuccess: () => {
        toast.success('Video added successfully');
        queryClient.invalidateQueries({ queryKey: ['videos', moduleId] });
        closeVideoDialog();
      },
    });

  const { mutate: updateVideoMutation, isPending: updatingVideoPending } =
    useMutation({
      mutationFn: updateVideo,
      onSuccess: () => {
        toast.success('Video updated successfully');
        queryClient.invalidateQueries({ queryKey: ['videos', moduleId] });
        closeVideoDialog();
      },
    });

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.bunny_video_id.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (dialogMode === 'add') {
      addVideoMutation({
        module_id: moduleId,
        title: form.title.trim(),
        bunny_video_id: form.bunny_video_id.trim(),
      });
    } else {
      updateVideoMutation({
        videoId: editingVideo.id,
        updates: {
          title: form.title.trim(),
          bunny_video_id: form.bunny_video_id.trim(),
        },
      });
    }
  };

  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setDeleteDialogOpen(true);
  };

  const { mutate: deleteVideoMutation, isPending: deletingVideoPending } =
    useMutation({
      mutationFn: deleteVideo,
      onSuccess: () => {
        toast.success('Video deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['videos', moduleId] });
        setDeleteDialogOpen(false);
        setVideoToDelete(null);
      },
    });

  const handleConfirmDelete = async () => {
    deleteVideoMutation(videoToDelete.id);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setVideoToDelete(null);
  };

  const isSubmitting = savingVideoPending || updatingVideoPending;

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
                  {loadingCourseTitle ? (
                    <div className="h-6 w-40 bg-slate-200 rounded-md animate-pulse" />
                  ) : course ? (
                    <span>{course.title}</span>
                  ) : (
                    <div className="text-sm text-destructive font-medium">
                      Course title not found
                    </div>
                  )}
                </div>

                {loadingModuleTitle ? (
                  <div className="h-6 w-40 bg-slate-200 rounded-md animate-pulse" />
                ) : moduleTitle ? (
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    {moduleTitle.title}
                  </h1>
                ) : (
                  <div className="text-sm text-destructive font-medium">
                    Module title not found
                  </div>
                )}
                <p className="text-slate-600 text-sm">Manage module videos</p>
              </div>
            </div>

            {/* Add Video Button */}
            <Button
              onClick={openAddDialog}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
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
            {videosLoading ? (
              <LoadingSkeleton />
            ) : videos.length > 0 ? (
              videos.map((video, index) => (
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
                            {video.bunny_video_id}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(video)}
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
              ))
            ) : (
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

        <Dialog open={isVideoDialogOpen} onOpenChange={closeVideoDialog}>
          <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md border-slate-200">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Play className="h-4 w-4 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-slate-800">
                    {dialogMode === 'add' ? 'Add New Video' : 'Edit Video'}
                  </DialogTitle>
                  <p className="text-slate-600 text-sm">
                    {dialogMode === 'add'
                      ? 'Create a new video for this module'
                      : 'Update video information'}
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
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Understanding React State"
                  className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-cyan-300 focus:ring-cyan-100 transition-all duration-200"
                />
              </div>
              <div>
                <Label
                  htmlFor="bunny_video_id"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <LinkIcon className="h-4 w-4" />
                  Bunny Stream URL
                </Label>
                <Input
                  id="bunny_video_id"
                  value={form.bunny_video_id}
                  onChange={(e) =>
                    setForm({ ...form, bunny_video_id: e.target.value })
                  }
                  placeholder="https://iframe.videodelivery.net/VIDEO_ID"
                  className="mt-2 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-cyan-300 focus:ring-cyan-100 transition-all duration-200"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={closeVideoDialog}
                className="border-slate-200 hover:bg-slate-50"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : dialogMode === 'add' ? (
                  <Plus className="h-4 w-4 mr-2" />
                ) : (
                  <Edit3 className="h-4 w-4 mr-2" />
                )}
                {isSubmitting
                  ? dialogMode === 'add'
                    ? 'Creating...'
                    : 'Updating...'
                  : dialogMode === 'add'
                    ? 'Create Video'
                    : 'Update Video'}
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
        loading={deletingVideoPending}
        disabled={deletingVideoPending}
      />
    </>
  );
};

export default AdminModuleDetail;
