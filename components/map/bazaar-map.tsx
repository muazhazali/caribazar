"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Bazaar } from "@/lib/types"

import "leaflet/dist/leaflet.css"

// Global map instance tracking
let mapInstance: L.Map | null = null

function createMarkerIcon(isOpen: boolean): L.DivIcon {
  const color = isOpen ? "#15803d" : "#dc2626"
  const pulseColor = isOpen ? "rgba(21,128,61,0.3)" : "rgba(220,38,38,0.3)"
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:${pulseColor};animation:pulse 2s infinite;"></div>
        <div style="width:16px;height:16px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);position:relative;z-index:2;"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
}

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
      className="absolute bottom-4 right-4 z-[1000] h-10 w-10 rounded-full bg-card shadow-lg border-border"
      onClick={handleLocate}
      aria-label="My location"
      disabled={locating}
    >
      <Navigation size={16} className={locating ? "animate-pulse text-primary" : "text-foreground"} />
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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {bazaars.map((bazaar) => (
          <Marker
            key={bazaar.id}
            position={[bazaar.lat, bazaar.lng]}
            icon={createMarkerIcon(bazaar.isOpen)}
            eventHandlers={{
              click: () => onMarkerClick(bazaar),
            }}
          >
            <Popup>
              <div className="min-w-[160px]">
                <p className="font-semibold text-sm">{bazaar.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{bazaar.district}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        <LocationButton />
      </MapContainer>
    </div>
  )
}
