import { NextResponse } from 'next/server';
import { createMiddlewareClient } from './utils/supabase/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const supabase = createMiddlewareClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && (pathname === '/' || pathname.startsWith('/auth'))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = profile?.role;

    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  if (
    !user &&
    (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (
    user &&
    (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))
  ) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = profile?.role;

    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (
      pathname.startsWith('/dashboard') &&
      userRole !== 'admin' &&
      userRole !== 'student'
    ) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth/:path*', '/admin/:path*', '/dashboard/:path*'],
};
