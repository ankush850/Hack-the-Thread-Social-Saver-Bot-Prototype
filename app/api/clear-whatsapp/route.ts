<<<<<<< HEAD
import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
    const auth = await getAuthenticatedUser()
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workerUrl = process.env.WHATSAPP_WORKER_URL || "http://localhost:3001"

    try {
        const res = await fetch(`${workerUrl}/clear-queue`, {
            method: "POST"
        });

        if (!res.ok) {
            throw new Error("Failed to clear worker queue");
        }

        const data = await res.json();
        return NextResponse.json({ message: "Queue cleared", details: data }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error connecting to worker" },
            { status: 500 }
        )
    }
}
=======
import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
    const auth = await getAuthenticatedUser()
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workerUrl = process.env.WHATSAPP_WORKER_URL || "http://localhost:3001"

    try {
        const res = await fetch(`${workerUrl}/clear-queue`, {
            method: "POST"
        });

        if (!res.ok) {
            throw new Error("Failed to clear worker queue");
        }

        const data = await res.json();
        return NextResponse.json({ message: "Queue cleared", details: data }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error connecting to worker" },
            { status: 500 }
        )
    }
}
>>>>>>> 982de5be0005fc50a91e0d60a279260788774a51
