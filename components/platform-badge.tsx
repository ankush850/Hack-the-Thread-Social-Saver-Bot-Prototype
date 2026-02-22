import { cn } from "@/lib/utils"
import type { Platform } from "@/lib/data"
import { platformMeta } from "@/lib/platforms"

interface PlatformBadgeProps {
  platform: Platform
  className?: string
}

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  const meta = platformMeta[platform] ?? platformMeta.other

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        meta.bgColor,
        meta.textColor,
        className
      )}
    >
      {meta.label}
    </span>
  )
}
