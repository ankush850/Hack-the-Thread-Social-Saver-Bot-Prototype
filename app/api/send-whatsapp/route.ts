import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { getAllLinks } from "@/lib/data"

export async function POST(request: NextRequest) {
    const auth = await getAuthenticatedUser()
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { receiverNumber } = body

        if (!receiverNumber || typeof receiverNumber !== "string" || !receiverNumber.trim()) {
            return NextResponse.json(
                { error: "WhatsApp number is required" },
                { status: 400 }
            )
        }

        const links = await getAllLinks(auth.user.id)
        if (!links || links.length === 0) {
            return NextResponse.json(
                { error: "No saved links to send" },
                { status: 400 }
            )
        }

        const automationServiceUrl = process.env.WHATSAPP_WORKER_URL || "http://localhost:3001/send-message"

        let sentCount = 0;
        for (const link of links) {
            const messageText = `*${link.name}*\n${link.description}\n${link.url}`

            try {
                const res = await fetch(automationServiceUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        receiverNumber: receiverNumber.trim(),
                        messageText
                    })
                });

                if (res.ok) {
                    sentCount++;
                } else {
                    console.error("Failed to queue message for:", link.name);
                }
            } catch (err) {
                console.error("Error communicating with WhatsApp worker:", err);
            }
        }

        return NextResponse.json({ message: "Messages queued successfully", sentCount }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
