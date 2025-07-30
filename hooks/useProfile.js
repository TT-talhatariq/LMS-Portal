'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useProfile(defaultRole = 'Student') {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        setUserName(profile?.name || user.email || defaultRole);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [defaultRole]);

  return { userName, loading };
}
