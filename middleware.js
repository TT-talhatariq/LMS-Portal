import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookies().getAll(),
        setAll: (values) => values.forEach((v) => cookies().set(v)),
      },
    },
  );

  if (
    pathname.startsWith('/auth') ||
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const userRole = profile?.role;

  if (
    userRole === 'admin' &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if (userRole === 'student' && !pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (pathname.startsWith('/admin')) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else if (pathname.startsWith('/dashboard')) {
    if (userRole !== 'admin' && userRole !== 'student') {
      return NextResponse.redirect(new URL('/auth', req.url));
    }
    
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
