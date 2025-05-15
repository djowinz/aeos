import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get the authorization code and state from query params
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    console.log(`Auth0 callback received - code: ${code?.substring(0, 10)}..., state: ${state}`);

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Exchange the code for a token via backend
    console.log(`Sending to backend API: ${process.env.API_URL || 'http://localhost:9000'}/api/auth/social-callback`);
    const requestBody = JSON.stringify({ code, state });
    console.log('Request body:', requestBody);
    
    const response = await fetch(`${process.env.API_URL || 'http://localhost:9000'}/api/auth/social-callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    const data = await response.json();

    console.log(`Backend response status: ${response.status}, data:`, data);

    if (!response.ok) {
      // If the response is not OK, return the error
      throw new Error(data.detail || 'Authentication failed');
    }

    // Set the cookie with the received token
    // Use the same name 'session' that we're checking in middleware
    const cookieStore = await cookies()
    cookieStore.set({
      name: 'session',
      value: data.access_token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax', // Use 'lax' for social login redirects
    });

    // Redirect to dashboard or the original requested URL
    const redirectTo = url.searchParams.get('redirect_to') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    console.error('Auth0 callback error:', error);
    // Redirect to login page on error
    return NextResponse.redirect(new URL('/login?error=auth0_callback_failed', request.url));
  }
} 