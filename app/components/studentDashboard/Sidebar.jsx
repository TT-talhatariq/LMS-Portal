'use client';
import Link from 'next/link';
import React from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import { usePathname } from 'next/navigation';
const navigationItems = [
  // {
  //   label: 'Dashboard',
  //   icon: <Home className="h-5 w-5" />,
  //   href: '/dashboard',
  // },
  {
    label: 'My Courses',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/dashboard/courses',
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <>
      <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-slate-200/60 shadow-lg">
        <div className="p-6">
          <nav className="space-y-1">
            {navigationItems.map((item, index) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
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
      </aside>
    </>
  );
};

export default Sidebar;
