<<<<<<< HEAD
"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"
import { toast } from "sonner"

export function SendWhatsAppDialog() {
    const [open, setOpen] = useState(false)
    const [receiverNumber, setReceiverNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [clearing, setClearing] = useState(false)

    const isFormValid = receiverNumber.trim() !== ""

    const handleClearQueue = async () => {
        setClearing(true)
        try {
            const res = await fetch("/api/clear-whatsapp", {
                method: "POST",
                credentials: "include",
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to clear queue")
            }

            const data = await res.json()
            toast.success(`Queue cleared successfully! (${data.details.previousSize} messages removed)`)
            setOpen(false)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setClearing(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isFormValid) {
            toast.error("WhatsApp number is required")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/send-whatsapp", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverNumber: receiverNumber.trim(),
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to send to WhatsApp")
            }

            toast.success("Messages sent to WhatsApp queue successfully!")
            setReceiverNumber("")
            setOpen(false)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5" variant="secondary">
                    <Send className="size-4" />
                    Send via WhatsApp
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send via WhatsApp</DialogTitle>
                    <DialogDescription>
                        Enter the recipient's WhatsApp number. All your saved links will be sent one by one. Include the country code.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="receiverNumber">
                            WhatsApp Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="receiverNumber"
                            type="text"
                            placeholder="e.g. 1234567890"
                            value={receiverNumber}
                            onChange={(e) => setReceiverNumber(e.target.value)}
                            required
                        />
                    </div>
                    <DialogFooter className="sm:justify-between">
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={clearing}
                            onClick={handleClearQueue}
                            className="mr-auto"
                        >
                            {clearing ? "Clearing..." : "Clear Queue"}
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading || !isFormValid}>
                                {loading ? "Sending..." : "Send Links"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
=======
"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"
import { toast } from "sonner"

export function SendWhatsAppDialog() {
    const [open, setOpen] = useState(false)
    const [receiverNumber, setReceiverNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [clearing, setClearing] = useState(false)

    const isFormValid = receiverNumber.trim() !== ""

    const handleClearQueue = async () => {
        setClearing(true)
        try {
            const res = await fetch("/api/clear-whatsapp", {
                method: "POST",
                credentials: "include",
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to clear queue")
            }

            const data = await res.json()
            toast.success(`Queue cleared successfully! (${data.details.previousSize} messages removed)`)
            setOpen(false)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setClearing(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isFormValid) {
            toast.error("WhatsApp number is required")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/send-whatsapp", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverNumber: receiverNumber.trim(),
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to send to WhatsApp")
            }

            toast.success("Messages sent to WhatsApp queue successfully!")
            setReceiverNumber("")
            setOpen(false)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5" variant="secondary">
                    <Send className="size-4" />
                    Send via WhatsApp
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send via WhatsApp</DialogTitle>
                    <DialogDescription>
                        Enter the recipient's WhatsApp number. All your saved links will be sent one by one. Include the country code.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="receiverNumber">
                            WhatsApp Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="receiverNumber"
                            type="text"
                            placeholder="e.g. 1234567890"
                            value={receiverNumber}
                            onChange={(e) => setReceiverNumber(e.target.value)}
                            required
                        />
                    </div>
                    <DialogFooter className="sm:justify-between">
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={clearing}
                            onClick={handleClearQueue}
                            className="mr-auto"
                        >
                            {clearing ? "Clearing..." : "Clear Queue"}
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading || !isFormValid}>
                                {loading ? "Sending..." : "Send Links"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
>>>>>>> 982de5be0005fc50a91e0d60a279260788774a51
