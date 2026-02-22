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
import { MessageCircle } from "lucide-react"
import { toast } from "sonner"
import type { SavedLink } from "@/lib/data"

export function WhatsAppShareDialog() {
  // Dialog visibility state
  const [open, setOpen] = useState(false)

  // Phone number input
  const [phone, setPhone] = useState("")

  // Loading state while preparing data
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Remove spaces, +, -, etc → keep only digits
    const cleaned = phone.replace(/\D/g, "")

    // Basic validation
    if (!cleaned || cleaned.length < 7) {
      toast.error("Please enter a valid phone number with country code")
      return
    }

    setLoading(true)

    try {
      // Fetch saved links from API
      const res = await fetch("/api/links?stats=false")
      if (!res.ok) throw new Error("Failed to fetch links")

      const data = await res.json()
      const links: SavedLink[] = data.links ?? []

      // Prevent empty share
      if (links.length === 0) {
        toast.error("No links to share")
        setLoading(false)
        return
      }

      // Convert links into WhatsApp-friendly message
      const message = formatLinksMessage(links)

      // WhatsApp deep link
      const waUrl = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`

      // Open WhatsApp in new tab
      window.open(waUrl, "_blank", "noopener,noreferrer")

      toast.success("Opening WhatsApp...")

      // Reset UI
      setPhone("")
      setOpen(false)
    } catch {
      toast.error("Failed to prepare links for sharing")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button */}
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full gap-1.5">
          <MessageCircle className="size-4" />
          Send via WhatsApp
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send links via WhatsApp</DialogTitle>
          <DialogDescription>
            Enter a phone number with country code (e.g. 14155551234)
            to send all your saved links through WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">
              Phone number (with country code)
            </Label>

            {/* Phone input */}
            <Input
              id="phone"
              type="tel"
              placeholder="e.g. 14155551234"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            {/* Close dialog */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || phone.replace(/\D/g, "").length < 7}
            >
              {loading ? "Preparing..." : "Send via WhatsApp"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Formats saved links into a WhatsApp readable message
 */
function formatLinksMessage(links: SavedLink[]): string {
  // Message header
  const header =
    `*My Saved Links* (${links.length} total)\n` +
    `${"=".repeat(30)}\n\n`

  // Each link block
  const body = links
    .map((link, i) => {
      return `*${i + 1}. ${link.name}*\n${link.description}\n${link.url}`
    })
    .join("\n\n")

  // Footer branding
  const footer = `\n\n---\nShared via Social Saver Bot`

  return header + body + footer
}
