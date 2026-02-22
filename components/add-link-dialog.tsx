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
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { toast } from "sonner"

interface AddLinkDialogProps {
  onAdded: () => void
}

export function AddLinkDialog({ onAdded }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const isFormValid = name.trim() !== "" && url.trim() !== "" && description.trim() !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) {
      toast.error("All fields are required")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          url: url.trim(),
          description: description.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to add link")
      }

      toast.success("Link added successfully")
      setName("")
      setUrl("")
      setDescription("")
      setOpen(false)
      onAdded()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" />
          Add Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new link</DialogTitle>
          <DialogDescription>
            Enter a name, URL, and description. The platform will be
            auto-detected from the URL.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              Link Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Design Inspiration"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="url">
              URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="What is this link about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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
            <Button type="submit" disabled={loading || !isFormValid}>
              {loading ? "Adding..." : "Add Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
