"use client"

import { Heart } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function SavedPage() {
  return (
    <div className="flex h-dvh flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart size={32} className="text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Bazaar Simpanan</h1>
          <p className="text-muted-foreground">
            Simpan bazaar kegemaran anda untuk akses mudah
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Ciri ini akan datang tidak lama lagi!
          </p>
        </div>
      </div>
      <BottomNavigation activeTab="saved" />
    </div>
  )
}
