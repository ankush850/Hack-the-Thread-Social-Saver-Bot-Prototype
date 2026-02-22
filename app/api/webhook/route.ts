import { NextRequest, NextResponse } from "next/server"
import { addLink } from "@/lib/data"
import { findOrCreateUser } from "@/lib/auth"

// GET: Webhook verification (Meta WhatsApp Cloud API)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "social-saver-bot"

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

// POST: Receive incoming WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle Meta WhatsApp Cloud API format
    if (body.object === "whatsapp_business_account") {
      const entries = body.entry ?? []
      for (const entry of entries) {
        const changes = entry.changes ?? []
        for (const change of changes) {
          const messages = change.value?.messages ?? []
          for (const message of messages) {
            if (message.type === "text") {
              const text: string = message.text?.body ?? ""
              const result = parseMessage(text)
              if (result) {
                const senderId = message.from ?? "anonymous"
                const user = await findOrCreateUser(senderId, "phone")
                await addLink(result.name, result.url, result.description, user.id)
              }
            }
          }
        }
      }
      return NextResponse.json({ status: "ok" })
    }

    // Handle Twilio format
    if (body.Body) {
      const text: string = body.Body
      const result = parseMessage(text)
      if (result) {
        const senderId = body.From ?? "anonymous"
        const user = await findOrCreateUser(senderId, "phone")
        await addLink(result.name, result.url, result.description, user.id)
      }

      // Return TwiML response
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Link saved successfully!</Message>
</Response>`
      return new NextResponse(twiml, {
        headers: { "Content-Type": "application/xml" },
      })
    }

    // Generic format: { name, url, description }
    if (body.url) {
      const user = await findOrCreateUser("webhook@system", "email")
      const link = await addLink(body.name || "Untitled Link", body.url, body.description || "", user.id)
      return NextResponse.json({ status: "ok", link })
    }

    return NextResponse.json(
      { error: "Unrecognized message format" },
      { status: 400 }
    )
  } catch {
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    )
  }
}

/**
 * Parse WhatsApp messages in multiple formats:
 * Format 1 (structured): "Name: My Link\nURL: https://...\nDesc: Some description"
 * Format 2 (simple): "My Link https://example.com Some description"
 * Format 3 (URL only): "https://example.com"
 */
function parseMessage(text: string): {
  name: string
  url: string
  description: string
} | null {
  // Extract URL from message
  const urlRegex = /(https?:\/\/[^\s]+)/gi
  const urls = text.match(urlRegex)

  if (!urls || urls.length === 0) return null

  const url = urls[0]

  // Try structured format: Name: ...\nURL: ...\nDesc: ...
  const nameMatch = text.match(/(?:name|title)\s*[:=]\s*(.+)/i)
  const descMatch = text.match(/(?:desc|description|about)\s*[:=]\s*(.+)/i)

  if (nameMatch) {
    return {
      name: nameMatch[1].trim(),
      url,
      description: descMatch?.[1]?.trim() || "Saved from WhatsApp",
    }
  }

  // Simple format: everything before URL is name, everything after is description
  const beforeUrl = text.substring(0, text.indexOf(url)).trim().replace(/[-:]\s*$/, "").trim()
  const afterUrl = text.substring(text.indexOf(url) + url.length).trim().replace(/^[-:]\s*/, "").trim()

  return {
    name: beforeUrl || "Untitled Link",
    url,
    description: afterUrl || beforeUrl || "Saved from WhatsApp",
  }
}
