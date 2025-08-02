'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function getVideos(moduleId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('module_id', moduleId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching videos:', error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function addVideo(data) {
  const supabase = await createClient();

  const { data: video, error } = await supabase
    .from('videos')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Error adding video:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/modules'); 
  return video;
}

export async function deleteVideo(videoId) {
  const supabase = await createClient();

  const { error } = await supabase.from('videos').delete().eq('id', videoId);

  if (error) {
    console.error('Error deleting video:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/modules'); 
  return { success: true };
}

export async function getVideoById(videoId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .single();

  if (error) {
    console.error('Error fetching video:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateVideo({ videoId, updates }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('videos')
    .update(updates)
    .eq('id', videoId);

  if (error) {
    console.error('Error updating video:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/modules');
  return { success: true };
}
