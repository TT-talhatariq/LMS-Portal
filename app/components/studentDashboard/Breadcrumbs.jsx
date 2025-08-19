'use client';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Breadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  if (segments[0] === 'courses') {
    breadcrumbs.push({ label: 'Courses', href: '/courses' });

    const courseId = segments[1];
    if (courseId) {
      breadcrumbs.push({
        label: 'Course Details',
        href: `/courses/${courseId}`,
      });

      if (segments[2] === 'modules') {
        const moduleId = segments[3];
        if (moduleId) {
          breadcrumbs.push({
            label: 'Module',
            href: `/courses/${courseId}/modules/${moduleId}`,
          });

          if (segments[4] === 'videos') {
            const videoId = segments[5];
            if (videoId) {
              breadcrumbs.push({
                label: 'Video',
                href: `/courses/${courseId}/modules/${moduleId}/videos/${videoId}`,
              });
            }
          }
        }
      }
    }
  }

  if (breadcrumbs.length === 0) return null;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 lg:p-4 border border-slate-200/40 shadow-sm">
      <nav className="flex md:hidden items-center space-x-1 text-xs text-slate-600">
        <div className="flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded-md">
          <Home className="h-3 w-3 text-emerald-600" />
          <span className="text-emerald-700 font-medium">Navigation</span>
        </div>

        {breadcrumbs.length > 1 && (
          <>
            <ChevronRight className="h-3 w-3 mx-1 text-slate-400" />
            <Link
              href={breadcrumbs[breadcrumbs.length - 2].href}
              className="hover:text-slate-800 transition-colors bg-slate-100 px-2 py-1 rounded-md"
            >
              {breadcrumbs[breadcrumbs.length - 2].label}
            </Link>
          </>
        )}

        <ChevronRight className="h-3 w-3 mx-1 text-slate-400" />
        <span className="text-slate-800 font-medium bg-gradient-to-r from-emerald-100 to-teal-100 px-2 py-1 rounded-md border border-emerald-200/50">
          {breadcrumbs[breadcrumbs.length - 1].label}
        </span>
      </nav>

      <nav className="hidden md:flex lg:hidden items-center space-x-1 text-sm text-slate-600">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />
            )}
            <Link
              href={breadcrumb.href}
              className={`hover:text-slate-800 transition-colors px-2 py-1 rounded-md ${
                index === breadcrumbs.length - 1
                  ? 'text-slate-800 font-medium bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200/50'
                  : 'hover:bg-slate-100'
              }`}
            >
              {breadcrumb.label}
            </Link>
          </div>
        ))}
      </nav>

      <nav className="hidden lg:flex items-center space-x-1 text-sm text-slate-600">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            )}
            <Link
              href={breadcrumb.href}
              className={`group hover:text-slate-800 transition-all duration-200 px-3 py-2 rounded-lg ${
                index === breadcrumbs.length - 1
                  ? 'text-slate-800 font-medium bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200/50 shadow-sm'
                  : 'hover:bg-slate-100 hover:shadow-sm'
              }`}
            >
              {breadcrumb.label}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Breadcrumbs;
