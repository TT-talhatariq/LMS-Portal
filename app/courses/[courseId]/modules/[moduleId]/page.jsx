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
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-white to-emerald-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm animate-pulse">
          <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error: {error.message || 'Failed to load data.'}
      </div>
    );
  }

  if (!data?.module || !data?.course) {
    return (
      <div className="p-8 text-center text-slate-500">
        Module or Course not found. Please check the URL.
      </div>
    );
  }

  const { course, module, videos } = data;

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
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {module.title}
            </h1>
            <p className="text-slate-600 text-sm">Module videos</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link href={`/courses/${courseId}`}>
          <Button variant="outline" className="hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
        </Link>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Videos</h2>

        <div className="space-y-4">
          {videos && videos.length > 0 ? (
            videos.map((video, index) => (
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
                  href={`/courses/${courseId}/modules/${moduleId}/videos/${video.id}`}
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
            ))
          ) : (
            <div className="p-4 text-center text-slate-500">
              No videos have been added to this module yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
