'use client'

import { useRef, useState } from 'react'
import { ImageIcon, Loader2, RotateCcw } from 'lucide-react'
import {
  ALLOWED_BACKGROUND_TYPES,
  BACKGROUND_ENDPOINT,
  MAX_BACKGROUND_BYTES,
} from '@/lib/map-background-config'

interface BackgroundControlProps {
  isCustom: boolean
  onChange: (url: string | null) => void
}

/** Floating map control to upload a new background image or restore the default. */
export function BackgroundControl({ isCustom, onChange }: BackgroundControlProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File) {
    setError(null)
    if (!ALLOWED_BACKGROUND_TYPES.includes(file.type)) {
      setError('Use a PNG, JPEG, WebP, GIF, or SVG image')
      return
    }
    if (file.size > MAX_BACKGROUND_BYTES) {
      setError('Image must be under 4 MB')
      return
    }
    setBusy(true)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch(BACKGROUND_ENDPOINT, { method: 'POST', body })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error ?? 'Upload failed')
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  async function reset() {
    if (!window.confirm('Restore the original map background?')) return
    setError(null)
    setBusy(true)
    try {
      const res = await fetch(BACKGROUND_ENDPOINT, { method: 'DELETE' })
      if (!res.ok) throw new Error('Could not reset background')
      onChange(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset background')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="absolute bottom-6 left-16 flex flex-col items-start gap-2">
      {error && (
        <p role="alert" className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground shadow-lg">
          {error}
        </p>
      )}
      <div className="flex overflow-hidden rounded-lg bg-card shadow-lg ring-1 ring-border">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-10 items-center gap-2 px-3 text-sm font-medium text-card-foreground transition-colors hover:bg-accent disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          Change background
        </button>
        {isCustom && (
          <>
            <div className="w-px bg-border" />
            <button
              type="button"
              onClick={reset}
              disabled={busy}
              aria-label="Restore original background"
              title="Restore original background"
              className="flex h-10 w-10 items-center justify-center text-card-foreground transition-colors hover:bg-accent disabled:opacity-60"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_BACKGROUND_TYPES.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) upload(file)
        }}
      />
    </div>
  )
}
