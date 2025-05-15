"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, ArrowLeft, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SocialLogin } from "@/components/social-login"
import ReCAPTCHA from "react-google-recaptcha"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [needsVerification, setNeedsVerification] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

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
        // If error, stay on login page (user is likely not authenticated)
        console.error('Auth check failed:', error);
      }
    };
    
    checkSession();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear any previous error when user starts typing again
    if (loginError) setLoginError("")
    if (needsVerification) setNeedsVerification(false)
  }

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaVerified(!!token)
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      rememberMe: checked,
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!captchaVerified) {
      setLoginError("Please verify that you're not a robot")
      return
    }

    setIsLoading(true)
    setLoginError("")
    setNeedsVerification(false)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formState.email, 
          password: formState.password,
          rememberMe: formState.rememberMe 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Get the redirect URL from query parameters or default to dashboard
        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get('redirect') || '/dashboard';
        window.location.href = decodeURIComponent(redirectPath);
      } else {
        setLoginError(data.error || "An error occurred during login");
        
        // Check if the error is due to unverified email
        if (data.error?.includes('verification')) {
          setNeedsVerification(true);
        }
      }
    } catch (error) {
      setLoginError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
      
      // Reset reCAPTCHA on failed login attempt
      recaptchaRef.current?.reset()
      setCaptchaVerified(false)
    }
  }

  const handleResendVerification = async () => {
    setIsLoading(true)

    try {
      // Simulate API call to resend verification email
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would call your API to resend the verification email
      console.log("Resending verification email to:", formState.email)

      // Show success message
      setLoginError("")
      setNeedsVerification(false)
      alert(`Verification email sent to ${formState.email}. Please check your inbox.`)
    } catch (error) {
      setLoginError("Failed to resend verification email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLoginSuccess = (provider: string, userData: any) => {
    console.log(`${provider} login successful:`, userData)
    // In a real app, you would handle the successful login here
    // For example, store the user data in state or context
    // and redirect to the dashboard
    window.location.href = "/dashboard"
  }

  const handleSocialLoginError = (error: Error) => {
    console.error("Social login error:", error)
    setLoginError(`Social login failed: ${error.message}`)
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
                <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                <p className="text-zinc-400">Sign in to your Orqa Ops account</p>
              </div>

              {loginError && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {loginError}
                </div>
              )}

              {needsVerification && (
                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email not verified</p>
                      <p className="mt-1">Please verify your email address before signing in.</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="self-end border-amber-500/30 hover:border-amber-500/50 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>Resend verification email</>
                    )}
                  </Button>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password" className="text-xs text-blue-400 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formState.rememberMe}
                    onCheckedChange={handleCheckboxChange}
                    className="border-zinc-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-zinc-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>

                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is Google's test key
                    onChange={handleCaptchaChange}
                    theme="dark"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !formState.email || !formState.password || !captchaVerified}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full py-6 h-auto text-base transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>Sign in</>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-400">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-blue-400 hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-zinc-500">
                Protected by reCAPTCHA and subject to the{" "}
                <Link href="#" className="text-zinc-400 hover:text-blue-400">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-zinc-400 hover:text-blue-400">
                  Terms of Service
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

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
