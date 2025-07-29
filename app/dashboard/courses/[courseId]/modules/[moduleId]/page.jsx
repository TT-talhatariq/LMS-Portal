'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Play, Home, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ModuleDetail = () => {
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

  const videos = [
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
    {
      id: '13',
      title: 'State Best Practices',
      bunnyStreamUrl: 'https://iframe.videodelivery.net/VIDEO_ID_5',
    },
    {
      id: '14',
      title: 'Hands-on Exercise: Todo App',
      bunnyStreamUrl: 'https://iframe.videodelivery.net/VIDEO_ID_6',
    },
    {
      id: '15',
      title: 'Module Quiz',
      bunnyStreamUrl: 'https://iframe.videodelivery.net/VIDEO_ID_7',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-white to-emerald-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
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
            <p className="text-slate-600 text-sm">Module videos</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href={`/dashboard/courses/${courseId}`}>
          <Button variant="outline" className="hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
        </Link>
      </div>

      {/* Videos List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Videos</h2>

        <div className="space-y-4">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Play className="h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="font-medium text-slate-800">
                    {index + 1}. {video.title}
                  </h3>
                </div>
              </div>

              <Link
                href={`/dashboard/courses/${courseId}/modules/${moduleId}/videos/${video.id}`}
              >
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  Watch Video
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
