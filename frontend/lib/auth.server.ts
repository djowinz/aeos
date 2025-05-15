import { cookies } from 'next/headers';

// Get session token from cookies (server-side)
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  return sessionCookie?.value;
}

// Check if user is authenticated (server-side)
export async function isAuthenticated(): Promise<boolean> {
  return Boolean(await getSessionToken());
}

// Validate session with backend (server-side)
export async function validateSession() {
  const token = await getSessionToken();
  
  if (!token) {
    return null;
  }
  
  try {
    // Call your backend API to validate the session token
    const response = await fetch(`${process.env.API_URL}/api/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
} 