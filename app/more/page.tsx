"use client"

import { User, Settings, Info, LogOut } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function MorePage() {
  const menuItems = [
    { icon: User, label: "Profil", href: "/profile" },
    { icon: Settings, label: "Tetapan", href: "/settings" },
    { icon: Info, label: "Tentang", href: "/about" },
  ]

  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Profile Header */}
        <div className="bg-gradient-to-b from-primary/10 to-background p-6 pb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                U
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-foreground">Tetamu</h2>
              <p className="text-sm text-muted-foreground">guest@example.com</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start gap-3 h-12"
                asChild
              >
                <a href={item.href}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </a>
              </Button>
            )
          })}
        </div>

        <Separator className="my-4" />

        {/* Logout */}
        <div className="px-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={18} />
            <span>Log Keluar</span>
          </Button>
        </div>

        {/* App Info */}
        <div className="px-4 py-8 text-center">
          <p className="text-xs text-muted-foreground">
            Bazaar Ramadan Directory v1.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Dibuat dengan ❤️ untuk komuniti
          </p>
        </div>
      </div>

      <BottomNavigation activeTab="more" />
    </div>
  )
}
