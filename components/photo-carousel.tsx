"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface PhotoCarouselProps {
  photos: string[]
  alt: string
}

export function PhotoCarousel({ photos, alt }: PhotoCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const onSelect = () => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }

  return (
    <div className="relative">
      <Carousel
        setApi={(api) => {
          setApi(api)
          api?.on("select", onSelect)
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {photos.map((photo, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={photo}
                  alt={`${alt} - Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots indicator */}
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                current === index
                  ? "w-6 bg-card"
                  : "w-1.5 bg-card/50"
              )}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
