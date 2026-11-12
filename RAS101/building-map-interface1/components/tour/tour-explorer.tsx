'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Compass, Loader2, X } from 'lucide-react'
import type { Building } from '@/lib/types'
import { cn } from '@/lib/utils'
import { PanoramaStage } from './panorama-stage'
import { TourMinimap } from './tour-minimap'



interface TourExplorerProps {
  building: Building
  initialSceneId: string
  
}

/**
 * The walkable 360° tour. Owns the current scene and mirrors it into the URL
 * (`/tour?scene=<id>`) so any scene can be linked to or reloaded directly.
 */
export function TourExplorer({ building, initialSceneId }: TourExplorerProps) {
  const { scenes } = building.tour
  const [sceneId, setSceneId] = useState(initialSceneId)
  const [heading, setHeading] = useState(0)
  const [loading, setLoading] = useState(false)

  const scene = scenes.find((s) => s.id === sceneId) ?? scenes[0]
  const locationName =
  building.locations.find(
    (location) => location.id === scene.locationId,
  )?.name ?? 'Unknown Room'

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null)

  const selectedHotspot = scene.hotspots?.find(
    (hotspot) => hotspot.id === selectedHotspotId,
  )
  const sceneNames = useMemo(
  () => Object.fromEntries(scenes.map((s) => [s.id, s.name])),
  [scenes],
)

  function navigate(id: string) {
  if (id === scene.id || !scenes.some((s) => s.id === id)) return

  setSelectedHotspotId(null)
  setSceneId(id)

  window.history.replaceState(
    null,
    '',
    `/tour?scene=${encodeURIComponent(id)}`,
  )
}

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background text-foreground">
      <PanoramaStage
        scene={scene}
        sceneNames={sceneNames}
        onNavigate={navigate}
        onSelectHotspot={setSelectedHotspotId}
        onHeadingChange={(deg) => setHeading(Math.round(deg))}
        onLoadingChange={setLoading}
        className="absolute inset-0"
      />
{selectedHotspot && (
  <div
    role="dialog"
    aria-modal="false"
    aria-labelledby="hotspot-title"
    className="pointer-events-auto absolute right-4 top-1/2 z-30 w-[min(34rem,calc(100%-2rem))] -translate-y-1/2 overflow-hidden rounded-xl bg-card text-card-foreground shadow-2xl ring-1 ring-border"
  >
    <div className="flex items-center justify-between border-b border-border p-4">
      <h2
        id="hotspot-title"
        className="text-lg font-semibold"
      >
        {selectedHotspot.title}
      </h2>

      <button
        type="button"
        onClick={() => setSelectedHotspotId(null)}
        aria-label="Close information popup"
        className="rounded-lg p-2 transition-colors hover:bg-accent"
      >
        <X className="h-5 w-5" />
      </button>
    </div>

    <div className="flex flex-col gap-4 p-4 sm:flex-row">
      {(selectedHotspot.videoUrl || selectedHotspot.image) && (
        <div className="w-full shrink-0 overflow-hidden rounded-lg sm:w-2/5">
          {selectedHotspot.videoUrl ? (
            <video
              src={selectedHotspot.videoUrl}
              controls
              playsInline
              className="max-h-48 w-full rounded-lg object-cover"
            />
          ) : (
            <img
              src={selectedHotspot.image}
              alt={selectedHotspot.title}
              className="max-h-48 w-full rounded-lg object-cover"
            />
          )}
        </div>
      )}

      <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">
        {selectedHotspot.description}
      </p>
    </div>
  </div>
)}
      {/* Top bar: back to map + where you are */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3">
        <div className="pointer-events-auto flex min-w-0 items-center gap-1 rounded-xl bg-card/95 p-1.5 pr-4 text-card-foreground shadow-lg ring-1 ring-border backdrop-blur">
          <Link
            href="/"
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Map
          </Link>
          <span className="mx-1 h-8 w-px shrink-0 bg-border" aria-hidden="true" />
          <div className="min-w-0 pl-1">
            <h1 className="truncate text-sm font-semibold leading-tight">
  {locationName}
</h1>
            <p className="truncate text-xs text-muted-foreground">{building.name}</p>
          </div>
        </div>

        <div
          className="pointer-events-auto hidden items-center gap-1.5 rounded-full bg-card/95 px-3 py-2 text-xs text-card-foreground shadow-lg ring-1 ring-border backdrop-blur sm:flex"
          title="Use this value as a link's yaw in lib/building-data.ts"
        >
          <Compass className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Heading</span>
          <span className="w-9 text-right font-medium tabular-nums">{heading}°</span>
        </div>
      </div>

      {loading && (
        <div
          role="status"
          className="pointer-events-none absolute left-1/2 top-20 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-card/95 px-3 py-1.5 text-xs text-card-foreground shadow-lg ring-1 ring-border"
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Walking …
        </div>
      )}

              
              <div className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex flex-col gap-3 p-3 md:flex-row md:items-end">
                    <div className="pointer-events-auto hidden w-60 shrink-0 rounded-xl bg-card/95 p-2 shadow-lg ring-1 ring-border backdrop-blur md:block">
                      <TourMinimap
                        mapImage={building.mapImage}
                        scenes={scenes}
                        currentId={scene.id}
                        heading={heading}
                        onSelect={navigate}
                      />
                    </div>

                    <nav
                      aria-label="Tour scenes"
                      className="pointer-events-auto min-w-0 overflow-x-auto rounded-xl bg-card/95 p-1.5 shadow-lg ring-1 ring-border backdrop-blur md:mx-auto"
                    >
                      <ul className="flex gap-1">
                        {scenes.map((s) => {
                          const isCurrent = s.id === scene.id
                          return (
                            <li key={s.id}>
                              <button
                                type="button"
                                onClick={() => navigate(s.id)}
                                aria-current={isCurrent ? 'location' : undefined}
                                className={cn(
                                  'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                  isCurrent
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-card-foreground hover:bg-accent',
                                )}
                              >
                                {s.name}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </nav>
                  </div> 
                  {/* */}
    </main>
  )
}
