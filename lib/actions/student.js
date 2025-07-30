'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';

export async function getStudents() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching students:', error);
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

    revalidatePath('/dashboard/students');
    return { success: true, id: userData.user.id };
  } catch (error) {
    console.error('Error adding student:', error);
    throw new Error(error.message || 'Failed to create student');
  }
}


export async function deleteStudent(id) {
  const supabase = await createClient();

  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    revalidatePath('/dashboard/students');
    return { success: true };
  } catch (error) {
    console.error('Error deleting student:', error);
    throw new Error(error.message || 'Failed to delete student');
  }
}
