'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Play, ArrowLeft, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getStudentModuleData } from '@/lib/actions/modules';
import LoadingSkeleton from '@/app/components/common/LoadingSkeleton';

const ModuleDetail = () => {
  const { courseId, moduleId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['studentModuleData', courseId, moduleId],
    queryFn: () => getStudentModuleData(courseId, moduleId),
    enabled: !!courseId && !!moduleId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="bg-gradient-to-r from-white to-emerald-50/50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-200/60 shadow-sm animate-pulse">
          <div className="h-8 lg:h-10 w-full bg-slate-200 rounded-lg lg:rounded-xl"></div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-200/60 shadow-sm">
          <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error.message || 'Failed to load data.'}
      </div>
    );
  }

  if (!data?.module || !data?.course) {
    return (
      <div className="p-6 lg:p-8 text-center">
        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-slate-400" />
        </div>
        <p className="text-slate-500 text-sm lg:text-base">
          Module or Course not found. Please check the URL.
        </p>
      </div>
    );
  }

  const { course, module, videos } = data;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-white to-emerald-50/50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
            <Play className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs lg:text-sm text-slate-600 mb-1">
              <BookOpen className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
              <span className="truncate">{course.title}</span>
            </div>
            <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent break-words">
              {module.title}
            </h1>
            <p className="text-slate-600 text-xs lg:text-sm">Module videos</p>
          </div>
        </div>
      </div>

      {/* Back to Course Button */}
      <div className="flex items-center justify-between">
        <Link href={`/courses/${courseId}`}>
          <Button 
            variant="outline" 
            className="hover:bg-slate-50 text-sm lg:text-base px-3 lg:px-4"
            size="sm"
          >
            <ArrowLeft className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Back to Course</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>

      {/* Videos Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-200/60 shadow-sm">
        <h2 className="text-lg lg:text-xl font-semibold text-slate-800 mb-4">Videos</h2>

        <div className="space-y-3 lg:space-y-4">
          {videos && videos.length > 0 ? (
            videos.map((video, index) => (
              <div
                key={video.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 lg:p-4 bg-slate-50 rounded-lg lg:rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Play className="h-4 w-4 lg:h-5 lg:w-5 text-emerald-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-800 text-sm lg:text-base break-words">
                      {index + 1}. {video.title}
                    </h3>
                  </div>
                </div>

                <Link
                  href={`/courses/${courseId}/modules/${moduleId}/videos/${video.id}`}
                  className="flex-shrink-0"
                >
                  <Button
                    size="sm"
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs lg:text-sm"
                  >
                    <span className="sm:hidden">Watch</span>
                    <span className="hidden sm:inline">Watch Video</span>
                    <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="p-6 lg:p-8 text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Play className="h-6 w-6 lg:h-8 lg:w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm lg:text-base">
                No videos have been added to this module yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;