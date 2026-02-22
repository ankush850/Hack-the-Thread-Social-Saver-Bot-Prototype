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
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleaned = phone.replace(/\D/g, "")
    if (!cleaned || cleaned.length < 7) {
      toast.error("Please enter a valid phone number with country code")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/links?stats=false")
      if (!res.ok) throw new Error("Failed to fetch links")
      const data = await res.json()
      const links: SavedLink[] = data.links ?? []

      if (links.length === 0) {
        toast.error("No links to share")
        setLoading(false)
        return
      }

      const message = formatLinksMessage(links)
      const waUrl = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`

      window.open(waUrl, "_blank", "noopener,noreferrer")
      toast.success("Opening WhatsApp...")
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
            Enter a phone number with country code (e.g. 14155551234) to
            send all your saved links through WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone number (with country code)</Label>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
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

function formatLinksMessage(links: SavedLink[]): string {
  const header = `*My Saved Links* (${links.length} total)\n${"=".repeat(30)}\n\n`

  const body = links
    .map((link, i) => {
      return `*${i + 1}. ${link.name}*\n${link.description}\n${link.url}`
    })
    .join("\n\n")

  const footer = `\n\n---\nShared via Social Saver Bot`

  return header + body + footer
}
