'use client';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Breadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  // if (segments[0] === 'dashboard') {
  //   breadcrumbs.push({ label: 'Dashboard', href: '/dashboard' });
  // }

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

export default Breadcrumbs;
