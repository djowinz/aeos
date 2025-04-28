import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border border-zinc-800 bg-zinc-900/50 p-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
        <div className="rounded-md bg-blue-500/10 p-2 text-blue-500">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-white">{value}</p>
        {description && <p className="text-sm text-zinc-400">{description}</p>}
      </div>
      {trend && (
        <div className="mt-2 flex items-center text-xs">
          <span className={cn("font-medium", trend.isPositive ? "text-green-500" : "text-red-500")}>
            {trend.isPositive ? "+" : "-"}
            {Math.abs(trend.value)}%
          </span>
          <span className="ml-1 text-zinc-500">vs last week</span>
        </div>
      )}
    </div>
  )
}
