import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // Clear the session cookie
  const cookieStore = cookies();
  (await cookieStore).delete('session');

  return NextResponse.json(
    { success: true },
    { status: 200 }
  );
} 