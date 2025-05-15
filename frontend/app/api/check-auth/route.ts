import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    // Get the session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    // If no session cookie is found, return unauthorized
    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false, message: 'No session found' },
        { status: 401 }
      );
    }

    // Verify that the token is valid and not expired
    const token = sessionCookie.value;
    const decoded = jwt.decode(token);
    
    // Check if token is valid and not expired
    if (decoded && typeof decoded !== 'string' && decoded.exp && decoded.exp * 1000 > Date.now()) {
      // Token is valid, user is authenticated
      return NextResponse.json(
        { 
          authenticated: true, 
          user: {
            // Include safe user data (avoid sensitive info)
            sub: typeof decoded.sub === 'string' ? decoded.sub : null,
            email: typeof decoded.email === 'string' ? decoded.email : null,
          } 
        },
        { status: 200 }
      );
    }
    
    // Token is invalid or expired
    return NextResponse.json(
      { authenticated: false, message: 'Invalid or expired session' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error checking authentication:', error);
    
    return NextResponse.json(
      { authenticated: false, message: 'Authentication check failed' },
      { status: 500 }
    );
  }
} 