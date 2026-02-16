import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { StarRating } from "@/components/star-rating"
import { FoodTypeBadge } from "@/components/food-type-badge"
import type { Bazaar } from "@/lib/types"

interface BazaarCardProps {
  bazaar: Bazaar
  variant?: "compact" | "full"
  className?: string
}

export function BazaarCard({ bazaar, variant = "compact", className }: BazaarCardProps) {
  const isCompact = variant === "compact"

  return (
    <Link
      href={`/bazaar/${bazaar.id}`}
      className={cn(
        "group block rounded-xl bg-card border border-border/50 overflow-hidden shadow-sm transition-shadow hover:shadow-md",
        isCompact ? "flex gap-3 p-3" : "flex flex-col",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg shrink-0",
          isCompact ? "h-20 w-20" : "h-40 w-full"
        )}
      >
        <Image
          src={bazaar.photos[0]}
          alt={bazaar.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes={isCompact ? "80px" : "100vw"}
        />
        <span
          className={cn(
            "absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            bazaar.isOpen
              ? "bg-primary text-primary-foreground"
              : "bg-destructive text-destructive-foreground"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", bazaar.isOpen ? "bg-green-200" : "bg-red-200")} />
          {bazaar.isOpen ? "Buka" : "Tutup"}
        </span>
      </div>

      <div className={cn("flex flex-col justify-between min-w-0", !isCompact && "p-3")}>
        <div>
          <h3 className="font-semibold text-sm text-foreground truncate leading-tight">
            {bazaar.name}
          </h3>
          <div className="mt-1 flex items-center gap-1">
            <StarRating rating={bazaar.rating} size={12} />
            <span className="text-xs text-muted-foreground">
              ({bazaar.reviewCount})
            </span>
          </div>
        </div>

        <div className="mt-1.5 flex flex-col gap-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin size={11} className="shrink-0" />
            <span className="text-[11px] truncate">{bazaar.district}, {bazaar.state}</span>
          </div>
          {!isCompact && (
            <>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock size={11} className="shrink-0" />
                <span className="text-[11px]">
                  {bazaar.operatingHours.start} - {bazaar.operatingHours.end}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Store size={11} className="shrink-0" />
                <span className="text-[11px]">{bazaar.stallCount} gerai</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {bazaar.foodTypes.slice(0, 4).map((ft) => (
                  <FoodTypeBadge key={ft} foodType={ft} />
                ))}
                {bazaar.foodTypes.length > 4 && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    +{bazaar.foodTypes.length - 4}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
