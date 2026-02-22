import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionCookieName, deleteSession } from "@/lib/auth"

export async function POST() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(getSessionCookieName())?.value

  if (sessionId) {
    await deleteSession(sessionId)
  }

  const response = NextResponse.json({ success: true })
  response.cookies.delete(getSessionCookieName())
  return response
}
