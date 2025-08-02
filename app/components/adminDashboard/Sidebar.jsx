'use client';
import React from 'react';
import { Home, Users, BookOpen, Video, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/admin',
  },
  {
    label: 'Manage Students',
    icon: <Users className="h-5 w-5" />,
    href: '/admin/students',
  },
  {
    label: 'Curriculum Builder',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/admin/courses/',
  },
  {
    label: 'Manage Modules',
    icon: <Home className="h-5 w-5" />,
    href: '/admin/modules',
  },
  {
    label: 'Manage Videos',
    icon: <Video className="h-5 w-5" />,
    href: '/admin/videos',
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-white/80 backdrop-blur-md border-r border-slate-200/60 shadow-lg">
      <div className="p-6">
        <div className="space-y-1">
          {navItems.map((item, index) => {
            const isActive =
              item.href === '/admin/courses/'
                ? pathname.startsWith('/admin/courses')
                : pathname === item.href;

            return (
              <Link
                key={index}
                href={item.href}
                className={`
        group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]
        ${
          isActive
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
            : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-blue-50 hover:text-slate-800'
        }
      `}
              >
                <div
                  className={`
          transition-transform duration-200 group-hover:scale-110
          ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}
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
        </div>
      </div>

      {/* Bottom decoration */}
      {/* <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4 border border-blue-200/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">LMS</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">LMS Portal</p>
              <p className="text-xs text-slate-600">Admin Dashboard</p>
            </div>
          </div>
        </div>
      </div> */}
    </aside>
  );
};

export default Sidebar;
