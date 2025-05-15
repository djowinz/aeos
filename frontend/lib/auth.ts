'use client';

// Type definitions
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

// Client-side function to get session token (from document.cookie)
export function getClientSessionToken(): string | undefined {
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('session='));
  return sessionCookie ? sessionCookie.split('=')[1] : undefined;
}

// Client-side function to check if a user is logged in
export function isClientAuthenticated(): boolean {
  return Boolean(getClientSessionToken());
}

// Client-side function to validate token
export async function validateClientSession(): Promise<User | null> {
  const token = getClientSessionToken();
  
  if (!token) {
    return null;
  }
  
  try {
    // Call your backend API to validate the session token
    const response = await fetch(`/api/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
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

// Client-side function to logout user
export async function logout() {
  try {
    // Call your backend API to invalidate the session
    await fetch('/api/logout', {
      method: 'POST',
    });
    
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Error logging out:', error);
  }
} 