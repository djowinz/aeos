"use client"

import Image from "next/image"

interface SocialLoginButtonProps {
  provider: "google" | "github" | "microsoft"
  href?: string
}

export function SocialLoginButton({ provider, href }: SocialLoginButtonProps) {
  const providerConfig = {
    google: {
      name: "Google",
      logo: "/social/google-logo.svg",
      bgColor: "bg-white hover:bg-gray-100",
      textColor: "text-gray-800",
      borderColor: "border-gray-300",
    },
    microsoft: {
      name: "Microsoft",
      logo: "/social/microsoft-logo.svg",
      bgColor: "bg-white hover:bg-gray-100",
      textColor: "text-gray-800",
      borderColor: "border-gray-300",
    },
    github: {
      name: "GitHub",
      logo: "/social/github-logo.svg",
      bgColor: "bg-[#24292e] hover:bg-[#2f363d]",
      textColor: "text-white",
      borderColor: "border-[#24292e]",
    }
  }

  const config = providerConfig[provider]

  // When no href provided, render a disabled div with the same styling
  if (!href) {
    return (
      <div
        className={`aspect-square w-full flex items-center justify-center h-10 p-0 ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-lg`}
        aria-label={`Continue with ${config.name} (disabled)`}
        role="button"
        aria-disabled="true"
      >
        <div className="w-6 h-6 relative flex-shrink-0">
          <Image src={config.logo || "/placeholder.svg"} alt={`${config.name} logo`} width={24} height={24} />
        </div>
      </div>
    )
  }

  // Render an anchor tag when we have a href
  return (
    <a
      href={href}
      className={`aspect-square w-full flex items-center justify-center h-10 p-0 ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-lg transition-all duration-200`}
      title={`Continue with ${config.name}`}
      aria-label={`Continue with ${config.name}`}
    >
      <div className="w-6 h-6 relative flex-shrink-0">
        <Image src={config.logo || "/placeholder.svg"} alt={`${config.name} logo`} width={24} height={24} />
      </div>
    </a>
  )
}
