'use server';
import { createClient } from '@/utils/supabase/server';
import { getVideosByModule } from './videos';

export async function getCourseSidebarData(courseId) {
  const supabase = await createClient();

  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('title')
    .eq('id', courseId)
    .single();

  if (courseError) {
    console.error('Error fetching course:', courseError);
    throw new Error('Course not found.');
  }

  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id, title, position')
    .eq('course_id', courseId)
    .order('position', { ascending: true });

  if (modulesError) {
    console.error('Error fetching modules:', modulesError);
    throw new Error('Error fetching modules.');
  }

  const modulesWithVideos = await Promise.all(
    modules.map(async (module) => {
      const videos = await getVideosByModule(module.id);
      return {
        ...module,
        videos,
      };
    }),
  );

  return { course, modules: modulesWithVideos };
}
