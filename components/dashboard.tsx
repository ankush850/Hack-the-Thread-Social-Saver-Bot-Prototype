"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"
import { StatsBar } from "@/components/stats-bar"
import { SearchBar } from "@/components/search-bar"
import { LinkGrid } from "@/components/link-grid"
import { AddLinkDialog } from "@/components/add-link-dialog"
import { SendWhatsAppDialog } from "@/components/send-whatsapp-dialog"
import { Separator } from "@/components/ui/separator"
import type { Platform, SavedLink } from "@/lib/data"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"

interface ApiResponse {
  links: SavedLink[]
  stats?: {
    total: number
    platforms: number
    thisWeek: number
    lastAdded: string | null
  }
  platformCounts?: Record<string, number>
}

export function Dashboard() {
  const { logout } = useAuth()
  const [activePlatform, setActivePlatform] = useState<Platform | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const fetcher = useCallback(
    async (url: string) => {
      const res = await fetch(url, { credentials: "include" })
      if (res.status === 401) {
        await logout()
        throw new Error("Unauthorized")
      }
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
    [logout]
  )

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams({ stats: "true" })
    if (searchQuery) {
      params.set("search", searchQuery)
    } else if (activePlatform !== "all") {
      params.set("platform", activePlatform)
    }
    return `/api/links?${params.toString()}`
  }, [activePlatform, searchQuery])

  const { data, mutate } = useSWR<ApiResponse>(buildUrl(), fetcher, {
    refreshInterval: 5000,
  })

  const links = data?.links ?? []
  const stats = data?.stats ?? { total: 0, platforms: 0, thisWeek: 0, lastAdded: null }
  const platformCounts = data?.platformCounts ?? {}

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (res.status === 401) {
        await logout()
        return
      }
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Link deleted")
      mutate()
    } catch {
      toast.error("Failed to delete link")
    }
  }

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handlePlatformChange = useCallback((platform: Platform | "all") => {
    setActivePlatform(platform)
    setSearchQuery("")
  }, [])

  return (
    <SidebarProvider>
      <SidebarNav
        activePlatform={activePlatform}
        onPlatformChange={handlePlatformChange}
        platformCounts={platformCounts}
        totalCount={stats.total}
      />
      <SidebarInset>
        <header className="flex items-center gap-3 border-b border-border p-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <div className="flex flex-1 items-center justify-between gap-4">
            <SearchBar onSearch={handleSearch} />
            <div className="flex items-center gap-2">
              <SendWhatsAppDialog />
              <AddLinkDialog onAdded={() => mutate()} />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-6 p-6">
          <StatsBar
            total={stats.total}
            platforms={stats.platforms}
            thisWeek={stats.thisWeek}
            lastAdded={stats.lastAdded}
          />
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : activePlatform === "all"
                  ? "All Saved Links"
                  : `${activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)} Links`}
            </h2>
            <LinkGrid links={links} onDelete={handleDelete} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
