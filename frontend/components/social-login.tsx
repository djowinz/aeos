"use client"

import { useState, useEffect } from "react"
import { SocialLoginButton } from "./social-login-button"

export function SocialLogin() {
  const [isClient, setIsClient] = useState(false);
  const [authUrls, setAuthUrls] = useState<Record<string, string | null>>({
    google: null,
    github: null,
    microsoft: null
  });

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use useEffect to ensure URL generation only happens on the client
  useEffect(() => {
    if (!isClient) return;
    
    // Function to generate the social login URL
    const generateSocialLoginUrl = (provider: "google" | "github" | "microsoft"): string => {
      // Generate a random state parameter for CSRF protection
      const state = Math.random().toString(36).substring(2);
      
      // Store state in localStorage
      window.localStorage.setItem('auth_state', state);
      
      // Configure Auth0 connection based on provider
      const getConnection = () => {
        switch (provider) {
          case 'microsoft':
            return 'windowslive';
          case 'google':
            return 'google-oauth2';
          default:
            return provider;
        }
      };
      
      // Auth0 authorization URL parameters
      const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
      const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
      const redirectUri = `${window.location.origin}/auth/callback`;
      const scope = 'openid profile email';
      
      // Build the authorization URL
      const authUrl = new URL(`https://${auth0Domain}/authorize`);
      authUrl.searchParams.append('client_id', clientId || '');
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('scope', scope);
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('connection', getConnection());
      
      return authUrl.toString();
    };

    // Generate URLs for all providers
    setAuthUrls({
      google: generateSocialLoginUrl("google"),
      github: generateSocialLoginUrl("github"),
      microsoft: generateSocialLoginUrl("microsoft")
    });
  }, [isClient]);

  // Render placeholder divs during server-side rendering or initial client render
  if (!isClient) {
    return (
      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="aspect-square w-full h-10 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="aspect-square w-full h-10 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="aspect-square w-full h-10 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      <SocialLoginButton
        provider="google"
        href={authUrls.google || undefined}
      />
      <SocialLoginButton
        provider="github"
        href={authUrls.github || undefined}
      />
      <SocialLoginButton
        provider="microsoft"
        href={authUrls.microsoft || undefined}
      />
    </div>
  )
}
