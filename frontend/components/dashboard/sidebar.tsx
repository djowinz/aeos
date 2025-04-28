"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  Code,
  Cpu,
  GitPullRequest,
  Home,
  Layers,
  Menu,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Anomalies",
      href: "/dashboard/anomalies",
      icon: Bell,
    },
    {
      name: "Services",
      href: "/dashboard/services",
      icon: Layers,
    },
    {
      name: "Infrastructure",
      href: "/dashboard/infrastructure",
      icon: Cpu,
    },
    {
      name: "Pull Requests",
      href: "/dashboard/pull-requests",
      icon: GitPullRequest,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "Code Repository",
      href: "/dashboard/code",
      icon: Code,
    },
    {
      name: "Team",
      href: "/dashboard/team",
      icon: Users,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/80 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Mobile toggle button */}
      <button
        className="fixed left-4 top-4 z-50 rounded-md bg-zinc-800 p-2 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
        <span className="sr-only">Toggle menu</span>
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 transform border-r border-zinc-800 bg-zinc-900 transition-all duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-30",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "md:w-20" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-6">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-500" />
              {!isCollapsed && <span className="text-lg font-bold text-white">Orqa Ops</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={toggleCollapse}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === route.href
                        ? "bg-blue-500/10 text-blue-500"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                      isCollapsed && "justify-center px-2",
                    )}
                    title={isCollapsed ? route.name : undefined}
                  >
                    <route.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{route.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile */}
          <div className="border-t border-zinc-800 p-4">
            <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
              <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center">
                <span className="text-sm font-medium text-white">JD</span>
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-zinc-400">john@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
