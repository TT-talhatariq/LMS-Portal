'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpen, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CourseDetail = () => {
  const { courseId } = useParams();

  // Mock data - in real app, fetch based on courseId
  const course = {
    id: courseId,
    title: 'React for Beginners',
  };

  const modules = [
    {
      id: '1',
      title: 'Getting Started with React',
      priority: 1,
    },
    {
      id: '2',
      title: 'Components and Props',
      priority: 2,
    },
    {
      id: '3',
      title: 'State and Event Handling',
      priority: 3,
    },
    {
      id: '4',
      title: 'Advanced State Management',
      priority: 4,
    },
    {
      id: '5',
      title: 'React Router',
      priority: 5,
    },
    {
      id: '6',
      title: 'Building a Complete Project',
      priority: 6,
    },
  ];

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
              {course.title}
            </h1>
            <p className="text-slate-600 text-sm">Course modules</p>
          </div>
        </div>
      </div>

      {/* Course Modules */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Modules</h2>

        <div className="space-y-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Home className="h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="font-medium text-slate-800">
                    Module {module.priority}: {module.title}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
