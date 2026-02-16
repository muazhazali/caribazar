"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { useTheme } from "next-themes"
import L from "leaflet"
import { Navigation, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Bazaar } from "@/lib/types"
import { createEnhancedMarkerIcon, type MarkerStatus } from "./marker-icons"

import "leaflet/dist/leaflet.css"

// Global map instance tracking
let mapInstance: L.Map | null = null

function LocationButton() {
  const map = useMap()
  const [locating, setLocating] = useState(false)

  const handleLocate = useCallback(() => {
    setLocating(true)
    map.locate({ setView: true, maxZoom: 15 })
    map.once("locationfound", () => setLocating(false))
    map.once("locationerror", () => setLocating(false))
  }, [map])

  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute bottom-20 right-4 z-[999] h-12 w-12 rounded-full bg-card shadow-lg border-border hover:bg-card hover:scale-105 active:scale-95 transition-transform"
      onClick={handleLocate}
      aria-label="My location"
      disabled={locating}
    >
      <Navigation
        size={18}
        className={locating ? "animate-spin text-primary" : "text-foreground"}
        strokeWidth={2.5}
      />
    </Button>
  )
}

interface BazaarMapProps {
  bazaars: Bazaar[]
  onMarkerClick: (bazaar: Bazaar) => void
  selectedId?: string
}

export function BazaarMap({ bazaars, onMarkerClick, selectedId }: BazaarMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    // Cleanup any existing map instance
    if (containerRef.current) {
      const leafletContainer = containerRef.current.querySelector('.leaflet-container') as any
      if (leafletContainer?._leaflet_id) {
        try {
          // Remove the Leaflet ID to allow re-initialization
          delete leafletContainer._leaflet_id
        } catch (e) {
          console.warn('Failed to clean up map:', e)
        }
      }
    }

    setShouldRender(true)

    return () => {
      setShouldRender(false)
      mapInstance = null
    }
  }, [])

  // Center on KL
  const center: [number, number] = [3.1390, 101.6869]

  // Choose tiles based on theme
  const tileUrl = resolvedTheme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  const tileAttribution = resolvedTheme === "dark"
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

  if (!shouldRender) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Memuatkan peta...</span>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="h-full w-full">
      <MapContainer
        center={center}
        zoom={11}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={true}
        whenReady={(map) => {
          mapInstance = map.target
        }}
      >
        <TileLayer
          key={resolvedTheme}
          url={tileUrl}
          attribution={tileAttribution}
        />

        {bazaars.map((bazaar) => {
          const status: MarkerStatus = bazaar.isOpen ? "open" : "closed"
          const isSelected = bazaar.id === selectedId

          return (
            <Marker
              key={bazaar.id}
              position={[bazaar.lat, bazaar.lng]}
              icon={createEnhancedMarkerIcon({
                status,
                rating: bazaar.rating,
                isSelected
              })}
              eventHandlers={{
                click: () => onMarkerClick(bazaar),
              }}
            >
              <Popup className="custom-popup">
                <div className="min-w-[180px] p-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm leading-tight">{bazaar.name}</p>
                    {bazaar.rating >= 4.5 && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                        ⭐ {bazaar.rating}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <MapPin size={10} />
                    <p className="text-xs">{bazaar.district}, {bazaar.state}</p>
                  </div>
                  <Badge
                    variant={bazaar.isOpen ? "default" : "destructive"}
                    className="text-[10px] px-2 py-0.5"
                  >
                    {bazaar.isOpen ? "Buka" : "Tutup"}
                  </Badge>
                </div>
              </Popup>
            </Marker>
          )
        })}

        <LocationButton />
      </MapContainer>
    </div>
  )
}
