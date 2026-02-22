import { NextRequest, NextResponse } from "next/server"
import { deleteLink, updateLink } from "@/lib/data"
import { getAuthenticatedUser } from "@/lib/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { name, url, description } = body

    const updated = await updateLink(id, auth.user.id, {
      ...(name !== undefined && { name }),
      ...(url !== undefined && { url }),
      ...(description !== undefined && { description }),
    })

    if (!updated) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ link: updated })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const deleted = await deleteLink(id, auth.user.id)

  if (!deleted) {
    return NextResponse.json(
      { error: "Link not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true })
}
