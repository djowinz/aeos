"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, ArrowLeft, Loader2, Check, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import zxcvbn from "zxcvbn"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formState, setFormState] = useState({
    password: "",
    confirmPassword: "",
  })
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    feedback: "",
    color: "red",
  })
  const [passwordsMatch, setPasswordsMatch] = useState(true)

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

  // Validate token exists
  if (!token) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-900 text-white">
        <header className="w-full border-b border-zinc-800 bg-zinc-900 py-4">
          <div className="container flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold">Orqa Ops</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Invalid or expired link</h1>
            <p className="text-zinc-400 mb-6">
              The password reset link is invalid or has expired. Please request a new one.
            </p>
            <Button
              onClick={() => router.push("/forgot-password")}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2"
            >
              Request new link
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Update form state with new value
    setFormState((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      }

      // Check if passwords match whenever either password field changes
      if (name === "password" || name === "confirmPassword") {
        const otherField = name === "password" ? "confirmPassword" : "password"
        const otherValue = name === "password" ? prev.confirmPassword : prev.password

        // Only validate match if both fields have values
        if (value && otherValue) {
          setPasswordsMatch(value === otherValue)
        } else {
          setPasswordsMatch(true) // Don't show error when fields are empty
        }
      }

      return newState
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password strength
    if (passwordStrength.score < 2) {
      setError("Please choose a stronger password")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would call your API to reset the password
      console.log("Password reset for token:", token)
      console.log("New password set (not shown for security)")

      setIsSuccess(true)
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
              {!isSuccess ? (
                <>
                  <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold mb-2">Create new password</h1>
                    <p className="text-zinc-400">Your new password must be different from previously used passwords</p>
                  </div>

                  {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your new password"
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

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          required
                          value={formState.confirmPassword}
                          onChange={handleChange}
                          className={`bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white placeholder:text-zinc-500 pr-10 ${
                            formState.confirmPassword && !passwordsMatch ? "border-red-500" : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 hover:text-zinc-300 focus:outline-none"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {formState.confirmPassword && !passwordsMatch && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1.5">
                          <AlertCircle className="h-3 w-3" />
                          <span>Passwords do not match</span>
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        isLoading ||
                        !formState.password ||
                        !formState.confirmPassword ||
                        !passwordsMatch ||
                        formState.password !== formState.confirmPassword ||
                        passwordStrength.score < 2
                      }
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full py-6 h-auto text-base transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting password...
                        </>
                      ) : (
                        <>Reset password</>
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Password reset successful</h2>
                  <p className="text-zinc-400 mb-6">
                    Your password has been reset successfully. You can now log in with your new password.
                  </p>
                  <Button
                    onClick={() => router.push("/login")}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-6 py-2"
                  >
                    Sign in
                  </Button>
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
