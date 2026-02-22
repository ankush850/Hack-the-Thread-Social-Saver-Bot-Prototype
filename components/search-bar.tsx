"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void
  initialValue?: string
}

export function SearchBar({ onSearch, initialValue = "" }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value)
    }, 300)

    return () => clearTimeout(timer)
  }, [value, onSearch])

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search links..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}
