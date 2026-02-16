"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { EnhancedHeader } from "@/components/enhanced-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { FilterSheet, type FilterState } from "@/components/filter-sheet"
import { BazaarCard } from "@/components/bazaar-card"
import { getAllBazaars, searchBazaars as searchBazaarsAPI } from "@/lib/api/bazaars"
import type { Bazaar } from "@/lib/types"
import type { NavTab } from "@/components/bottom-navigation"

const BazaarMap = dynamic(
  () => import("@/components/map/bazaar-map").then((m) => m.BazaarMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Memuatkan peta...</span>
        </div>
      </div>
    ),
  }
)

export default function HomePage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    foodTypes: [],
    openOnly: false,
    minRating: 0,
  })
  const [selectedBazaar, setSelectedBazaar] = useState<Bazaar | null>(null)
  const [activeTab, setActiveTab] = useState<NavTab>("map")
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [openNowQuickFilter, setOpenNowQuickFilter] = useState(false)
  const [nearbyQuickFilter, setNearbyQuickFilter] = useState(false)
  const [bazaars, setBazaars] = useState<Bazaar[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const showList = activeTab === "list"

  // Load bazaars on mount and when search changes
  useEffect(() => {
    async function loadBazaars() {
      setIsLoading(true)
      try {
        if (search) {
          const results = await searchBazaarsAPI(search)
          setBazaars(results)
        } else {
          const allBazaars = await getAllBazaars()
          setBazaars(allBazaars)
        }
      } catch (error) {
        console.error('Failed to load bazaars:', error)
        setBazaars([])
      } finally {
        setIsLoading(false)
      }
    }

    loadBazaars()
  }, [search])

  const filteredBazaars = useMemo(() => {
    let results = [...bazaars]

    // Apply quick filters
    if (openNowQuickFilter || filters.openOnly) {
      results = results.filter((b) => b.isOpen)
    }

    // Apply advanced filters
    if (filters.minRating > 0) {
      results = results.filter((b) => b.rating >= filters.minRating)
    }
    if (filters.foodTypes.length > 0) {
      results = results.filter((b) =>
        filters.foodTypes.some((ft) => b.foodTypes.includes(ft))
      )
    }

    // TODO: Apply nearby filter based on user location
    // if (nearbyQuickFilter) { ... }

    return results
  }, [bazaars, filters, openNowQuickFilter, nearbyQuickFilter])

  const activeFilterCount =
    (filters.openOnly ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    filters.foodTypes.length

  const handleMarkerClick = useCallback((bazaar: Bazaar) => {
    setSelectedBazaar(bazaar)
    setDrawerOpen(true)
  }, [])

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      {/* Enhanced Header */}
      <EnhancedHeader
        searchValue={search}
        onSearchChange={setSearch}
        openNowActive={openNowQuickFilter}
        nearbyActive={nearbyQuickFilter}
        onOpenNowToggle={() => setOpenNowQuickFilter(!openNowQuickFilter)}
        onNearbyToggle={() => setNearbyQuickFilter(!nearbyQuickFilter)}
        userName="User"
        onProfileClick={() => setActiveTab("more")}
      />

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Memuatkan bazaar...</span>
            </div>
          </div>
        ) : !showList ? (
          <BazaarMap
            bazaars={filteredBazaars}
            onMarkerClick={handleMarkerClick}
            selectedId={selectedBazaar?.id}
          />
        ) : (
          <div className="absolute inset-0 overflow-y-auto bg-background p-4 pb-20">
            <div className="mx-auto max-w-lg flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {filteredBazaars.length} bazaar ditemui
                </h2>
                <FilterSheet
                  filters={filters}
                  onApply={setFilters}
                  activeCount={activeFilterCount}
                />
              </div>
              {filteredBazaars.map((bazaar) => (
                <BazaarCard key={bazaar.id} bazaar={bazaar} variant="full" />
              ))}
              {filteredBazaars.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-16 text-center">
                  <p className="text-muted-foreground">Tiada bazaar dijumpai</p>
                  <p className="text-sm text-muted-foreground">
                    Cuba tukar kata kunci atau tapis anda
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter Button for Map View (Floating) */}
        {!showList && (
          <div className="absolute top-4 right-4 z-[999]">
            <FilterSheet
              filters={filters}
              onApply={setFilters}
              activeCount={activeFilterCount}
            />
          </div>
        )}
      </div>

      {/* Bottom Sheet with Horizontal Scrollable Bazaar Cards */}
      {!showList && (
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          modal={false}
          snapPoints={[0.25, 0.65]}
        >
          <DrawerContent className="max-h-[65vh] pb-20">
            <DrawerHeader className="pb-2">
              <DrawerTitle className="text-base">
                {selectedBazaar
                  ? selectedBazaar.name
                  : `${filteredBazaars.length} Bazaar Berhampiran`}
              </DrawerTitle>
              <DrawerDescription>
                {selectedBazaar
                  ? selectedBazaar.district + ", " + selectedBazaar.state
                  : "Swipe untuk lihat lebih • Seret ke atas untuk semua"}
              </DrawerDescription>
            </DrawerHeader>

            <div className="overflow-y-auto px-4 pb-4">
              {selectedBazaar ? (
                <BazaarCard bazaar={selectedBazaar} variant="full" />
              ) : (
                <>
                  {/* Horizontal Scroll for First Few */}
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar mb-3">
                    {filteredBazaars.slice(0, 5).map((bazaar) => (
                      <div key={bazaar.id} className="snap-center shrink-0 w-[280px]">
                        <BazaarCard bazaar={bazaar} variant="full" />
                      </div>
                    ))}
                  </div>

                  {/* Vertical List for All */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-foreground mt-2 mb-1">
                      Semua Bazaar
                    </h3>
                    {filteredBazaars.map((bazaar) => (
                      <BazaarCard key={bazaar.id} bazaar={bazaar} variant="compact" />
                    ))}
                  </div>
                </>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  )
}
