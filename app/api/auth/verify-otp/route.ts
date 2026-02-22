import { NextRequest, NextResponse } from "next/server"
import {
  verifyOtp,
  findOrCreateUser,
  createSession,
  getSessionCookieName,
} from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, type, code } = body

    if (!identifier || !code) {
      return NextResponse.json(
        { error: "Identifier and OTP code are required" },
        { status: 400 }
      )
    }

    if (type !== "email" && type !== "phone") {
      return NextResponse.json(
        { error: "Type must be 'email' or 'phone'" },
        { status: 400 }
      )
    }

    const cleaned = identifier.trim()
    const isValid = await verifyOtp(cleaned, code)

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 }
      )
    }

    // Find or create user
    const user = await findOrCreateUser(cleaned, type)

    // Create session
    const session = await createSession(user.id)

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        identifier: user.identifier,
        type: user.type,
      },
    })

    response.cookies.set(getSessionCookieName(), session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    })

    return response
  } catch {
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    )
  }
}
