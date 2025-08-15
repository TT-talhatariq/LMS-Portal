'use client';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Breadcrumbs = ({ courseId }) => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  // Getting Data Form Pre-Fetched Query
  const { data } = useQuery({
    queryKey: ['courseData', courseId],
    queryFn: () => getCourseBreadCrumbs(courseId),
    staleTime: Infinity,
  });

  /// Course-Bread-Crumbs
  if (segments[0] === 'courses') {
    breadcrumbs.push({ label: 'Courses', href: '/courses' });

    const courseId = segments[1];
    if (!courseId) return;

    breadcrumbs.push({
      label: data[0].title,
      href: `/courses/${courseId}`,
    });

    if (segments[2] === 'modules') {
      const moduleId = segments[3];
      if (!moduleId) return;

      const module = data[0].modules.find((m) => m.id === moduleId);
      breadcrumbs.push({
        label: module?.title || 'Module',
        href: `/courses/${courseId}/modules/${moduleId}`,
      });

      if (segments[4] === 'videos') {
        const videoId = segments[5];
        if (!videoId) return;

        const video = module?.videos.find((v) => v.id === videoId);
        breadcrumbs.push({
          label: video?.title || 'Video',
          href: `/courses/${courseId}/modules/${moduleId}/videos/${videoId}`,
        });
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
