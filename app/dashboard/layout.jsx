'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  BookOpen,
  User,
  LogOut,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import Header from '../components/studentDashboard/Header';

const navigationItems = [
  {
    label: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    href: '/dashboard',
  },
  {
    label: 'My Courses',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/dashboard/courses',
  },
];

const Breadcrumbs = ({ pathname }) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  if (segments[0] === 'dashboard') {
    breadcrumbs.push({ label: 'Dashboard', href: '/dashboard' });

    if (segments[1] === 'courses') {
      breadcrumbs.push({ label: 'Courses', href: '/dashboard/courses' });

      if (segments[2]) {
        breadcrumbs.push({
          label: 'Course Details',
          href: `/dashboard/courses/${segments[2]}`,
        });

        if (segments[3] === 'modules' && segments[4]) {
          breadcrumbs.push({
            label: 'Module',
            href: `/dashboard/courses/${segments[2]}/modules/${segments[4]}`,
          });

          if (segments[5] === 'videos' && segments[6]) {
            breadcrumbs.push({
              label: 'Video',
              href: `/dashboard/courses/${segments[2]}/modules/${segments[4]}/videos/${segments[6]}`,
            });
          }
        }
      }
    }
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-slate-600">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          <Link
            href={breadcrumb.href}
            className={`hover:text-slate-800 transition-colors ${
              index === breadcrumbs.length - 1
                ? 'text-slate-800 font-medium'
                : ''
            }`}
          >
            {breadcrumb.label}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default function StudentLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-slate-200/60 shadow-lg">
          <div className="p-6">
            <nav className="space-y-1">
              {navigationItems.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`
                      group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                          : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-emerald-50 hover:text-slate-800'
                      }
                    `}
                  >
                    <div
                      className={`
                      transition-transform duration-200 group-hover:scale-110
                      ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}
                    `}
                    >
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-80"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom section */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-4 border border-emerald-200/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Learning Progress
                  </p>
                  <p className="text-xs text-slate-600">
                    3 courses in progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div>
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs pathname={pathname} />
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
