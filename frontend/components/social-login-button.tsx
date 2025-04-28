"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface SocialLoginButtonProps {
  provider: "google" | "github" | "microsoft" | "apple"
  isLoading?: boolean
  onClick: () => void
}

export function SocialLoginButton({ provider, isLoading = false, onClick }: SocialLoginButtonProps) {
  const providerConfig = {
    google: {
      name: "Google",
      logo: "/social/google-logo.svg",
      bgColor: "bg-white hover:bg-gray-100",
      textColor: "text-gray-800",
      borderColor: "border-gray-300",
    },
    github: {
      name: "GitHub",
      logo: "/social/github-logo.png",
      bgColor: "bg-[#24292e] hover:bg-[#2f363d]",
      textColor: "text-white",
      borderColor: "border-[#24292e]",
    },
    microsoft: {
      name: "Microsoft",
      logo: "/social/microsoft-logo.png",
      bgColor: "bg-white hover:bg-gray-100",
      textColor: "text-gray-800",
      borderColor: "border-gray-300",
    },
    apple: {
      name: "Apple",
      logo: "/social/apple-logo.png",
      bgColor: "bg-black hover:bg-gray-900",
      textColor: "text-white",
      borderColor: "border-black",
    },
  }

  const config = providerConfig[provider]

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 py-5 h-auto ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-lg transition-all duration-200`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <div className="w-5 h-5 relative flex-shrink-0">
          <Image src={config.logo || "/placeholder.svg"} alt={`${config.name} logo`} width={20} height={20} />
        </div>
      )}
      <span>Continue with {config.name}</span>
    </Button>
  )
}
