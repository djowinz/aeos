"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Shield, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to request password reset
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would call your API to send a reset email
      console.log("Password reset requested for:", email)

      setIsSubmitted(true)
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
            <div className="mb-6">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-zinc-400 hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-8 shadow-lg">
              {!isSubmitted ? (
                <>
                  <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
                    <p className="text-zinc-400">
                      Enter your email address and we'll send you a link to reset your password
                    </p>
                  </div>

                  {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white placeholder:text-zinc-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full py-6 h-auto text-base transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending reset link...
                        </>
                      ) : (
                        <>Send reset link</>
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                  <p className="text-zinc-400 mb-6">
                    We've sent a password reset link to <span className="text-white font-medium">{email}</span>
                  </p>
                  <p className="text-zinc-400 text-sm mb-6">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button onClick={() => setIsSubmitted(false)} className="text-blue-400 hover:underline">
                      try again
                    </button>
                  </p>

                  {/* This link would normally be sent via email - for demo purposes only */}
                  <div className="mt-8 pt-6 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-4">
                      Demo: Click the link below to simulate receiving the email
                    </p>
                    <Link
                      href="/reset-password?token=demo-token-12345"
                      className="text-blue-400 hover:underline text-sm"
                    >
                      Reset password link
                    </Link>
                  </div>
                </div>
              )}
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
