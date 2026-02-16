"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Heart,
  Share2,
  Navigation,
  Clock,
  MapPin,
  Store,
  Star,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PhotoCarousel } from "@/components/photo-carousel"
import { StarRating } from "@/components/star-rating"
import { FoodTypeBadge } from "@/components/food-type-badge"
import { cn } from "@/lib/utils"
import type { Bazaar } from "@/lib/types"

interface BazaarDetailProps {
  bazaar: Bazaar
}

export function BazaarDetail({ bazaar }: BazaarDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header over carousel */}
      <div className="relative">
        <PhotoCarousel photos={bazaar.photos} alt={bazaar.name} />

        {/* Back button */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-sm"
            aria-label="Kembali"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </Link>
        </div>

        {/* Favorite & Share */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-sm"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={18}
              className={cn(
                "transition-colors",
                isFavorite ? "fill-destructive text-destructive" : "text-foreground"
              )}
            />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-sm"
            aria-label="Share"
          >
            <Share2 size={18} className="text-foreground" />
          </button>
        </div>

        {/* Status badge */}
        <div className="absolute bottom-3 left-4 z-10">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm",
              bazaar.isOpen
                ? "bg-primary/90 text-primary-foreground"
                : "bg-destructive/90 text-destructive-foreground"
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                bazaar.isOpen ? "bg-green-200" : "bg-red-200"
              )}
            />
            {bazaar.isOpen ? "Buka Sekarang" : "Tutup"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 -mt-3 relative rounded-t-2xl bg-background">
        <div className="mx-auto max-w-lg px-4 pt-5 pb-28">
          {/* Name & Rating */}
          <div>
            <h1 className="text-xl font-bold text-foreground text-balance leading-tight">
              {bazaar.name}
            </h1>
            <div className="mt-1.5 flex items-center gap-2">
              <StarRating rating={bazaar.rating} size={16} showValue />
              <span className="text-sm text-muted-foreground">
                ({bazaar.reviewCount} ulasan)
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="mt-5 grid grid-cols-1 gap-3">
            <InfoRow icon={<MapPin size={16} />} label="Alamat">
              {bazaar.address}
            </InfoRow>
            <InfoRow icon={<Clock size={16} />} label="Waktu Operasi">
              {bazaar.operatingHours.start} - {bazaar.operatingHours.end}
            </InfoRow>
            <InfoRow icon={<Store size={16} />} label="Jumlah Gerai">
              {bazaar.stallCount} gerai
            </InfoRow>
            <InfoRow icon={<MapPin size={16} />} label="Kawasan">
              {bazaar.district}, {bazaar.state}
            </InfoRow>
          </div>

          {/* Description */}
          <div className="mt-5">
            <h2 className="text-sm font-semibold text-foreground">Perihal</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {bazaar.description}
            </p>
          </div>

          {/* Food Types */}
          <div className="mt-5">
            <h2 className="text-sm font-semibold text-foreground">Jenis Makanan</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {bazaar.foodTypes.map((ft) => (
                <FoodTypeBadge key={ft} foodType={ft} />
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Ulasan ({bazaar.reviews.length})
              </h2>
            </div>

            <div className="mt-3 flex flex-col gap-3">
              {bazaar.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                      <User size={14} className="text-secondary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {review.userName}
                      </p>
                      <div className="flex items-center gap-1">
                        <StarRating rating={review.rating} size={10} />
                        <span className="text-[10px] text-muted-foreground">
                          {review.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-3">
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl"
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label="Favorite"
          >
            <Heart
              size={18}
              className={cn(
                isFavorite ? "fill-destructive text-destructive" : "text-foreground"
              )}
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl"
            aria-label="Share"
          >
            <Share2 size={18} />
          </Button>
          <Button className="h-11 flex-1 rounded-xl gap-2 text-sm font-semibold" asChild>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${bazaar.lat},${bazaar.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation size={16} />
              Navigasi ke Sini
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
        <span className="text-secondary-foreground">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-foreground mt-0.5">{children}</p>
      </div>
    </div>
  )
}
