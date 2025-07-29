'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  BookOpen,
  Home,
  Video,
  TrendingUp,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '124',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
    },
    {
      title: 'Active Courses',
      value: '18',
      change: '+3',
      changeType: 'positive',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
    },
    {
      title: 'Course Modules',
      value: '67',
      change: '+8',
      changeType: 'positive',
      icon: Home,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
    },
    {
      title: 'Video Lessons',
      value: '142',
      change: '+15',
      changeType: 'positive',
      icon: Video,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'student',
      message: 'New student registered: John Doe',
      time: '2 hours ago',
      icon: Users,
      color: 'text-green-600',
    },
    {
      id: 2,
      type: 'course',
      message: 'Course "React Advanced" was updated',
      time: '4 hours ago',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      id: 3,
      type: 'module',
      message: 'New module added to JavaScript Basics',
      time: '6 hours ago',
      icon: Home,
      color: 'text-purple-600',
    },
    {
      id: 4,
      type: 'video',
      message: 'Video lesson uploaded successfully',
      time: '8 hours ago',
      icon: Video,
      color: 'text-orange-600',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Student',
      description: 'Register a new student account',
      href: '/admin/students',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Create Course',
      description: 'Start building a new course',
      href: '/admin/courses',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Add Module',
      description: 'Create course modules',
      href: '/admin/modules',
      icon: Home,
      color: 'from-purple-500 to-violet-500',
    },
    {
      title: 'Upload Video',
      description: 'Add new video content',
      href: '/admin/videos',
      icon: Video,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-blue-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Welcome back, Admin! 👋
            </h1>
            <p className="text-slate-600 mt-2">
              Here's what's happening with your LMS today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="p-6 border-b border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-800">
              Quick Actions
            </h3>
            <p className="text-slate-600 text-sm">Common tasks and shortcuts</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link key={index} href={action.href}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                      <div
                        className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}
                      >
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-800 font-medium text-sm">
                          {action.title}
                        </p>
                        <p className="text-slate-600 text-xs">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
