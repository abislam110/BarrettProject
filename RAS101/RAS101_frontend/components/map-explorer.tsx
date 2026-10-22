'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { CATEGORY_META } from '@/lib/categories'
import type { Building, BuildingLocation, MapCoordinates } from '@/lib/types'
import { Sidebar } from './sidebar/sidebar'
import { MapCanvas } from './map/map-canvas'
import { PanoramaModal } from './media/panorama-modal'
import type { NewPinValues } from './sidebar/add-pin-form'

const PINS_KEY = '/api/pins'

async function fetchPins(url: string): Promise<BuildingLocation[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to load pins')
  return res.json()
}

/**
 * Top-level client component. Owns all shared UI state (selection, search
 * query, open panorama, pin placement) and wires the sidebar and map together.
 * Pins are loaded from the database via SWR, seeded by the server render.
 */
export function MapExplorer({ building: initialBuilding }: { building: Building }) {
  const { data: locations = initialBuilding.locations, mutate } = useSWR(PINS_KEY, fetchPins, {
    fallbackData: initialBuilding.locations,
    revalidateOnMount: false,
  })
  const building = useMemo(
    () => ({ ...initialBuilding, locations }),
    [initialBuilding, locations],
  )

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [panorama, setPanorama] = useState<BuildingLocation | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [draft, setDraft] = useState<MapCoordinates | null>(null)

  const selected = locations.find((location) => location.id === selectedId) ?? null

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return locations
    return locations.filter((location) => {
      const category = CATEGORY_META[location.category]?.label.toLowerCase() ?? ''
      return (
        location.name.toLowerCase().includes(q) ||
        location.description.toLowerCase().includes(q) ||
        category.includes(q)
      )
    })
  }, [locations, query])

  function startAdding() {
    setSelectedId(null)
    setDraft(null)
    setIsAdding(true)
  }

  function cancelAdding() {
    setIsAdding(false)
    setDraft(null)
  }

  async function createPin(values: NewPinValues) {
    if (!draft) return
    const res = await fetch(PINS_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, x: draft.x, y: draft.y }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.error ?? 'Could not save pin')
    }
    const pin: BuildingLocation = await res.json()
    await mutate((current = []) => [...current, pin], { revalidate: false })
    setIsAdding(false)
    setDraft(null)
    setSelectedId(pin.id)
  }

  async function deletePin(id: string) {
    const previous = locations
    setSelectedId(null)
    await mutate(previous.filter((location) => location.id !== id), { revalidate: false })
    const res = await fetch(`${PINS_KEY}/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 404) {
      await mutate(previous, { revalidate: false })
      throw new Error('Could not delete pin')
    }
  }

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden md:flex-row">
      <Sidebar
        building={building}
        results={results}
        selected={selected}
        query={query}
        onQuery={setQuery}
        onSelect={setSelectedId}
        onBack={() => setSelectedId(null)}
        onOpenPanorama={setPanorama}
        isAdding={isAdding}
        draft={draft}
        onStartAdding={startAdding}
        onCancelAdding={cancelAdding}
        onCreatePin={createPin}
        onDeletePin={deletePin}
      />

      <div className="relative min-h-0 flex-1">
        <MapCanvas
          building={building}
          selectedId={selectedId}
          onSelect={setSelectedId}
          isPlacing={isAdding}
          draft={draft}
          onPlace={setDraft}
        />
      </div>

      {panorama && <PanoramaModal location={panorama} onClose={() => setPanorama(null)} />}
    </main>
  )
}
