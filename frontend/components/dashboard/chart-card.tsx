import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  children: ReactNode
  className?: string
  action?: ReactNode
}

export function ChartCard({ title, children, className, action }: ChartCardProps) {
  return (
    <div className={cn("rounded-lg border border-zinc-800 bg-zinc-900/50 p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-white">{title}</h3>
        {action}
      </div>
      <div>{children}</div>
    </div>
  )
}
