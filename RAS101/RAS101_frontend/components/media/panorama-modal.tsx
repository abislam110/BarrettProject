'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { BuildingLocation } from '@/lib/types'
import { PanoramaViewer } from '@/components/sidebar/panorama-viewer'

interface PanoramaModalProps {
  location: BuildingLocation
  onClose: () => void
}

export function PanoramaModal({ location, onClose }: PanoramaModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`360 degree tour of ${location.name}`}
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
    >
      <header className="flex shrink-0 items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {location.name} — Virtual Tour
          </p>
          <p className="text-xs text-white/60">
            360° view · Drag to look around · Select arrows to change scenes
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close 360 tour"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="min-h-0 flex-1 p-3">
        <PanoramaViewer />
      </div>
    </div>
  )
}