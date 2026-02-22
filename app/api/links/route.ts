import { NextRequest, NextResponse } from "next/server"
import {
  getAllLinks,
  addLink,
  searchLinks,
  filterByPlatform,
  getStats,
  getPlatformCounts,
  type Platform,
} from "@/lib/data"
import { getAuthenticatedUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = auth.user.id
  const { searchParams } = request.nextUrl
  const search = searchParams.get("search")
  const platform = searchParams.get("platform") as Platform | null
  const includeStats = searchParams.get("stats") === "true"

  let links
  if (search) {
    links = await searchLinks(search, userId)
  } else if (platform) {
    links = await filterByPlatform(platform, userId)
  } else {
    links = await getAllLinks(userId)
  }

  const response: Record<string, unknown> = { links }

  if (includeStats) {
    response.stats = await getStats(userId)
    response.platformCounts = await getPlatformCounts(userId)
  }

  return NextResponse.json(response)
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, url, description } = body

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Link name is required" },
        { status: 400 }
      )
    }

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      )
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      )
    }

    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      )
    }

    const link = await addLink(name.trim(), url.trim(), description.trim(), auth.user.id)
    return NextResponse.json({ link }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
