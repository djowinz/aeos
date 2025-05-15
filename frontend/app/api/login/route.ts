import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Call the backend API for authentication
    const response = await fetch(`${process.env.API_URL || 'http://localhost:9000'}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        
      // If the response is not OK, return the error
      return NextResponse.json(
        { error: data.detail || 'Authentication failed' },
        { status: response.status }
      );
    }

    // Set the cookie with the received token
    // Use the same name 'session' that we're checking in middleware
    const cookieStore = cookies();
    (await cookieStore).set({
      name: 'session',
      value: JSON.stringify(data),
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'strict',
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 