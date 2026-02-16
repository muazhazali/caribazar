"use client"

import { useEffect, useState } from "react"
import { Heart, CloudOff } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { BazaarCard } from "@/components/bazaar-card"
import { useFavorites } from "@/hooks/use-favorites"
import { getBazaarsByIds } from "@/lib/api/bazaars"
import { isAuthenticated } from "@/lib/pocketbase"
import type { Bazaar } from "@/lib/types"

export default function SavedPage() {
  const { favoriteIds, isLoading } = useFavorites()
  const [isAuth, setIsAuth] = useState(false)
  const [savedBazaars, setSavedBazaars] = useState<Bazaar[]>([])
  const [loadingBazaars, setLoadingBazaars] = useState(false)

  useEffect(() => {
    setIsAuth(isAuthenticated())
  }, [])

  // Fetch bazaars when favoriteIds change
  useEffect(() => {
    async function loadSavedBazaars() {
      if (favoriteIds.length > 0) {
        setLoadingBazaars(true)
        const bazaars = await getBazaarsByIds(favoriteIds)
        setSavedBazaars(bazaars)
        setLoadingBazaars(false)
      } else {
        setSavedBazaars([])
      }
    }

    loadSavedBazaars()
  }, [favoriteIds])

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background p-4 pb-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Bazaar Simpanan</h1>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-sm text-muted-foreground">
            {favoriteIds.length} bazaar disimpan
          </p>
          {!isAuth && (
            <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-full">
              <CloudOff size={12} />
              <span>Local sahaja</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {isLoading || loadingBazaars ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Memuatkan...</span>
            </div>
          </div>
        ) : savedBazaars.length > 0 ? (
          <div className="mx-auto max-w-lg flex flex-col gap-3">
            {savedBazaars.map((bazaar) => (
              <BazaarCard key={bazaar.id} bazaar={bazaar} variant="full" />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-sm">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart size={32} className="text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Tiada Bazaar Disimpan
              </h2>
              <p className="text-muted-foreground text-sm">
                Tekan ikon hati pada bazaar untuk menyimpannya di sini
              </p>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation activeTab="saved" />
    </div>
  )
}
