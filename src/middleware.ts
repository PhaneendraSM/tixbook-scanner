import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is trying to access login page while already authenticated
  if (pathname === '/login') {
    const token = request.cookies.get('authToken')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (token) {
      // User is already authenticated, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // For protected routes, check if user is authenticated
  const protectedRoutes = ['/', '/tickets'];
  if (protectedRoutes.includes(pathname)) {
    const token = request.cookies.get('authToken')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // User is not authenticated, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 