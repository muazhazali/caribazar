"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  Settings,
  Info,
  LogOut,
  LogIn,
  ChevronRight,
  Heart,
  Star,
  PlusCircle,
  Shield,
} from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

const menuSections = [
  {
    title: "Akaun",
    items: [
      { icon: User, label: "Profil Saya", href: "/profile" },
      { icon: Heart, label: "Bazaar Tersimpan", href: "/saved" },
    ],
  },
  {
    title: "Sumbangan",
    items: [
      { icon: PlusCircle, label: "Tambah Bazaar", href: "/add" },
      { icon: Star, label: "Ulasan Saya", href: "/reviews" },
    ],
  },
  {
    title: "Lain-lain",
    items: [
      { icon: Settings, label: "Tetapan", href: "/settings" },
      { icon: Info, label: "Tentang Aplikasi", href: "/about" },
      { icon: Shield, label: "Dasar Privasi", href: "/privacy" },
    ],
  },
]

function MenuItem({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors active:bg-muted"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
        <Icon size={18} className="text-foreground/70" />
      </div>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <ChevronRight size={16} className="text-muted-foreground" />
    </Link>
  )
}

export default function MorePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success("Berjaya log keluar")
    router.refresh()
  }

  const avatarUrl = user?.avatar
    ? `https://pb-bazar.muaz.app/api/files/_pb_users_auth_/${user.id}/${user.avatar}`
    : undefined

  const displayName = user?.name || user?.username || "Pengguna"
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Header */}
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-foreground">Lagi</h1>
        </div>

        {/* Profile Section */}
        {isLoading ? (
          <div className="flex items-center gap-4 px-4 py-4 mb-2">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ) : isAuthenticated ? (
          <div className="mx-4 mb-4 flex items-center gap-4 rounded-2xl bg-primary/5 border border-primary/10 p-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{displayName}</p>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              {user?.role && user.role !== "user" && (
                <span className="inline-block mt-1 text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                  {user.role === "admin" ? "Pentadbir" : "Moderator"}
                </span>
              )}
            </div>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                <ChevronRight size={18} />
              </Button>
            </Link>
          </div>
        ) : (
          /* Not logged in — login CTA */
          <div className="mx-4 mb-4 rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <User size={22} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Belum Log Masuk</p>
                <p className="text-sm text-muted-foreground">Log masuk untuk lebih banyak ciri</p>
              </div>
            </div>
            <Button className="w-full" onClick={() => router.push("/login")}>
              <LogIn size={16} className="mr-2" />
              Log Masuk / Daftar
            </Button>
          </div>
        )}

        {/* Menu Sections */}
        <div className="space-y-4">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
              <div className="bg-card rounded-2xl mx-4 overflow-hidden border border-border/50">
                {section.items.map((item, index) => (
                  <div key={item.href}>
                    <MenuItem icon={item.icon} label={item.label} href={item.href} />
                    {index < section.items.length - 1 && (
                      <Separator className="ml-[64px]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout */}
        {isAuthenticated && (
          <div className="mx-4 mt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-destructive transition-colors hover:bg-destructive/10 active:bg-destructive/15"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                <LogOut size={18} className="text-destructive" />
              </div>
              <span className="flex-1 text-left text-sm font-medium">Log Keluar</span>
            </button>
          </div>
        )}

        {/* App Info */}
        <div className="px-4 py-8 text-center">
          <p className="text-xs text-muted-foreground">Cari Bazar v1.0</p>
          <p className="text-xs text-muted-foreground mt-1">Dibuat dengan ❤️ untuk komuniti Malaysia</p>
        </div>
      </div>

      <BottomNavigation activeTab="more" />
    </div>
  )
}
