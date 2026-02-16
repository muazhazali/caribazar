"use client"

import { Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickFilterChipsProps {
  openNowActive: boolean
  nearbyActive: boolean
  onOpenNowToggle: () => void
  onNearbyToggle: () => void
  className?: string
}

export function QuickFilterChips({
  openNowActive,
  nearbyActive,
  onOpenNowToggle,
  onNearbyToggle,
  className
}: QuickFilterChipsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Open Now Chip */}
      <button
        onClick={onOpenNowToggle}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "active:scale-95",
          openNowActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-card/90 text-muted-foreground border border-border hover:bg-card hover:text-foreground"
        )}
        aria-label="Filter open bazaars only"
        aria-pressed={openNowActive}
      >
        <Clock size={12} strokeWidth={2.5} />
        <span>Buka</span>
        {openNowActive && (
          <span className="ml-0.5 flex h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
        )}
      </button>

      {/* Nearby Chip */}
      <button
        onClick={onNearbyToggle}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "active:scale-95",
          nearbyActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-card/90 text-muted-foreground border border-border hover:bg-card hover:text-foreground"
        )}
        aria-label="Filter nearby bazaars only"
        aria-pressed={nearbyActive}
      >
        <MapPin size={12} strokeWidth={2.5} />
        <span>Berdekatan</span>
      </button>
    </div>
  )
}
