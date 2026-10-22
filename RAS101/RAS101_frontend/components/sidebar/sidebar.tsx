'use client'

import { MapPin, Plus, Search } from 'lucide-react'
import type { Building, BuildingLocation, MapCoordinates } from '@/lib/types'
import { LocationList } from './location-list'
import { LocationDetail } from './location-detail'
import { AddPinForm, type NewPinValues } from './add-pin-form'

interface SidebarProps {
  building: Building
  /** Locations after applying the search filter. */
  results: BuildingLocation[]
  selected: BuildingLocation | null
  query: string
  onQuery: (value: string) => void
  onSelect: (id: string) => void
  onBack: () => void
  onOpenPanorama: (location: BuildingLocation) => void
  isAdding: boolean
  draft: MapCoordinates | null
  onStartAdding: () => void
  onCancelAdding: () => void
  onCreatePin: (values: NewPinValues) => Promise<void>
  onDeletePin: (id: string) => Promise<void>
}

export function Sidebar({
  building,
  results,
  selected,
  query,
  onQuery,
  onSelect,
  onBack,
  onOpenPanorama,
  isAdding,
  draft,
  onStartAdding,
  onCancelAdding,
  onCreatePin,
  onDeletePin,
}: SidebarProps) {
  return (
    <aside className="flex h-1/2 w-full shrink-0 flex-col border-b border-border bg-sidebar md:h-full md:w-[380px] md:border-b-0 md:border-r">
      {/* Brand + building header */}
      <div className="flex items-center gap-2.5 px-4 pb-3 pt-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <MapPin className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold leading-tight text-foreground">
            {building.name}
          </h1>
          <p className="truncate text-xs text-muted-foreground">{building.address}</p>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={onStartAdding}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="h-4 w-4" />
            Add pin
          </button>
        )}
      </div>

      {!isAdding && (
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search this building"
              aria-label="Search locations"
              className="h-11 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isAdding ? (
          <AddPinForm coordinates={draft} onCancel={onCancelAdding} onSubmit={onCreatePin} />
        ) : selected ? (
          <LocationDetail
            key={selected.id}
            location={selected}
            onBack={onBack}
            onOpenPanorama={onOpenPanorama}
            onDelete={onDeletePin}
          />
        ) : (
          <LocationList locations={results} onSelect={onSelect} />
        )}
      </div>
    </aside>
  )
}
