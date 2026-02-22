import type { Platform } from "./data"

export interface PlatformMeta {
  label: string
  color: string
  bgColor: string
  textColor: string
}

export const platformMeta: Record<Platform, PlatformMeta> = {
  instagram: {
    label: "Instagram",
    color: "#E1306C",
    bgColor: "bg-[#E1306C]/15",
    textColor: "text-[#E1306C]",
  },
  twitter: {
    label: "Twitter / X",
    color: "#1DA1F2",
    bgColor: "bg-[#1DA1F2]/15",
    textColor: "text-[#1DA1F2]",
  },
  dribbble: {
    label: "Dribbble",
    color: "#EA4C89",
    bgColor: "bg-[#EA4C89]/15",
    textColor: "text-[#EA4C89]",
  },
  youtube: {
    label: "YouTube",
    color: "#FF0000",
    bgColor: "bg-[#FF0000]/15",
    textColor: "text-[#FF0000]",
  },
  blog: {
    label: "Blog",
    color: "#10B981",
    bgColor: "bg-[#10B981]/15",
    textColor: "text-[#10B981]",
  },
  other: {
    label: "Other",
    color: "#6B7280",
    bgColor: "bg-[#6B7280]/15",
    textColor: "text-[#6B7280]",
  },
}

export const allPlatforms: Platform[] = [
  "instagram",
  "twitter",
  "dribbble",
  "youtube",
  "blog",
  "other",
]
