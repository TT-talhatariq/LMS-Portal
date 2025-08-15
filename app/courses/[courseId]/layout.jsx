import React from 'react';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import Breadcrumbs from '@/app/components/studentDashboard/Breadcrumbs';
import { getCourseBreadCrumbs } from '@/lib/actions/courses';


const CourseLayout = async ({ children, params }) => {
  const queryClient = new QueryClient();
  const { courseId } = await params;

  // Prefetch bread-crumbs data on the server with React Query
  await queryClient.prefetchQuery({
    queryKey: ['courseData', courseId],
    queryFn: () => getCourseBreadCrumbs(courseId),
  });

  // Serialize the cache for hydration on the client
  const dehydratedState = dehydrate(queryClient);
  const queryState = dehydratedState.queries[0]?.state;

  if (queryState?.error) {
    return (
      <div className="text-center text-red-500">
        Failed to load course details
      </div>
    );
  }

  if (!queryState?.data || queryState.data.length === 0) {
    return <div className="text-center text-red-500">Course Not Found</div>;
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="mb-6">
        <Breadcrumbs courseId={courseId} />
      </div>
      <div>{children}</div>
    </HydrationBoundary>
  );
};

export default CourseLayout;
