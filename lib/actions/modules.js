'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function getModulesForStudent(courseId) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error('User not authenticated.');
  }

  const { data: enrollment, error: enrollmentError } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userData.user.id)
    .eq('course_id', courseId)
    .single();

  if (enrollmentError || !enrollment) {
    if (enrollmentError?.code === 'PGRST116') {
      throw new Error('Student is not enrolled in this course.');
    }
    console.error('Error checking enrollment:', enrollmentError);
    throw new Error('Error checking enrollment.');
  }

  const { data, error } = await supabase
    .from('modules')
    .select('id, title, position')
    .eq('course_id', courseId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching modules:', error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function getModules(courseId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching modules:', error);
    throw new Error(error.message);
  }

  return data || [];
}

// Add a new module
export async function addModule(data) {
  const supabase = await createClient();

  const { data: module, error } = await supabase
    .from('modules')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Error adding module:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/modules');

  return module;
}

// Delete a module by ID
export async function deleteModule(moduleId) {
  const supabase = await createClient();

  const { error } = await supabase.from('modules').delete().eq('id', moduleId);

  if (error) {
    console.error('Error deleting module:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/modules');
  return { success: true };
}

// Get single module by ID
export async function getModuleById(moduleId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('modules')
    .select('id, title')
    .eq('id', moduleId)
    .single();

  if (error) {
    console.error('Error fetching module:', error);
    throw new Error(error.message);
  }

  return data;
}

// Update module by ID
export async function updateModule({ moduleId, updates }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('modules')
    .update(updates)
    .eq('id', moduleId);

  if (error) {
    console.error('Error updating module:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/modules');
  return { success: true };
}

export async function getStudentModuleData(courseId, moduleId) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error('User not authenticated.');
  }

  const { data: enrollment, error: enrollmentError } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userData.user.id)
    .eq('course_id', courseId)
    .single();

  if (enrollmentError || !enrollment) {
    if (enrollmentError?.code === 'PGRST116') {
      throw new Error('Student is not enrolled in this course.');
    }
    console.error('Error checking enrollment:', enrollmentError);
    throw new Error('Error checking enrollment.');
  }

  const [courseResult, moduleResult, videosResult] = await Promise.all([
    supabase.from('courses').select('title').eq('id', courseId).single(),
    supabase.from('modules').select('title').eq('id', moduleId).single(),
    supabase
      .from('videos')
      .select('id, title')
      .eq('module_id', moduleId)
      .order('created_at', { ascending: true }),
  ]);

  if (courseResult.error || moduleResult.error) {
    throw new Error('Course or Module not found.');
  }

  if (videosResult.error) {
    throw new Error('Error fetching videos.');
  }

  return {
    course: courseResult.data,
    module: moduleResult.data,
    videos: videosResult.data,
  };
}
