'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';

export async function getStudents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      *,
      enrollments (
        id,
        course_id,
        created_at,
        courses (
          id,
          title,
          description
        )
      )
    `,
    )
    .eq('role', 'student')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching students:', error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function getCourses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching courses:', error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function addStudent(data) {
  try {
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });

    if (userError) throw new Error(userError.message);

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userData.user.id,
        name: data.name,
        email: data.email,
        role: 'student',
      });

    if (profileError) throw new Error(profileError.message);

    if (data.courseIds && data.courseIds.length > 0) {
      const enrollmentData = data.courseIds.map((courseId) => ({
        user_id: userData.user.id,
        course_id: courseId,
      }));

      const { error: enrollmentError } = await supabaseAdmin
        .from('enrollments')
        .insert(enrollmentData);

      if (enrollmentError) {
        console.error('Error enrolling student in courses:', enrollmentError);
      }
    }

    revalidatePath('/admin/students');
    return { success: true, id: userData.user.id };
  } catch (error) {
    console.error('Error adding student:', error);
    throw new Error(error.message || 'Failed to create student');
  }
}

export async function deleteStudent(id) {
  const supabase = await createClient();

  try {
    // Delete profile (enrollments will be deleted automatically due to CASCADE)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    revalidatePath('/admin/students');
    return { success: true };
  } catch (error) {
    console.error('Error deleting student:', error);
    throw new Error(error.message || 'Failed to delete student');
  }
}

// Additional helper functions for enrollment management
export async function enrollStudentInCourse(userId, courseId) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('enrollments').insert({
      user_id: userId,
      course_id: courseId,
    });

    if (error) {
      if (error.code === '23505') {
        throw new Error('Student is already enrolled in this course');
      }
      throw new Error(error.message);
    }

    revalidatePath('/admin/students');
    return { success: true };
  } catch (error) {
    console.error('Error enrolling student:', error);
    throw new Error(error.message || 'Failed to enroll student');
  }
}

export async function unenrolunenrollStudentFromCourselStudentFromCourse(
  userId,
  courseId,
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin/students');
    return { success: true };
  } catch (error) {
    console.error('Error unenrolling student:', error);
    throw new Error(error.message || 'Failed to unenroll student');
  }
}
