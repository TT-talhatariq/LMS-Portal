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
    queryKey: ['studentVideoData'],
    queryFn: () => getStudentVideoData(courseId, moduleId, videoId),
    enabled: !!courseId && !!moduleId && !!videoId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 text-sm lg:text-base">
            Loading video...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-center text-red-500 bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-6 lg:p-8 border border-red-200/60 shadow-sm max-w-md w-full">
          <p className="text-base lg:text-lg font-medium">
            Error loading video
          </p>
          <p className="text-xs lg:text-sm text-slate-600 mt-2">
            {error.message || 'Failed to load video details.'}
          </p>
        </div>
      </div>
    );
  }

  if (!data?.video || !data?.module || !data?.course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-center text-slate-500 bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-6 lg:p-8 border border-slate-200/60 shadow-sm max-w-md w-full">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Play className="h-6 w-6 lg:h-8 lg:w-8 text-slate-400" />
          </div>
          <p className="text-base lg:text-lg font-medium">Video not found</p>
          <p className="text-xs lg:text-sm text-slate-600 mt-2">
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
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-4 text-white min-w-0 flex-1">
              <Link href={`/courses/${courseId}/modules/${moduleId}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 border-white/20 text-xs lg:text-sm px-2 lg:px-3"
                >
                  <X className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Exit Fullscreen</span>
                  <span className="sm:hidden">Exit</span>
                </Button>
              </Link>
              <div className="hidden md:flex items-center gap-2 text-xs lg:text-sm min-w-0">
                <BookOpen className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                <span className="truncate">{course.title}</span>
                <span className="text-white/60">•</span>
                <Home className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                <span className="truncate">{module.title}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="text-white hover:bg-white/20 border-white/20 text-xs lg:text-sm px-2 lg:px-3 flex-shrink-0"
            >
              <Minimize2 className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Minimize</span>
            </Button>
          </div>
        </div>

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
    <div className="bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 min-h-screen">
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="mx-auto px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
              <Link
                className="hidden lg:block"
                href={`/courses/${courseId}/modules/${moduleId}`}
              >
                <Button
                  variant="outline"
                  className="hover:bg-slate-50 text-xs lg:text-sm px-2 lg:px-4"
                  size="sm"
                >
                  <ArrowLeft className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Back to Module</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div className="hidden md:flex items-center gap-2 text-xs lg:text-sm text-slate-600 min-w-0">
                <BookOpen className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                <span className="font-medium truncate">{course.title}</span>
                <span className="text-slate-400">•</span>
                <Home className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                <span className="font-medium truncate">{module.title}</span>
              </div>
            </div>
            <Button
              onClick={() => setIsFullscreen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs lg:text-sm px-3 lg:px-4 w-full sm:w-auto"
              size="sm"
            >
              <Maximize2 className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="sm:hidden">Fullscreen</span>
              <span className="hidden sm:inline">Fullscreen</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="space-y-4 lg:space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                <Play className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xs md:text-lg lg:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent break-words">
                  {video.title}
                </h1>
                <p className="text-slate-600 text-[10px] md:text-xs lg:text-sm mt-1">
                  Watch this video to continue your learning journey
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
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

          <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-200/60 shadow-sm">
            <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4">
              About this video
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 text-xs lg:text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <BookOpen className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-500 flex-shrink-0" />
                <span className="truncate">
                  <span className="font-medium">Course:</span> {course.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Home className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-500 flex-shrink-0" />
                <span className="truncate">
                  <span className="font-medium">Module:</span> {module.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 sm:col-span-2 lg:col-span-1">
                <Play className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-500 flex-shrink-0" />
                <span className="truncate">
                  <span className="font-medium">Video:</span> {video.title}
                </span>
              </div>
            </div>
          <Link
            className="block lg:hidden mt-4 w-full"
            href={`/courses/${courseId}/modules/${moduleId}`}
          >
            <Button
              variant="outline"
              className="hover:bg-slate-50 text-xs w-full lg:text-sm px-2 lg:px-4"
              size="sm"
            >
              <ArrowLeft className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Back to Module</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
