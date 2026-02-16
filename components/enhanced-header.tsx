"use client"

import { Moon, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchBar } from "@/components/search-bar"
import { QuickFilterChips } from "@/components/quick-filter-chips"
import { cn } from "@/lib/utils"

interface EnhancedHeaderProps {
  searchValue: string
  onSearchChange: (value: string) => void
  openNowActive: boolean
  nearbyActive: boolean
  onOpenNowToggle: () => void
  onNearbyToggle: () => void
  userAvatar?: string
  userName?: string
  onProfileClick?: () => void
  className?: string
}

export function EnhancedHeader({
  searchValue,
  onSearchChange,
  openNowActive,
  nearbyActive,
  onOpenNowToggle,
  onNearbyToggle,
  userAvatar,
  userName,
  onProfileClick,
  className
}: EnhancedHeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-md border-b border-border/50",
        className
      )}
    >
      <div className="mx-auto max-w-lg px-4 py-3 space-y-3">
        {/* Top Row: Logo + Search + Profile */}
        <div className="flex items-center gap-3">
          {/* Brand Logo */}
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 shrink-0">
            <Moon className="h-5 w-5 text-primary" strokeWidth={2.5} />
          </div>

          {/* Search Bar */}
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            className="flex-1"
          />

          {/* User Profile Avatar */}
          <button
            onClick={onProfileClick}
            className={cn(
              "shrink-0 rounded-full focus:outline-none",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "transition-transform hover:scale-105 active:scale-95"
            )}
            aria-label="Open user profile"
          >
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={userAvatar} alt={userName || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {userName ? userName.charAt(0).toUpperCase() : <User size={16} />}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>

        {/* Quick Filter Chips Row */}
        <QuickFilterChips
          openNowActive={openNowActive}
          nearbyActive={nearbyActive}
          onOpenNowToggle={onOpenNowToggle}
          onNearbyToggle={onNearbyToggle}
        />
      </div>
    </div>
  )
}
