'use client';
import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getEnrolledCourses } from '@/lib/actions/courses';
import { getUserId } from '@/lib/actions/getUserId';
import LoadingSkeleton from '@/app/components/common/LoadingSkeleton';

const MyCourses = () => {
  const {
    data: userId,
    isLoading: loadingUserId,
    isError: errorUserId,
    error: userIdError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getUserId,
  });

  const {
    data: courses,
    isLoading: loadingCourses,
    isError: errorCourses,
    error: coursesError,
  } = useQuery({
    queryKey: ['courses', userId],
    queryFn: () => getEnrolledCourses(userId),
    enabled: !!userId,
  });

  const isLoading = loadingUserId || loadingCourses;
  const hasError = errorUserId || errorCourses;

  if (hasError) {
    return (
      <div className="text-red-500 bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-red-200/60 shadow-sm mx-4 lg:mx-0">
        {errorUserId && (
          <p className="text-sm lg:text-base mb-2">
            Error fetching user info: {userIdError.message}
          </p>
        )}
        {errorCourses && (
          <p className="text-sm lg:text-base">
            Error fetching courses: {coursesError.message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="relative bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/30 rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-emerald-200/40 shadow-lg shadow-emerald-100/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-emerald-100/30 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-tr from-teal-100/20 to-transparent rounded-full blur-xl"></div>

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 transform hover:scale-105 transition-transform duration-300">
                <BookOpen className="h-6 w-6 lg:h-7 lg:w-7 text-white drop-shadow-sm" />
              </div>
              <div className="absolute inset-0 w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl lg:rounded-2xl animate-pulse opacity-20"></div>
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-emerald-700 bg-clip-text text-transparent leading-tight">
                Welcome back! 👋
              </h1>
              <p className="text-slate-600 capitalize font-bold text-xs lg:text-sm">
                Discover and learn at your own pace
              </p>
            </div>
          </div>

          <div className="hidden lg:block flex-shrink-0">
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full border border-emerald-200/50">
              <span className="text-sm font-medium bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                ✨ Ready to learn?
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/20 via-emerald-400/30 to-teal-500/20"></div>
      </div>

      {/* Courses List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-200/60 shadow-sm">
        <div className="space-y-3 lg:space-y-4">
          {isLoading ? (
            <LoadingSkeleton count={6} />
          ) : courses?.length === 0 ? (
            <div className="text-center py-6 lg:py-8">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium text-sm lg:text-base">
                No courses enrolled yet
              </p>
              <p className="text-slate-500 text-xs lg:text-sm mt-1">
                Start exploring and enroll in your first course!
              </p>
            </div>
          ) : (
            courses?.map((course) => (
              <div
                key={course.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 lg:p-4 bg-slate-50 rounded-lg lg:rounded-xl hover:bg-slate-100 transition-colors group"
              >
                <Link href={`/courses/${course.id}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-sm text-slate-600 mt-1">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 text-xs lg:text-sm"
                  >
                    <span className="sm:hidden">View</span>
                    <span className="hidden sm:inline">View Course</span>
                    <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
