'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Auth0Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    // The code and state params from Auth0
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    console.log('Auth0 redirect received in callback page:', { 
      code: code?.substring(0, 10) + '...',
      state,
      allParams: Object.fromEntries([...searchParams.entries()])
    });
    
    if (!code || !state) {
      setStatus('Error: Missing authentication parameters');
      return;
    }

    // Client-side redirect to the API endpoint
    // The middleware will handle this redirect and process the authentication
    router.push(`/api/auth/callback?code=${code}&state=${state}`);
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Authentication</h1>
        <p className="text-center">{status}</p>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      </div>
    </div>
  );
} 