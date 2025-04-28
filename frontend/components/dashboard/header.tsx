"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 shadow-md md:px-6">
      <div className="flex flex-1 items-center justify-end gap-4 md:justify-between">
        <div className="relative hidden md:block md:max-w-sm md:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-zinc-800 border-zinc-700 pl-9 text-white placeholder:text-zinc-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="relative border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          <div className="hidden md:flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-xs font-medium text-white">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
