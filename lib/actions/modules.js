'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';

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
    .select('*')
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
