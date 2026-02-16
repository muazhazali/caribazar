"use client"

import { useState } from "react"
import { SlidersHorizontal, X, Clock, Star, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer"
import { FOOD_TYPE_LABELS, type FoodType } from "@/lib/types"
import { cn } from "@/lib/utils"

export interface FilterState {
  foodTypes: FoodType[]
  openOnly: boolean
  minRating: number
}

interface FilterSheetProps {
  filters: FilterState
  onApply: (filters: FilterState) => void
  activeCount: number
}

export function FilterSheet({ filters, onApply, activeCount }: FilterSheetProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<FilterState>(filters)

  const handleOpen = () => {
    setDraft(filters)
    setOpen(true)
  }

  const handleApply = () => {
    onApply(draft)
    setOpen(false)
  }

  const handleReset = () => {
    const reset: FilterState = { foodTypes: [], openOnly: false, minRating: 0 }
    setDraft(reset)
    onApply(reset)
    setOpen(false)
  }

  const toggleFoodType = (ft: FoodType) => {
    setDraft((prev) => ({
      ...prev,
      foodTypes: prev.foodTypes.includes(ft)
        ? prev.foodTypes.filter((f) => f !== ft)
        : [...prev.foodTypes, ft],
    }))
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative h-10 w-10 rounded-full bg-card shadow-md border-border"
        onClick={handleOpen}
        aria-label="Filter bazaars"
      >
        <SlidersHorizontal size={16} />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {activeCount}
          </span>
        )}
      </Button>

      <Drawer open={open} onOpenChange={setOpen} modal={true}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="flex items-center justify-between pb-2">
            <div>
              <DrawerTitle>Tapis Bazaar</DrawerTitle>
              <DrawerDescription>Tapis mengikut jenis makanan, penilaian, dan status</DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X size={16} />
                <span className="sr-only">Tutup</span>
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="overflow-y-auto px-4 pb-4 space-y-4">
            {/* Open Now Toggle */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Clock size={14} className="text-primary" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-medium text-foreground">Buka sekarang</span>
                </div>
                <button
                  onClick={() => setDraft((p) => ({ ...p, openOnly: !p.openOnly }))}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-all duration-200",
                    draft.openOnly ? "bg-primary" : "bg-muted"
                  )}
                  role="switch"
                  aria-checked={draft.openOnly}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform duration-200",
                      draft.openOnly && "translate-x-5"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Min Rating */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                  <Star size={14} className="text-amber-500" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-medium text-foreground">Penilaian minimum</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[0, 3, 3.5, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setDraft((p) => ({ ...p, minRating: r }))}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                      "active:scale-95",
                      draft.minRating === r
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:bg-card hover:text-foreground border border-border"
                    )}
                  >
                    {r === 0 ? "Semua" : (
                      <span className="flex items-center gap-1">
                        <Star size={10} className="fill-current" />
                        {r}+
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Types */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                  <Utensils size={14} className="text-secondary" strokeWidth={2.5} />
                </div>
                <div className="flex items-center justify-between flex-1">
                  <span className="text-sm font-medium text-foreground">Jenis makanan</span>
                  {draft.foodTypes.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {draft.foodTypes.length} dipilih
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(FOOD_TYPE_LABELS) as FoodType[]).map((ft) => (
                  <button
                    key={ft}
                    onClick={() => toggleFoodType(ft)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                      "active:scale-95",
                      draft.foodTypes.includes(ft)
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:bg-card hover:text-foreground border border-border"
                    )}
                  >
                    {FOOD_TYPE_LABELS[ft]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 p-4 border-t border-border">
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Set Semula
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Tapis
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
