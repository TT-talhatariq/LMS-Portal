'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronRight,
  PlayCircle,
  BookOpen,
  X,
} from 'lucide-react';
import { getCourseSidebarData } from '@/lib/actions/getCourseSidebarData';

const CourseSidebar = ({ isOpen, onClose }) => {
  const { courseId, videoId } = useParams();
  const [openModules, setOpenModules] = useState({});

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['courseSidebarData', courseId],
    queryFn: () => getCourseSidebarData(courseId),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (data?.modules && videoId) {
      const currentModule = data.modules.find((module) =>
        module.videos.some((video) => video.id === videoId),
      );
      if (currentModule) {
        setOpenModules((prev) => ({
          ...prev,
          [currentModule.id]: true,
        }));
      }
    }
  }, [data, videoId]);

  const toggleModule = (id) => {
    setOpenModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading) {
    return <LoadingSidebar />;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`
        fixed top-[65px] right-0 bottom-0 z-50
      w-72 lg:w-80 bg-white/95 backdrop-blur-md
      border-l border-slate-200/60 shadow-xl lg:shadow-none
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      lg:static lg:translate-x-0 lg:min-h-screen
      flex flex-col
    `}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <BookOpen className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-800 line-clamp-1">
              Course Modules
            </h2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-500 hover:text-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {data?.modules.length > 0 ? (
            data.modules.map((module) => (
              <div
                key={module.id}
                className="rounded-lg border border-slate-200 overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {openModules[module.id] ? (
                      <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">
                        Module {module.position}: {module.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {module.videos.length} videos
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
                    openModules[module.id] ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="space-y-1 p-2 bg-slate-50 border-t border-slate-200">
                    {module.videos.map((video) => {
                      const isActive = video.id === videoId;

                      return (
                        <Link
                          key={video.id}
                          href={`/courses/${courseId}/modules/${module.id}/videos/${video.id}`}
                          onClick={onClose}
                        >
                          <div
                            className={`
                              flex items-center gap-3 p-2 rounded-md transition-colors
                              ${isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-slate-100 text-slate-700'}
                            `}
                          >
                            <PlayCircle
                              className={`w-4 h-4 flex-shrink-0 ${
                                isActive ? 'text-emerald-500' : 'text-slate-400'
                              }`}
                            />
                            <span
                              className={`text-sm line-clamp-2 min-w-0 flex-1`}
                            >
                              {video.position}. {video.title}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-500">
              No modules found for this course.
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

const LoadingSidebar = ({ isOpen, onClose }) => (
  <>
    <div
      className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={onClose}
    ></div>

    <aside
      className={`
        fixed top-[65px] right-0 bottom-0 z-50
        w-64 sm:w-72 lg:w-80 bg-white/95 backdrop-blur-md
        border-l border-slate-200/60 shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:static lg:translate-x-0 lg:min-h-screen
        flex flex-col p-4 space-y-4
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-6 h-6 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="h-5 w-28 sm:w-40 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="w-6 h-6 bg-slate-200 rounded-full animate-pulse lg:hidden"></div>
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-slate-200 overflow-hidden animate-pulse"
        >
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-5 h-5 bg-slate-200 rounded-sm"></div>
              <div className="min-w-0 space-y-1">
                <div className="h-4 w-32 sm:w-48 bg-slate-200 rounded"></div>
                <div className="h-3 w-24 sm:w-32 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block space-y-2 p-2 bg-slate-50 border-t border-slate-200">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 p-2 rounded-md">
                <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
                <div className="h-3 w-48 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  </>
);

export default CourseSidebar;
