import L from "leaflet"

export type MarkerStatus = "open" | "closed" | "opening-soon"

interface MarkerIconOptions {
  status: MarkerStatus
  rating?: number
  isSelected?: boolean
}

/**
 * Creates an enhanced marker icon with status indicators and optional rating badge
 */
export function createEnhancedMarkerIcon({
  status,
  rating,
  isSelected = false
}: MarkerIconOptions): L.DivIcon {
  // Color scheme based on status
  const colors = {
    open: {
      bg: "#10b981", // emerald-500
      pulse: "rgba(16, 185, 129, 0.3)",
      ring: "#ffffff"
    },
    closed: {
      bg: "#ef4444", // red-500
      pulse: "rgba(239, 68, 68, 0.3)",
      ring: "#ffffff"
    },
    "opening-soon": {
      bg: "#f59e0b", // amber-500
      pulse: "rgba(245, 158, 11, 0.3)",
      ring: "#ffffff"
    }
  }

  const color = colors[status]
  const showRating = rating && rating >= 4.5
  const size = isSelected ? 36 : 28
  const dotSize = isSelected ? 20 : 16

  // Build the marker HTML
  const html = `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;">
      ${isSelected ? `<div style="position:absolute;width:${size + 12}px;height:${size + 12}px;border-radius:50%;background:${color.pulse};animation:pulse 1.5s infinite;"></div>` : ''}
      <div style="position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${color.pulse};animation:pulse 2s infinite;"></div>
      <div style="
        width:${dotSize}px;
        height:${dotSize}px;
        border-radius:50%;
        background:${color.bg};
        border:${isSelected ? '3px' : '2.5px'} solid ${color.ring};
        box-shadow:0 ${isSelected ? '4px 12px' : '2px 6px'} rgba(0,0,0,${isSelected ? '0.4' : '0.3'});
        position:relative;
        z-index:2;
        transition: all 0.2s ease;
      "></div>
      ${showRating ? `
        <div style="
          position:absolute;
          top:-6px;
          right:-6px;
          width:18px;
          height:18px;
          border-radius:50%;
          background:#fbbf24;
          border:2px solid white;
          box-shadow:0 2px 4px rgba(0,0,0,0.2);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:3;
        ">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      ` : ''}
    </div>
  `

  return L.divIcon({
    className: "custom-marker-enhanced",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  })
}

/**
 * Creates a cluster marker icon showing the number of bazaars
 */
export function createClusterMarkerIcon(count: number, hasOpenBazaars: boolean): L.DivIcon {
  const size = count > 99 ? 44 : count > 9 ? 38 : 34
  const color = hasOpenBazaars ? "#059669" : "#6b7280" // emerald-600 or gray-500

  const html = `
    <div style="
      position:relative;
      display:flex;
      align-items:center;
      justify-content:center;
      width:${size}px;
      height:${size}px;
    ">
      <div style="
        position:absolute;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        background:${color}20;
        animation:pulse 2s infinite;
      "></div>
      <div style="
        width:${size - 4}px;
        height:${size - 4}px;
        border-radius:50%;
        background:${color};
        border:3px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
        display:flex;
        align-items:center;
        justify-content:center;
        position:relative;
        z-index:2;
      ">
        <span style="
          color:white;
          font-size:${count > 99 ? '11px' : '13px'};
          font-weight:700;
          font-family:system-ui,-apple-system,sans-serif;
        ">${count > 99 ? '99+' : count}</span>
      </div>
    </div>
  `

  return L.divIcon({
    className: "custom-cluster-marker",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

// Add pulse animation to global styles (inject once)
if (typeof window !== 'undefined') {
  const styleId = 'leaflet-marker-animations'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.15);
          opacity: 0.5;
        }
      }
      .custom-marker-enhanced,
      .custom-cluster-marker {
        background: transparent !important;
        border: none !important;
      }
    `
    document.head.appendChild(style)
  }
}
