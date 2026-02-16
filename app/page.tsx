"use client"

import { useState, useMemo, useCallback } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Plus, List, Map as MapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { SearchBar } from "@/components/search-bar"
import { FilterSheet, type FilterState } from "@/components/filter-sheet"
import { BazaarCard } from "@/components/bazaar-card"
import { BAZAARS, searchBazaars } from "@/lib/mock-data"
import type { Bazaar } from "@/lib/types"

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
  const [showList, setShowList] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(true)

  const filteredBazaars = useMemo(() => {
    let results = search ? searchBazaars(search) : [...BAZAARS]

    if (filters.openOnly) {
      results = results.filter((b) => b.isOpen)
    }
    if (filters.minRating > 0) {
      results = results.filter((b) => b.rating >= filters.minRating)
    }
    if (filters.foodTypes.length > 0) {
      results = results.filter((b) =>
        filters.foodTypes.some((ft) => b.foodTypes.includes(ft))
      )
    }

    return results
  }, [search, filters])

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
      {/* Map */}
      <div className="flex-1 relative">
        {!showList ? (
          <BazaarMap
            bazaars={filteredBazaars}
            onMarkerClick={handleMarkerClick}
            selectedId={selectedBazaar?.id}
          />
        ) : (
          <div className="h-full overflow-y-auto bg-background p-4">
            <div className="mx-auto max-w-lg flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-foreground">
                {filteredBazaars.length} bazaar ditemui
              </h2>
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

        {/* Top Bar Overlay */}
        <div className="absolute top-0 left-0 right-0 z-[1000] p-4">
          <div className="mx-auto flex max-w-lg items-center gap-2">
            <SearchBar
              value={search}
              onChange={setSearch}
              className="flex-1"
            />
            <FilterSheet
              filters={filters}
              onApply={setFilters}
              activeCount={activeFilterCount}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full bg-card shadow-md border-border"
              onClick={() => setShowList(!showList)}
              aria-label={showList ? "Show map" : "Show list"}
            >
              {showList ? <MapIcon size={16} /> : <List size={16} />}
            </Button>
          </div>
        </div>

        {/* FAB: Add Bazaar */}
        <Link
          href="/add"
          className="absolute bottom-24 right-4 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="Tambah bazaar"
        >
          <Plus size={24} />
        </Link>
      </div>

      {/* Bottom Sheet with Bazaar List */}
      {!showList && (
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          modal={false}
          snapPoints={[0.3, 0.65]}
        >
          <DrawerContent className="max-h-[65vh]">
            <DrawerHeader className="pb-2">
              <DrawerTitle className="text-base">
                {selectedBazaar
                  ? selectedBazaar.name
                  : `${filteredBazaars.length} Bazaar Berhampiran`}
              </DrawerTitle>
              <DrawerDescription>
                {selectedBazaar
                  ? selectedBazaar.district + ", " + selectedBazaar.state
                  : "Seret ke atas untuk lihat semua"}
              </DrawerDescription>
            </DrawerHeader>

            <div className="overflow-y-auto px-4 pb-4">
              {selectedBazaar ? (
                <BazaarCard bazaar={selectedBazaar} variant="full" />
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredBazaars.map((bazaar) => (
                    <BazaarCard key={bazaar.id} bazaar={bazaar} variant="compact" />
                  ))}
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}
