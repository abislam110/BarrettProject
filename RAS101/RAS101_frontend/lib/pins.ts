import { asc, eq } from 'drizzle-orm'
import { db } from './db'
import { pins, type PinRow } from './db/schema'
import { CATEGORY_ORDER } from './categories'
import type { BuildingLocation, LocationCategory } from './types'

function toLocation(row: PinRow): BuildingLocation {
  return {
    id: row.id,
    name: row.name,
    category: row.category as LocationCategory,
    description: row.description,
    coordinates: { x: row.x, y: row.y },
    thumbnail: row.thumbnail ?? undefined,
    videoUrl: row.videoUrl ?? undefined,
    panoramaUrl: row.panoramaUrl ?? undefined,
  }
}

export async function listPins(): Promise<BuildingLocation[]> {
  const rows = await db.select().from(pins).orderBy(asc(pins.createdAt))
  return rows.map(toLocation)
}

export async function deletePin(id: string): Promise<boolean> {
  const deleted = await db.delete(pins).where(eq(pins.id, id)).returning({ id: pins.id })
  return deleted.length > 0
}

export interface NewPinInput {
  name: string
  category: LocationCategory
  description: string
  x: number
  y: number
  videoUrl?: string
  panoramaUrl?: string
}

function optionalUrl(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value !== 'string' || value.length > 2048) throw new Error(`Invalid ${field}`)
  const trimmed = value.trim()
  if (trimmed.startsWith('/')) return trimmed
  try {
    const url = new URL(trimmed)
    if (url.protocol === 'https:' || url.protocol === 'http:') return trimmed
  } catch {}
  throw new Error(`Invalid ${field}`)
}

function coordinate(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(`Invalid ${field}`)
  }
  return Math.round(value * 100) / 100
}

export function parseNewPin(body: unknown): NewPinInput {
  if (!body || typeof body !== 'object') throw new Error('Invalid request body')
  const b = body as Record<string, unknown>

  const name = typeof b.name === 'string' ? b.name.trim() : ''
  if (!name || name.length > 80) throw new Error('Name is required (max 80 characters)')

  if (typeof b.category !== 'string' || !CATEGORY_ORDER.includes(b.category as LocationCategory)) {
    throw new Error('Invalid category')
  }

  const description = typeof b.description === 'string' ? b.description.trim() : ''
  if (description.length > 1000) throw new Error('Description is too long (max 1000 characters)')

  return {
    name,
    category: b.category as LocationCategory,
    description,
    x: coordinate(b.x, 'x'),
    y: coordinate(b.y, 'y'),
    videoUrl: optionalUrl(b.videoUrl, 'video URL'),
    panoramaUrl: optionalUrl(b.panoramaUrl, 'panorama URL'),
  }
}

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'pin'
  )
}

export async function createPin(input: NewPinInput): Promise<BuildingLocation> {
  const id = `${slugify(input.name)}-${crypto.randomUUID().slice(0, 8)}`
  const [row] = await db
    .insert(pins)
    .values({
      id,
      name: input.name,
      category: input.category,
      description: input.description,
      x: input.x,
      y: input.y,
      videoUrl: input.videoUrl ?? null,
      panoramaUrl: input.panoramaUrl ?? null,
    })
    .returning()
  return toLocation(row)
}
