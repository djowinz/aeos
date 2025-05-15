import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/signup', 
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/api/login', // Allow API access for login
  '/api/signup', // Allow API access for signup
  '/api/auth/callback', // Auth0 callback endpoint
  '/auth/callback', // Auth0 callback page
];

// Auth flow pages that authenticated users should be redirected from
const authFlowPaths = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/auth/callback',
];

// Check if the path matches any of the public paths
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => {
    return path === publicPath || path.startsWith(`${publicPath}/`);
  });
};

// Check if the path is an auth flow page
const isAuthFlowPath = (path: string) => {
  return authFlowPaths.some(authPath => {
    return path === authPath || path.startsWith(`${authPath}/`);
  });
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is for static assets (skip middleware for assets)
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') // Skip files with extensions (images, etc.)
  ) {
    return NextResponse.next();
  }
  
  // Handle Auth0 callback - extract token and pass to backend
  if (pathname === '/auth/callback') {
    // Get auth0 token from query params
    const authCode = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');
    
    if (authCode && state) {
      // Redirect to API endpoint to exchange code for token
      const apiUrl = new URL('/api/auth/callback', request.url);
      apiUrl.searchParams.set('code', authCode);
      apiUrl.searchParams.set('state', state);
      
      return NextResponse.redirect(apiUrl);
    }
  }
  
  // Handle API Auth0 callback - used by the backend to set cookies
  if (pathname === '/api/auth/callback') {
    // This endpoint should be handled by an API route that exchanges
    // the code for a token via backend and sets the session cookie
    return NextResponse.next();
  }
  
  // Check for session cookie
  const sessionCookie = request.cookies.get('session');
  
  // If user is authenticated and trying to access an auth flow page, redirect to dashboard
  if (sessionCookie && isAuthFlowPath(pathname)) {
    try {
      // Verify token is valid before redirecting
      const token = sessionCookie.value;
      const decoded = jwt.decode(token);
      
      if (decoded && typeof decoded !== 'string' && decoded.exp && decoded.exp * 1000 > Date.now()) {
        // Token is valid, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // If token validation fails, continue normal flow
      console.log('Token validation failed:', error);
    }
  }
  
  // Skip middleware for public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // If session cookie doesn't exist or is invalid, redirect to login
  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', encodeURIComponent(pathname));
    return NextResponse.redirect(loginUrl);
  }
  
  // Cookie exists, but let's check if it's expired
  try {
    // If you're using JWT tokens stored in cookies, you could parse and validate them here
    const token = sessionCookie.value;
    const decoded = jwt.decode(token);
    if (decoded && typeof decoded !== 'string' && decoded.exp && decoded.exp * 1000 < Date.now()) {
      throw new Error('Token expired');
    }
  } catch (error) {
    // If token validation fails, redirect to login
    console.log('Token validation failed:', error);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', encodeURIComponent(pathname));
    return NextResponse.redirect(loginUrl);
  }
  
  // Continue to the requested page if authenticated
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. / (index page)
     * 2. /api/login, /api/signup (authentication endpoints)
     * 3. /_next (Next.js internals)
     * 4. /fonts, /icons, /images (static assets)
     * 5. /favicon.ico, /sitemap.xml (static files)
     * 6. All files with extensions (.js, .css, etc)
     */
    '/((?!^$|api/login|api/signup|_next/static|_next/image|fonts|icons|images|favicon.ico|sitemap.xml|.*\\..*).*)'],
}; 