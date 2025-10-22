import { createSupabaseMiddleware } from '@/lib/supabase-middleware';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    const { session, response } = await createSupabaseMiddleware(req);
    
    // Protected routes - require authentication
    const protectedRoutes = ['/skills'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    // If trying to access protected route without auth, redirect to auth page
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL('/auth', req.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If authenticated and trying to access auth page, redirect to home
    if (pathname === '/auth' && session) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return response;
  } catch (error) {
    // If Supabase is not configured, allow all routes
    console.log('Supabase middleware not configured, allowing all routes');
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};