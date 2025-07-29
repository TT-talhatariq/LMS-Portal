'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Play, ArrowLeft, BookOpen, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VideoDetail = () => {
  const { courseId, moduleId, videoId } = useParams();

  // Mock data - in real app, fetch based on IDs
  const course = {
    id: courseId,
    title: 'React for Beginners',
  };

  const module = {
    id: moduleId,
    title: 'State and Event Handling',
  };

  const video = {
    id: videoId,
    title: 'Understanding State',
    bunnyStreamUrl: 'https://iframe.videodelivery.net/VIDEO_ID_1',
  };

  return (
    <div className="space-y-8">
      {/* Video Header */}
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

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href={`/dashboard/courses/${courseId}/modules/${moduleId}`}>
          <Button variant="outline" className="hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Module
          </Button>
        </Link>
      </div>

      {/* Video Player */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <Play className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Video Player</p>
            <p className="text-slate-500 text-sm mt-2">
              Embedded Bunny Stream URL: <br />
              <code className="text-xs bg-slate-200 px-2 py-1 rounded">
                {video.bunnyStreamUrl}
              </code>
            </p>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600">
          <p>
            This is where the Bunny Stream embedded video will be displayed
            using the URL: {video.bunnyStreamUrl}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
