import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ActivityItemProps {
  icon: ReactNode
  title: string
  description: string
  timestamp: string
  status?: "success" | "warning" | "error" | "info"
  className?: string
}

export function ActivityItem({ icon, title, description, timestamp, status = "info", className }: ActivityItemProps) {
  const statusColors = {
    success: "bg-green-500/10 text-green-500",
    warning: "bg-amber-500/10 text-amber-500",
    error: "bg-red-500/10 text-red-500",
    info: "bg-blue-500/10 text-blue-500",
  }

  return (
    <div className={cn("flex items-start gap-4", className)}>
      <div className={cn("rounded-full p-2 mt-0.5", statusColors[status])}>{icon}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-white">{title}</p>
          <p className="text-xs text-zinc-500">{timestamp}</p>
        </div>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  )
}
