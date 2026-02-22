import { NextRequest, NextResponse } from "next/server"
import { getAllLinks } from "@/lib/data"
import { platformMeta } from "@/lib/platforms"
import { getAuthenticatedUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const links = await getAllLinks(auth.user.id)

    // Generate HTML email content
    const htmlContent = generateEmailHtml(links)

    // In a production app, you'd send this via Nodemailer, SendGrid, etc.
    // For the MVP, we simulate success and return the generated HTML
    return NextResponse.json({
      success: true,
      message: `Email would be sent to ${email} with ${links.length} links`,
      preview: htmlContent,
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}

function generateEmailHtml(
  links: Array<{
    name: string
    url: string
    description: string
    platform: string
    createdAt: string
  }>
): string {
  const linkRows = links
    .map((link) => {
      const meta =
        platformMeta[link.platform as keyof typeof platformMeta] ??
        platformMeta.other
      const date = new Date(link.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })

      return `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; background: ${meta.color}20; color: ${meta.color};">
            ${meta.label}
          </span>
          <p style="margin: 8px 0 4px; font-size: 16px; font-weight: 600; color: #111827;">${link.name}</p>
          <p style="margin: 0 0 4px; font-size: 14px; color: #374151;">${link.description}</p>
          <a href="${link.url}" style="font-size: 13px; color: #6b7280; word-break: break-all;">${link.url}</a>
          <p style="margin: 4px 0 0; font-size: 12px; color: #9ca3af;">${date}</p>
        </td>
      </tr>`
    })
    .join("")

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 4px;">Your Saved Links</h1>
  <p style="font-size: 14px; color: #6b7280; margin-bottom: 24px;">Exported from Social Saver Bot - ${links.length} links</p>
  <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px;">
    ${linkRows}
  </table>
  <p style="font-size: 12px; color: #9ca3af; margin-top: 24px; text-align: center;">
    Sent by Social Saver Bot
  </p>
</body>
</html>`
}
