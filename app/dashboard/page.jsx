'use client';
import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardStudent = () => {
  // const courses = [
  //   {
  //     id: '1',
  //     title: 'React for Beginners',
  //   },
  //   {
  //     id: '2',
  //     title: 'Advanced JavaScript',
  //   },
  //   {
  //     id: '3',
  //     title: 'UI/UX Design Fundamentals',
  //   },
  // ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r flex justify-between items-center from-white to-emerald-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Welcome back! 👋
          </h1>
          <p className="text-slate-600 mt-2">
            Choose a course to continue learning.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
          <Link href="/dashboard/courses">Start Learning</Link>
        </Button>
      </div>

      {/* Courses List */}
      {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm"> */}
      {/* <h2 className="text-xl font-semibold text-slate-800 mb-4">
          My Courses
        </h2> */}
      {/* 
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <h3 className="font-medium text-slate-800">{course.title}</h3>
              </div>

              <Link href={`/dashboard/courses/${course.id}`}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  View Course
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default DashboardStudent;
