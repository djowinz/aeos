import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-zinc-900">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 pt-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
