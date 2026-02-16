"use client"

import { useState, useCallback, useEffect } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = useCallback(
    (val: string) => {
      setLocalValue(val)
      const timeout = setTimeout(() => onChange(val), 250)
      return () => clearTimeout(timeout)
    },
    [onChange]
  )

  return (
    <div className={cn("relative", className)}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        placeholder="Cari bazaar, lokasi, atau makanan..."
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-9 text-sm shadow-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue("")
            onChange("")
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
