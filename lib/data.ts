import { prisma } from "@/lib/db"

export interface SavedLink {
  id: string
  name: string
  url: string
  description: string
  platform: Platform
  createdAt: string
  userId: string
}

export type Platform =
  | "instagram"
  | "twitter"
  | "dribbble"
  | "youtube"
  | "blog"
  | "other"

export function detectPlatform(url: string): Platform {
  const lower = url.toLowerCase()
  if (lower.includes("instagram.com") || lower.includes("instagr.am"))
    return "instagram"
  if (
    lower.includes("twitter.com") ||
    lower.includes("x.com") ||
    lower.includes("t.co")
  )
    return "twitter"
  if (lower.includes("dribbble.com")) return "dribbble"
  if (
    lower.includes("youtube.com") ||
    lower.includes("youtu.be") ||
    lower.includes("yt.be")
  )
    return "youtube"
  if (
    lower.includes("medium.com") ||
    lower.includes("dev.to") ||
    lower.includes("hashnode") ||
    lower.includes("substack.com") ||
    lower.includes("blog")
  )
    return "blog"
  return "other"
}

function toSavedLink(row: {
  id: string
  name: string
  url: string
  description: string
  platform: string
  createdAt: Date
  userId: string
}): SavedLink {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    description: row.description,
    platform: row.platform as Platform,
    createdAt: row.createdAt.toISOString(),
    userId: row.userId,
  }
}

// ── All user-scoped query functions ──────────────────────────────────────

export async function getAllLinks(userId: string): Promise<SavedLink[]> {
  const rows = await prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
  return rows.map(toSavedLink)
}

export async function addLink(
  name: string,
  url: string,
  description: string,
  userId: string
): Promise<SavedLink> {
  const platform = detectPlatform(url)
  const link = await prisma.link.create({
    data: { name, url, description, platform, userId },
  })
  return toSavedLink(link)
}

export async function updateLink(
  id: string,
  userId: string,
  updates: Partial<Pick<SavedLink, "name" | "url" | "description">>
): Promise<SavedLink | null> {
  const existing = await prisma.link.findFirst({
    where: { id, userId },
  })
  if (!existing) return null

  const data: { name?: string; url?: string; description?: string; platform?: string } = {}
  if (updates.name !== undefined) data.name = updates.name
  if (updates.description !== undefined) data.description = updates.description
  if (updates.url !== undefined) {
    data.url = updates.url
    data.platform = detectPlatform(updates.url)
  }

  const link = await prisma.link.update({
    where: { id },
    data,
  })
  return toSavedLink(link)
}

export async function deleteLink(id: string, userId: string): Promise<boolean> {
  const result = await prisma.link.deleteMany({
    where: { id, userId },
  })
  return result.count > 0
}

export async function searchLinks(query: string, userId: string): Promise<SavedLink[]> {
  const lower = query.toLowerCase()
  const all = await getAllLinks(userId)
  return all.filter(
    (l) =>
      l.name.toLowerCase().includes(lower) ||
      l.description.toLowerCase().includes(lower) ||
      l.url.toLowerCase().includes(lower)
  )
}

export async function filterByPlatform(
  platform: Platform,
  userId: string
): Promise<SavedLink[]> {
  const rows = await prisma.link.findMany({
    where: { userId, platform },
    orderBy: { createdAt: "desc" },
  })
  return rows.map(toSavedLink)
}

export async function getStats(userId: string): Promise<{
  total: number
  platforms: number
  thisWeek: number
  lastAdded: string | null
}> {
  const all = await getAllLinks(userId)
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const thisWeek = all.filter((l) => new Date(l.createdAt) >= oneWeekAgo)
  const platforms = new Set(all.map((l) => l.platform))

  return {
    total: all.length,
    platforms: platforms.size,
    thisWeek: thisWeek.length,
    lastAdded: all[0]?.createdAt ?? null,
  }
}

export async function getPlatformCounts(userId: string): Promise<Record<string, number>> {
  const all = await getAllLinks(userId)
  const counts: Record<string, number> = {}
  for (const link of all) {
    counts[link.platform] = (counts[link.platform] || 0) + 1
  }
  return counts
}
