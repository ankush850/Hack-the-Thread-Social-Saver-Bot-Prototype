"use client"

import { LinkCard } from "@/components/link-card"
import { Link2Off } from "lucide-react"
import type { SavedLink } from "@/lib/data"

interface LinkGridProps {
  links: SavedLink[]
  onDelete: (id: string) => void
}

export function LinkGrid({ links, onDelete }: LinkGridProps) {
  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Link2Off className="size-6 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">No links found</p>
          <p className="text-sm text-muted-foreground">
            Add your first link or try a different search
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} onDelete={onDelete} />
      ))}
    </div>
  )
}
