'use client'

import { useEffect, useRef, useState } from 'react'
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch'
import { Minus, Plus, Maximize2, MapPin as MapPinIcon } from 'lucide-react'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/categories'
import type { Building, MapCoordinates } from '@/lib/types'
import { MapMarker } from './map-marker'

interface MapCanvasProps {
  building: Building
  selectedId: string | null
  onSelect: (id: string) => void
  isPlacing: boolean
  draft: MapCoordinates | null
  onPlace: (coordinates: MapCoordinates) => void
}

/** Pointer movement (px) beyond which a press is treated as a pan, not a click. */
const CLICK_TOLERANCE = 5

/**
 * The interactive map surface: a pannable / zoomable map image with pins.
 * Selecting a location (from here or the sidebar) smoothly zooms to its pin.
 * In placement mode, clicking the map drops a draft pin at that spot.
 */
export function MapCanvas({
  building,
  selectedId,
  onSelect,
  isPlacing,
  draft,
  onPlace,
}: MapCanvasProps) {
  const [scale, setScale] = useState(1)
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null)
  const markerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  function handlePlaceClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!isPlacing) return
    const start = pointerStart.current
    if (
      start &&
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > CLICK_TOLERANCE
    ) {
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    if (x < 0 || x > 100 || y < 0 || y > 100) return
    onPlace({ x, y })
  }

  useEffect(() => {
    if (!selectedId) return
    const node = markerRefs.current[selectedId]
    if (node && transformRef.current) {
      transformRef.current.zoomToElement(node, 2.2, 500)
    }
  }, [selectedId])

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted">
      <TransformWrapper
        ref={transformRef}
        minScale={0.6}
        maxScale={6}
        initialScale={1}
        centerOnInit
        limitToBounds={false}
        doubleClick={{ step: 0.7 }}
        wheel={{ step: 0.12 }}
        onTransform={(_ref, state) => setScale(state.scale)}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%' }}
            >
              <div
                className={`relative w-full ${isPlacing ? 'cursor-crosshair' : ''}`}
                onPointerDown={(e) => {
                  pointerStart.current = { x: e.clientX, y: e.clientY }
                }}
                onClick={handlePlaceClick}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={building.mapImage || '/placeholder.svg'}
                  alt={`Floor plan of ${building.name}`}
                  className="block h-auto w-full select-none"
                  draggable={false}
                />
                {building.locations.map((location) => (
                  <MapMarker
                    key={location.id}
                    ref={(el) => {
                      markerRefs.current[location.id] = el
                    }}
                    location={location}
                    inverseScale={1 / scale}
                    selected={selectedId === location.id}
                    onSelect={() => {
                      if (!isPlacing) onSelect(location.id)
                    }}
                  />
                ))}
                {isPlacing && draft && (
                  <div
                    className="pointer-events-none absolute"
                    style={{
                      left: `${draft.x}%`,
                      top: `${draft.y}%`,
                      transform: `translate(-50%, -100%) scale(${1 / scale})`,
                      transformOrigin: 'bottom center',
                    }}
                    aria-hidden="true"
                  >
                    <MapPinIcon className="h-9 w-9 animate-bounce fill-primary text-primary-foreground drop-shadow-lg" />
                  </div>
                )}
              </div>
            </TransformComponent>

            {isPlacing && (
              <div
                role="status"
                className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg"
              >
                {draft ? 'Click again to move the pin' : 'Click the map to place a pin'}
              </div>
            )}

            <MapLegend />

            {/* Zoom controls */}
            <div className="absolute bottom-6 right-4 flex flex-col overflow-hidden rounded-lg bg-card shadow-lg ring-1 ring-border">
              <button
                type="button"
                onClick={() => zoomIn()}
                aria-label="Zoom in"
                className="flex h-10 w-10 items-center justify-center text-card-foreground transition-colors hover:bg-accent"
              >
                <Plus className="h-5 w-5" />
              </button>
              <div className="h-px w-full bg-border" />
              <button
                type="button"
                onClick={() => zoomOut()}
                aria-label="Zoom out"
                className="flex h-10 w-10 items-center justify-center text-card-foreground transition-colors hover:bg-accent"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => resetTransform()}
              aria-label="Reset view"
              className="absolute bottom-6 left-4 flex h-10 w-10 items-center justify-center rounded-lg bg-card text-card-foreground shadow-lg ring-1 ring-border transition-colors hover:bg-accent"
            >
              <Maximize2 className="h-4.5 w-4.5" />
            </button>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}

function MapLegend() {
  return (
    <div className="pointer-events-none absolute right-4 top-4 rounded-lg bg-card/90 p-3 shadow-md ring-1 ring-border backdrop-blur-sm">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Legend
      </p>
      <ul className="flex flex-col gap-1.5">
        {CATEGORY_ORDER.map((category) => {
          const meta = CATEGORY_META[category]
          return (
            <li key={category} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: meta.colorToken }}
              />
              <span className="text-xs text-card-foreground">{meta.label}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
