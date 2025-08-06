'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';

// Test function to check if server actions are working
export async function testServerAction() {
  try {
    console.log('Test server action called');
    console.log('Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
    return { success: true, message: 'Server action working' };
  } catch (error) {
    console.error('Test server action error:', error);
    return { success: false, error: error.message };
  }
}

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
    .order('created_at', { ascending: true });

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
    console.log('addStudent called with data:', data);

    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    console.log('Creating user with Supabase admin...');
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });

    if (userError) {
      console.error('Supabase user creation error:', userError);
      throw new Error(userError.message);
    }

    console.log('User created successfully:', userData.user.id);

    console.log('Creating profile...');
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userData.user.id,
        name: data.name,
        email: data.email,
        role: 'student',
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw new Error(profileError.message);
    }

    console.log('Profile created successfully');

    if (data.courseIds && data.courseIds.length > 0) {
      console.log('Enrolling in courses:', data.courseIds);
      const enrollmentData = data.courseIds.map((courseId) => ({
        user_id: userData.user.id,
        course_id: courseId,
      }));

      const { error: enrollmentError } = await supabaseAdmin
        .from('enrollments')
        .insert(enrollmentData);

      if (enrollmentError) {
        console.error('Error enrolling student in courses:', enrollmentError);
        // Don't throw here, just log the error
      } else {
        console.log('Enrollment created successfully');
      }
    }

    revalidatePath('/admin/students');
    console.log('Student creation completed successfully');
    return { success: true, id: userData.user.id };
  } catch (error) {
    console.error('Error adding student:', error);
    console.error('Error stack:', error.stack);
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

export async function updateStudent(id, updatedData) {
  const supabase = await createClient();

  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name: updatedData.name,
        email: updatedData.email,
      })
      .eq('id', id);

    if (profileError) throw new Error(profileError.message);

    if (Array.isArray(updatedData.courseIds)) {
      const { error: deleteError } = await supabase
        .from('enrollments')
        .delete()
        .eq('user_id', id);

      if (deleteError) throw new Error(deleteError.message);

      if (updatedData.courseIds.length > 0) {
        const newEnrollments = updatedData.courseIds.map((courseId) => ({
          user_id: id,
          course_id: courseId,
        }));

        const { error: insertError } = await supabase
          .from('enrollments')
          .insert(newEnrollments);

        if (insertError) throw new Error(insertError.message);
      }
    }

    revalidatePath('/admin/students');
    return { success: true };
  } catch (error) {
    console.error('Error updating student:', error);
    throw new Error(error.message || 'Failed to update student');
  }
}
