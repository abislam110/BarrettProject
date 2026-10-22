import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { mapBackgrounds } from '@/lib/db/schema'
import { BACKGROUND_ENDPOINT } from '@/lib/map-background-config'

export { ALLOWED_BACKGROUND_TYPES, MAX_BACKGROUND_BYTES } from '@/lib/map-background-config'

export const BACKGROUND_ID = 'default'

export function backgroundUrl(updatedAt: Date) {
  return `${BACKGROUND_ENDPOINT}?v=${updatedAt.getTime()}`
}

/** Returns a cache-busted URL for the custom background, or null if none is set. */
export async function getCustomBackgroundUrl(): Promise<string | null> {
  const [row] = await db
    .select({ updatedAt: mapBackgrounds.updatedAt })
    .from(mapBackgrounds)
    .where(eq(mapBackgrounds.id, BACKGROUND_ID))
    .limit(1)
  return row ? backgroundUrl(row.updatedAt) : null
}
