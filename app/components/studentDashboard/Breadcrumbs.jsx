'use client';
import { ChevronRight } from 'lucide-react';
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
