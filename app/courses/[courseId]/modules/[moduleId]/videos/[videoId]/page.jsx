'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Play,
  ArrowLeft,
  BookOpen,
  Home,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getStudentVideoData } from '@/lib/actions/videos';

const VideoDetail = () => {
  const { courseId, moduleId, videoId } = useParams();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['studentVideoData', courseId, moduleId, videoId],
    queryFn: () => getStudentVideoData(courseId, moduleId, videoId),
    enabled: !!courseId && !!moduleId && !!videoId,
  });

  console.log(data);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center text-red-500 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-red-200/60 shadow-sm">
          <p className="text-lg font-medium">Error loading video</p>
          <p className="text-sm text-slate-600 mt-2">
            {error.message || 'Failed to load video details.'}
          </p>
        </div>
      </div>
    );
  }

  if (!data?.video || !data?.module || !data?.course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center text-slate-500 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-sm">
          <p className="text-lg font-medium">Video not found</p>
          <p className="text-sm text-slate-600 mt-2">
            Please check the URL and try again.
          </p>
        </div>
      </div>
    );
  }

  const { course, module, video } = data;
  const bunnyStreamUrl = video.bunny_video_id;

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Fullscreen Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-white">
              <Link href={`/courses/${courseId}/modules/${moduleId}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 border-white/20"
                >
                  <X className="h-4 w-4 mr-2" />
                  Exit Fullscreen
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4" />
                <span>{course.title}</span>
                <span className="text-white/60">•</span>
                <Home className="h-4 w-4" />
                <span>{module.title}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="text-white hover:bg-white/20 border-white/20"
            >
              <Minimize2 className="h-4 w-4 mr-2" />
              Minimize
            </Button>
          </div>
        </div>

        {/* Fullscreen Video */}
        <div className="w-full h-full flex items-center justify-center">
          <iframe
            src={bunnyStreamUrl}
            className="w-full h-full"
            title={video.title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/courses/${courseId}/modules/${moduleId}`}>
                <Button variant="outline" className="hover:bg-slate-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Module
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">{course.title}</span>
                <span className="text-slate-400">•</span>
                <Home className="h-4 w-4" />
                <span className="font-medium">{module.title}</span>
              </div>
            </div>
            <Button
              onClick={() => setIsFullscreen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Video Title */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {video.title}
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                  Watch this video to continue your learning journey
                </p>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="aspect-video bg-black">
              <iframe
                src={bunnyStreamUrl}
                className="w-full h-full"
                title={video.title}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              About this video
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <BookOpen className="h-4 w-4 text-emerald-500" />
                <span>Course: {course.title}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Home className="h-4 w-4 text-emerald-500" />
                <span>Module: {module.title}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Play className="h-4 w-4 text-emerald-500" />
                <span>Video: {video.title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
