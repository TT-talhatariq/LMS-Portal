import { createClient } from '@/utils/supabase/client';

export async function getUserId() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id;
}
