"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PlatformBadge } from "@/components/platform-badge"
import { ExternalLink, Copy, Trash2, Check } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { SavedLink } from "@/lib/data"
import { useState } from "react"

interface LinkCardProps {
  link: SavedLink
  onDelete: (id: string) => void
}

export function LinkCard({ link, onDelete }: LinkCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const truncatedUrl = (() => {
    try {
      const u = new URL(link.url)
      const path =
        u.pathname.length > 30
          ? u.pathname.slice(0, 30) + "..."
          : u.pathname
      return u.hostname + path
    } catch {
      return link.url.slice(0, 50)
    }
  })()

  return (
    <Card className="group border-border/60 transition-colors hover:border-primary/30">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <PlatformBadge platform={link.platform} />
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(link.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
          {link.name}
        </h3>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {link.description}
        </p>

        <p
          className="truncate text-xs text-muted-foreground"
          title={link.url}
        >
          {truncatedUrl}
        </p>

        <div className="flex items-center gap-1 pt-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="size-3.5 text-primary" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  <span className="sr-only">Copy URL</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? "Copied!" : "Copy URL"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  asChild
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-3.5" />
                    <span className="sr-only">Open link</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open in new tab</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(link.id)}
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Delete link</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
