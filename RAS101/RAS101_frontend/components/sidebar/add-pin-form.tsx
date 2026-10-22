'use client'

import { useState, type FormEvent } from 'react'
import { ArrowLeft, Crosshair, Loader2 } from 'lucide-react'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/categories'
import type { LocationCategory, MapCoordinates } from '@/lib/types'
import { Button } from '@/components/ui/button'

export interface NewPinValues {
  name: string
  category: LocationCategory
  description: string
  videoUrl: string
  panoramaUrl: string
}

interface AddPinFormProps {
  coordinates: MapCoordinates | null
  onCancel: () => void
  onSubmit: (values: NewPinValues) => Promise<void>
}

const inputClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'

export function AddPinForm({ coordinates, onCancel, onSubmit }: AddPinFormProps) {
  const [values, setValues] = useState<NewPinValues>({
    name: '',
    category: 'room',
    description: '',
    videoUrl: '',
    panoramaUrl: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof NewPinValues>(key: K, value: NewPinValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!coordinates) {
      setError('Click on the map to place the pin first.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(values)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save pin')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="sticky top-0 z-10 border-b border-border bg-sidebar px-4 py-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Add a pin</h2>
          <div
            className="mt-2 flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm"
            aria-live="polite"
          >
            <Crosshair className="h-4 w-4 shrink-0 text-primary" />
            {coordinates ? (
              <span className="text-foreground">
                Placed at {coordinates.x.toFixed(1)}%, {coordinates.y.toFixed(1)}%
                <span className="text-muted-foreground"> — click the map to move it</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Click anywhere on the map to place the pin</span>
            )}
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Name</span>
          <input
            required
            maxLength={80}
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Conference Room B"
            className={inputClass}
          />
        </label>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-medium text-foreground">Category</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_ORDER.map((category) => {
              const meta = CATEGORY_META[category]
              const active = values.category === category
              return (
                <label
                  key={category}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                    active
                      ? 'border-transparent text-white'
                      : 'border-border text-foreground hover:bg-accent'
                  }`}
                  style={active ? { backgroundColor: meta.colorToken } : undefined}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={active}
                    onChange={() => update('category', category)}
                    className="sr-only"
                  />
                  <meta.Icon className="h-3.5 w-3.5" />
                  {meta.label}
                </label>
              )
            })}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Description</span>
          <textarea
            rows={3}
            maxLength={1000}
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="What is this place?"
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">
            Video URL <span className="font-normal text-muted-foreground">(optional)</span>
          </span>
          <input
            type="url"
            value={values.videoUrl}
            onChange={(e) => update('videoUrl', e.target.value)}
            placeholder="https://…/walkthrough.mp4"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">
            360° panorama URL <span className="font-normal text-muted-foreground">(optional)</span>
          </span>
          <input
            type="url"
            value={values.panoramaUrl}
            onChange={(e) => update('panoramaUrl', e.target.value)}
            placeholder="https://…/panorama.jpg"
            className={inputClass}
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={submitting || !coordinates} className="w-full gap-2">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save pin
        </Button>
      </div>
    </form>
  )
}
