
'use client'

import type { TourScene } from '@/lib/types'

interface TourMinimapProps {
  mapImage: string
  scenes: TourScene[]
  currentId: string
  heading: number
  onSelect: (sceneId: string) => void
}

export function TourMinimap({
  mapImage,
  scenes,
  currentId,
  heading,
}: TourMinimapProps) {
  const currentScene = scenes.find((scene) => scene.id === currentId)

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mapImage || '/placeholder.svg'}
        alt="Floor plan"
        className="block h-auto w-full select-none opacity-90"
        draggable={false}
      />

      {currentScene?.coordinates && (
        <div
          className="absolute z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{
            left: `${currentScene.coordinates.x}%`,
            top: `${currentScene.coordinates.y}%`,
          }}
        >
          <span
            aria-hidden="true"
            className="tour-view-cone absolute inset-0"
            style={{ transform: `rotate(${heading}deg)` }}
          />
          <span className="tour-here-dot relative h-3.5 w-3.5 rounded-full" />
        </div>
      )}
    </div>
  )
}
