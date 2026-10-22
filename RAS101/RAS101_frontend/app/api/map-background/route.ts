import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { mapBackgrounds } from '@/lib/db/schema'
import {
  ALLOWED_BACKGROUND_TYPES,
  BACKGROUND_ID,
  MAX_BACKGROUND_BYTES,
  backgroundUrl,
} from '@/lib/map-background'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [row] = await db
    .select()
    .from(mapBackgrounds)
    .where(eq(mapBackgrounds.id, BACKGROUND_ID))
    .limit(1)
  if (!row) return new NextResponse('Not found', { status: 404 })

  return new NextResponse(new Uint8Array(row.image), {
    headers: {
      'Content-Type': row.mimeType,
      // URLs are versioned with ?v=<timestamp>, so each version is immutable.
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      // SVGs could carry scripts; sandbox them if opened directly.
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  })
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
  }
  if (!ALLOWED_BACKGROUND_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Use a PNG, JPEG, WebP, GIF, or SVG image' },
      { status: 400 },
    )
  }
  if (file.size === 0 || file.size > MAX_BACKGROUND_BYTES) {
    return NextResponse.json({ error: 'Image must be under 4 MB' }, { status: 400 })
  }

  const image = Buffer.from(await file.arrayBuffer())
  const updatedAt = new Date()
  await db
    .insert(mapBackgrounds)
    .values({ id: BACKGROUND_ID, image, mimeType: file.type, updatedAt })
    .onConflictDoUpdate({
      target: mapBackgrounds.id,
      set: { image, mimeType: file.type, updatedAt },
    })

  return NextResponse.json({ url: backgroundUrl(updatedAt) })
}

export async function DELETE() {
  await db.delete(mapBackgrounds).where(eq(mapBackgrounds.id, BACKGROUND_ID))
  return NextResponse.json({ ok: true })
}
