"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Link2, Layers, CalendarDays, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface StatsBarProps {
  total: number
  platforms: number
  thisWeek: number
  lastAdded: string | null
}

export function StatsBar({ total, platforms, thisWeek, lastAdded }: StatsBarProps) {
  const stats = [
    {
      label: "Total Links",
      value: total,
      icon: Link2,
    },
    {
      label: "Platforms",
      value: platforms,
      icon: Layers,
    },
    {
      label: "This Week",
      value: thisWeek,
      icon: CalendarDays,
    },
    {
      label: "Last Added",
      value: lastAdded
        ? formatDistanceToNow(new Date(lastAdded), { addSuffix: true })
        : "Never",
      icon: Clock,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/60">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="truncate text-lg font-semibold text-foreground">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
