import { NextRequest, NextResponse } from "next/server"
import { generateOtp } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, type } = body

    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
      return NextResponse.json(
        { error: "Email or phone number is required" },
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

    // Validate format
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(cleaned)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        )
      }
    } else {
      // Phone: strip non-digits and check length
      const digits = cleaned.replace(/\D/g, "")
      if (digits.length < 7 || digits.length > 15) {
        return NextResponse.json(
          { error: "Invalid phone number" },
          { status: 400 }
        )
      }
    }

    const otp = await generateOtp(cleaned)

    // In production, send via email/SMS service (SendGrid, Twilio, etc.)
    // For MVP, we log the OTP so the user can see it in the response
    console.log(`[OTP] Code for ${cleaned}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${type === "email" ? cleaned : "your phone number"}`,
      // Include OTP in response for MVP/demo purposes only
      _dev_otp: otp,
    })
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[request-otp] Error:", err)
      const msg = err instanceof Error ? err.message : String(err)
      const hint =
        msg.includes("no such table") || msg.includes("does not exist")
          ? " Run: npm run db:migrate"
          : ""
      return NextResponse.json(
        { error: "Failed to process request", _dev: msg + hint },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
