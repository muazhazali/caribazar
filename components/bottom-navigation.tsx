"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Map, List, Heart, Plus, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export type NavTab = "map" | "list" | "saved" | "add" | "more"

interface BottomNavigationProps {
  activeTab?: NavTab
  onTabChange?: (tab: NavTab) => void
  className?: string
}

export function BottomNavigation({
  activeTab = "map",
  onTabChange,
  className
}: BottomNavigationProps) {
  const pathname = usePathname()

  const tabs = [
    { id: "map" as NavTab, icon: Map, label: "Peta", href: "/" },
    { id: "list" as NavTab, icon: List, label: "Senarai", href: "/?view=list" },
    { id: "saved" as NavTab, icon: Heart, label: "Simpanan", href: "/saved" },
    { id: "add" as NavTab, icon: Plus, label: "Tambah", href: "/add" },
    { id: "more" as NavTab, icon: Menu, label: "Lagi", href: "/more" },
  ]

  const handleClick = (tab: NavTab) => {
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[1000] bg-card border-t border-border shadow-lg",
        "safe-area-inset-bottom",
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-lg">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            const isAddButton = tab.id === "add"

            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => handleClick(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-colors relative",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                  isAddButton && "relative"
                )}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Add button gets special treatment */}
                {isAddButton ? (
                  <div className="absolute -top-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-card transition-transform hover:scale-105 active:scale-95">
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                ) : (
                  <>
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 2}
                      className="transition-all"
                    />
                    <span
                      className={cn(
                        "text-[10px] font-medium transition-all",
                        isActive && "font-semibold"
                      )}
                    >
                      {tab.label}
                    </span>
                    {isActive && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-primary rounded-full" />
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
