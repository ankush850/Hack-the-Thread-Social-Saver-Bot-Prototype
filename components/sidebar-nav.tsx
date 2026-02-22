"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { EmailShareDialog } from "@/components/email-share-dialog"
import { WhatsAppShareDialog } from "@/components/whatsapp-share-dialog"
import type { Platform } from "@/lib/data"
import { platformMeta, allPlatforms } from "@/lib/platforms"
import {
  Bookmark,
  Instagram,
  Twitter,
  Dribbble,
  Youtube,
  FileText,
  Globe,
  LayoutGrid,
} from "lucide-react"

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  dribbble: Dribbble,
  youtube: Youtube,
  blog: FileText,
  other: Globe,
}

interface SidebarNavProps {
  activePlatform: Platform | "all"
  onPlatformChange: (platform: Platform | "all") => void
  platformCounts: Record<string, number>
  totalCount: number
}

export function SidebarNav({
  activePlatform,
  onPlatformChange,
  platformCounts,
  totalCount,
}: SidebarNavProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Bookmark className="size-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sidebar-foreground">
              Social Saver
            </h2>
            <p className="text-xs text-muted-foreground">Link Manager</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platforms</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activePlatform === "all"}
                  onClick={() => onPlatformChange("all")}
                >
                  <LayoutGrid className="size-4" />
                  <span>All Links</span>
                  <SidebarMenuBadge>{totalCount}</SidebarMenuBadge>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {allPlatforms.map((platform) => {
                const Icon = platformIcons[platform]
                const meta = platformMeta[platform]
                const count = platformCounts[platform] || 0

                if (count === 0) return null

                return (
                  <SidebarMenuItem key={platform}>
                    <SidebarMenuButton
                      isActive={activePlatform === platform}
                      onClick={() => onPlatformChange(platform)}
                    >
                      <Icon className="size-4" />
                      <span>{meta.label}</span>
                      <SidebarMenuBadge>{count}</SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-2 p-4">
        <WhatsAppShareDialog />
        <EmailShareDialog />
      </SidebarFooter>
    </Sidebar>
  )
}
