'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
export async function getCourses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function addCourse(data) {
  const supabase = await createClient();
  const { data: course, error } = await supabase.from('courses').insert(data);
  if (error) {
    console.error('Error adding course:', error);
    throw new Error(error.message);
  }
  return course;
}

export async function deleteCourse(courseId) {
  const supabase = await createClient();

  const { error } = await supabase.from('courses').delete().eq('id', courseId);

  if (error) {
    console.error('Error deleting course:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/courses');
  return { success: true };
}

export async function getCourseById(courseId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('courses')
    .select('id, title')
    .eq('id', courseId)
    .single();

  if (error) {
    console.error('Error fetching course:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateCourse(courseId, updates) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId);

  if (error) {
    console.error('Error updating course:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/courses');
  return { success: true };
}

// For Students - Get Enrolled Courses
export async function getEnrolledCourses(userId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('enrollments')
    .select('course:course_id(id, title, description)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching enrolled courses:', error);
    return [];
  }

  return data.map((enrollment) => enrollment.course);
}
