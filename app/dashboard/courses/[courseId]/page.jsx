'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpen, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getModulesForStudent } from '@/lib/actions/modules';
import { getCourseById } from '@/lib/actions/courses';
import LoadingSkeleton from '@/app/components/common/LoadingSkeleton';

const CourseDetail = () => {
  const { courseId } = useParams();

  const {
    data: course,
    isLoading: isLoadingCourse,
    isError: isCourseError,
  } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  const {
    data: modules,
    isLoading: isLoadingModules,
    isError: isModulesError,
  } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => getModulesForStudent(courseId),
    enabled: !!courseId,
  });

  if (isLoadingCourse || isLoadingModules) {
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

  if (isCourseError) {
    return (
      <div className="text-center text-red-500">
        Error: Failed to load course details.
      </div>
    );
  }

  if (isModulesError) {
    return (
      <div className="text-center text-red-500">
        Error: Failed to load modules.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-white to-emerald-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {course?.title || 'Course Title'}
            </h1>
            <p className="text-slate-600 text-sm">Course modules</p>
          </div>
        </div>
      </div>

      {/* Course Modules */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Modules</h2>

        <div className="space-y-4">
          {modules && modules.length > 0 ? (
            modules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h3 className="font-medium text-slate-800">
                      Module {module.position}: {module.title}
                    </h3>
                  </div>
                </div>

                <Link
                  href={`/dashboard/courses/${courseId}/modules/${module.id}`}
                >
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  >
                    View Module
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-slate-500">
              No modules have been added to this course yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
