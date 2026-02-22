import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"

export async function GET() {
  const auth = await getAuthenticatedUser()

  if (!auth) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: auth.user.id,
      identifier: auth.user.identifier,
      type: auth.user.type,
    },
  })
}
