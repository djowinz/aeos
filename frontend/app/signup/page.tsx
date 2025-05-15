"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Shield, ArrowLeft, Check, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SocialLogin } from "@/components/social-login"
import zxcvbn from "zxcvbn"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    agreeTerms: false,
  })
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    feedback: "",
    color: "red",
  })
  const [signupError, setSignupError] = useState("")

  // Update password strength when password changes
  useEffect(() => {
    if (formState.password) {
      const result = zxcvbn(formState.password)

      // Map zxcvbn score (0-4) to our color scheme
      let color = "red"
      let message = ""

      switch (result.score) {
        case 0:
          color = "red"
          message = "Very weak"
          break
        case 1:
          color = "red"
          message = "Weak"
          break
        case 2:
          color = "orange"
          message = "Fair"
          break
        case 3:
          color = "yellow"
          message = "Good"
          break
        case 4:
          color = "green"
          message = "Strong"
          break
        default:
          color = "red"
          message = "Very weak"
      }

      // Get feedback from zxcvbn
      const feedback =
        result.feedback.warning || (result.feedback.suggestions.length > 0 ? result.feedback.suggestions[0] : "")

      setPasswordStrength({
        score: result.score,
        message,
        feedback,
        color,
      })
    } else {
      setPasswordStrength({
        score: 0,
        message: "",
        feedback: "",
        color: "red",
      })
    }
  }, [formState.password])

  // Check for existing session on component mount
  useEffect(() => {
    // This is a backup check in case middleware redirect fails
    const checkSession = async () => {
      try {
        const response = await fetch('/api/check-auth', { 
          method: 'GET',
          credentials: 'include' // Include cookies in the request
        });
        
        if (response.ok) {
          // If authenticated, redirect to dashboard
          router.replace('/dashboard');
        }
      } catch (error) {
        // If error, stay on signup page (user is likely not authenticated)
        console.error('Auth check failed:', error);
      }
    };
    
    checkSession();
  }, [router]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSignupError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would handle the form submission here
      console.log("Form submitted:", formState)

      // Set submitted state to show verification message
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error during signup:", error)
      setSignupError("An error occurred during signup. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (signupError) {
      setSignupError("")
    }
  }

  const handleSocialLoginSuccess = (provider: string, userData: any) => {
    console.log(`${provider} signup successful:`, userData)
    // In a real app, you would handle the successful signup here
    // For example, store the user data in state or context
    // and show the verification screen or redirect to onboarding
    setIsSubmitted(true)
  }

  const handleSocialLoginError = (error: Error) => {
    console.error("Social signup error:", error)
    setSignupError(`Social signup failed: ${error.message}`)
  }

  // Helper function to get color based on strength
  function getColorForStrength(color: string): string {
    switch (color) {
      case "red":
        return "#ef4444"
      case "orange":
        return "#f97316"
      case "yellow":
        return "#eab308"
      case "green":
        return "#22c55e"
      default:
        return "#ef4444"
    }
  }

  // If the form has been submitted, show the verification message
  if (isSubmitted) {
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
                  <h2 className="text-2xl font-bold mb-2">Verify your email</h2>
                  <p className="text-zinc-400 mb-6">
                    We've sent a verification link to <span className="text-white font-medium">{formState.email}</span>
                  </p>
                  <p className="text-zinc-400 text-sm mb-8">
                    Please check your inbox and click the verification link to activate your account. If you don't see
                    the email, check your spam folder.
                  </p>

                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/70 hover:border-blue-500/50"
                    >
                      Use a different email
                    </Button>

                    <Button
                      onClick={() => {
                        // In a real app, this would trigger a resend verification email API call
                        console.log("Resend verification email to:", formState.email)
                      }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      Resend verification email
                    </Button>
                  </div>

                  {/* This link would normally be sent via email - for demo purposes only */}
                  <div className="mt-8 pt-6 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-4">
                      Demo: Click the link below to simulate receiving the email
                    </p>
                    <Link
                      href="/verify-email?token=demo-verification-token-12345"
                      className="text-blue-400 hover:underline text-sm"
                    >
                      Verification link
                    </Link>
                  </div>
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
                href="/"
                className="inline-flex items-center text-sm text-zinc-400 hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Link>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-8 shadow-lg">
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold mb-2">Create your account</h1>
                <p className="text-zinc-400">Get started with Orqa Ops and start monitoring your applications</p>
              </div>

              {signupError && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {signupError}
                </div>
              )}

              {/* Social Login Section */}
              <div className="mb-6">
                <SocialLogin />
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white placeholder:text-zinc-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white placeholder:text-zinc-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Your company name"
                      value={formState.company}
                      onChange={handleChange}
                      className="bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white placeholder:text-zinc-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a secure password"
                        required
                        value={formState.password}
                        onChange={handleChange}
                        className="bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white placeholder:text-zinc-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 hover:text-zinc-300 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {formState.password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ color: getColorForStrength(passwordStrength.color) }}>
                            {passwordStrength.message}
                          </span>
                          <span className="text-xs text-zinc-500">{passwordStrength.score}/4</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${(passwordStrength.score / 4) * 100}%`,
                              backgroundColor: getColorForStrength(passwordStrength.color),
                            }}
                          ></div>
                        </div>
                        {passwordStrength.feedback && (
                          <div className="mt-2 text-xs text-zinc-400 flex items-start gap-1.5">
                            <div className="flex-shrink-0 mt-0.5">
                              <AlertCircle className="h-3 w-3" />
                            </div>
                            <span>{passwordStrength.feedback}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    name="agreeTerms"
                    checked={formState.agreeTerms}
                    onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, agreeTerms: checked === true }))}
                    className="border-zinc-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-zinc-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link href="#" className="text-blue-400 hover:underline">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-blue-400 hover:underline">
                      privacy policy
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !formState.agreeTerms || passwordStrength.score < 2}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full py-6 h-auto text-base transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>Create account</>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-400 hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-sm text-zinc-400">
                    <span className="font-medium text-white">Free 14-day trial</span> - No credit card required
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-sm text-zinc-400">
                    <span className="font-medium text-white">Cancel anytime</span> - Easy one-click cancellation
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-sm text-zinc-400">
                    <span className="font-medium text-white">24/7 support</span> - Our team is always ready to help
                  </p>
                </div>
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
