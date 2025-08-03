'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Play, ArrowLeft, BookOpen, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getStudentVideoData } from '@/lib/actions/ videos';

const VideoDetail = () => {
  const { courseId, moduleId, videoId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['studentVideoData', courseId, moduleId, videoId],
    queryFn: () => getStudentVideoData(courseId, moduleId, videoId),
    enabled: !!courseId && !!moduleId && !!videoId,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-white to-emerald-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm animate-pulse">
          <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="h-64 w-full bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error: {error.message || 'Failed to load video details.'}
      </div>
    );
  }

  if (!data?.video || !data?.module || !data?.course) {
    return (
      <div className="p-8 text-center text-slate-500">
        Video, module, or course not found. Please check the URL.
      </div>
    );
  }

  const { course, module, video } = data;
  const bunnyStreamUrl = `https://iframe.videodelivery.net/${video.bunny_video_id}`;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-white to-emerald-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Play className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.title}</span>
              <span className="text-slate-400">•</span>
              <Home className="h-4 w-4" />
              <span>{module.title}</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {video.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link href={`/dashboard/courses/${courseId}/modules/${moduleId}`}>
          <Button variant="outline" className="hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Module
          </Button>
        </Link>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
          <iframe
            src={bunnyStreamUrl}
            className="w-full h-full"
            title={video.title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
