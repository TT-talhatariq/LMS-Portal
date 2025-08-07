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

export async function getStudents({
  page = 1,
  limit = 10,
  searchTerm = '',
} = {}) {
  const supabase = supabaseAdmin;
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('profiles')
      .select(
        `
        id,
        name,
        role,
        created_at,
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
        { count: 'exact' },
      )
      .eq('role', 'student');

    if (searchTerm && searchTerm.trim()) {
      query = query.ilike('name', `%${searchTerm.trim()}%`);
    }

    query = query
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data: profiles, error: profilesError, count } = await query;

    if (profilesError) {
      console.error('Error fetching students:', profilesError);
      throw new Error(profilesError.message);
    }

    const studentsWithEmails = await Promise.all(
      (profiles || []).map(async (profile) => {
        const { data: userData, error: userError } =
          await supabase.auth.admin.getUserById(profile.id);

        if (userError) {
          console.warn(
            `Could not find email for user ${profile.id}:`,
            userError,
          );
          return { ...profile, email: 'Email not found' };
        }

        return { ...profile, email: userData.user.email };
      }),
    );

    return {
      data: studentsWithEmails,
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
      hasNextPage: count > offset + limit,
      hasPreviousPage: page > 1,
      limit,
      offset,
    };
  } catch (error) {
    console.error('Error in getStudents:', error);
    throw new Error(error.message || 'Failed to fetch students');
  }
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

    // First, create the user in auth.users
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

    // Only proceed to create the profile if the user creation was successful
    if (userData && userData.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userData.user.id,
          name: data.name,
          role: 'student',
        });

      if (profileError) {
        // If profile creation fails, you might want to consider rolling back the user creation
        console.error('Profile creation error:', profileError);
        throw new Error(profileError.message);
      }
    } else {
      // This case should ideally not happen if userError is handled, but it's a good safeguard
      throw new Error('User creation failed with no specific error message.');
    }

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
    // Delete the user from auth.users using the admin client
    const { error: userError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (userError) {
      // Handle the case where the user might not exist in auth.users
      console.warn('Error deleting user from auth.users:', userError);
    }

    // Delete the profile (enrollments will be deleted automatically due to CASCADE)
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
  try {
    // Update the email in auth.users using the admin client
    if (updatedData.email) {
      const { data: userUpdateData, error: userUpdateError } =
        await supabaseAdmin.auth.admin.updateUserById(id, {
          email: updatedData.email,
        });

      if (userUpdateError) {
        console.error('Error updating user email:', userUpdateError);
        throw new Error(userUpdateError.message);
      }
    }

    // Update the profile table without the email column
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        name: updatedData.name,
      })
      .eq('id', id);

    if (profileError) throw new Error(profileError.message);

    if (Array.isArray(updatedData.courseIds)) {
      const { error: deleteError } = await supabaseAdmin
        .from('enrollments')
        .delete()
        .eq('user_id', id);

      if (deleteError) throw new Error(deleteError.message);

      if (updatedData.courseIds.length > 0) {
        const newEnrollments = updatedData.courseIds.map((courseId) => ({
          user_id: id,
          course_id: courseId,
        }));

        const { error: insertError } = await supabaseAdmin
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
