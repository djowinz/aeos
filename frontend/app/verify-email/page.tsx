"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Shield, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationState("error")
        setError("Invalid verification link. Please request a new verification email.")
        return
      }

      try {
        // Simulate API call to verify email
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // In a real app, you would call your API to verify the token
        console.log("Verifying email with token:", token)

        // For demo purposes, we'll simulate a successful verification
        // In a real app, you would check the response from your API
        setVerificationState("success")
      } catch (error) {
        console.error("Error verifying email:", error)
        setVerificationState("error")
        setError("An error occurred while verifying your email. Please try again.")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="flex min-h-screen flex-col bg-zinc-900 text-white">
      {/* Header */}
      <header className="w-full border-b border-zinc-800 bg-zinc-900 py-4">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-bold">Orqa Ops</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-md">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-8 shadow-lg">
              <div className="text-center py-4">
                {verificationState === "loading" && (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Verifying your email</h2>
                    <p className="text-zinc-400 mb-6">Please wait while we verify your email address...</p>
                  </>
                )}

                {verificationState === "success" && (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Email verified!</h2>
                    <p className="text-zinc-400 mb-6">
                      Your email has been successfully verified. Your account is now active.
                    </p>
                    <div className="flex flex-col gap-4">
                      <Button
                        onClick={() => router.push("/login")}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      >
                        Sign in to your account
                      </Button>
                    </div>
                  </>
                )}

                {verificationState === "error" && (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
                      <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Verification failed</h2>
                    <p className="text-zinc-400 mb-6">
                      {error || "An error occurred during verification. Please try again."}
                    </p>
                    <div className="flex flex-col gap-4">
                      <Button
                        onClick={() => router.push("/signup")}
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/70 hover:border-blue-500/50"
                      >
                        Back to sign up
                      </Button>
                      <Button
                        onClick={() => {
                          // In a real app, this would trigger a resend verification email API call
                          console.log("Request new verification email")
                          router.push("/signup")
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      >
                        Request new verification email
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 bg-zinc-900">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shield className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-bold">Orqa Ops</span>
            </div>
            <p className="text-zinc-400 text-xs">&copy; {new Date().getFullYear()} Orqa Ops. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
