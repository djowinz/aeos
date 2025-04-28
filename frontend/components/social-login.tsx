"use client"

import { useState } from "react"
import { SocialLoginButton } from "./social-login-button"

interface SocialLoginProps {
  onSuccess?: (provider: string, userData: any) => void
  onError?: (error: Error) => void
}

export function SocialLogin({ onSuccess, onError }: SocialLoginProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleSocialLogin = async (provider: "google" | "github" | "microsoft" | "apple") => {
    setLoadingProvider(provider)

    try {
      // In a real implementation, this would call your authentication service
      // For example, with NextAuth.js: signIn(provider)
      console.log(`Initiating ${provider} login flow`)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock user data that would come from the provider
      const mockUserData = {
        id: `user-${Math.random().toString(36).substring(2, 15)}`,
        name: "Demo User",
        email: `demo-${Math.random().toString(36).substring(2, 8)}@example.com`,
        image: `https://ui-avatars.com/api/?name=Demo+User&background=random`,
      }

      // Call the success callback
      onSuccess?.(provider, mockUserData)

      // In a real app, the redirect would be handled by the auth provider
      console.log(`${provider} login successful, redirecting to dashboard...`)
    } catch (error) {
      console.error(`${provider} login failed:`, error)
      onError?.(error instanceof Error ? error : new Error(`${provider} login failed`))
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className="space-y-3">
      <SocialLoginButton
        provider="google"
        isLoading={loadingProvider === "google"}
        onClick={() => handleSocialLogin("google")}
      />
      <SocialLoginButton
        provider="github"
        isLoading={loadingProvider === "github"}
        onClick={() => handleSocialLogin("github")}
      />
      <div className="grid grid-cols-2 gap-3">
        <SocialLoginButton
          provider="microsoft"
          isLoading={loadingProvider === "microsoft"}
          onClick={() => handleSocialLogin("microsoft")}
        />
        <SocialLoginButton
          provider="apple"
          isLoading={loadingProvider === "apple"}
          onClick={() => handleSocialLogin("apple")}
        />
      </div>
    </div>
  )
}
