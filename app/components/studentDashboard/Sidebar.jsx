'use client';
import Link from 'next/link';
import React from 'react';
import { BookOpen, GraduationCap, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navigationItems = [
  {
    label: 'My Courses',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/courses',
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64
        bg-white/80 backdrop-blur-md border-r border-slate-200/60 shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 pt-2 lg:pt-6">
          <nav className="space-y-1">
            {navigationItems.map((item, index) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={onClose}
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
