import { doublePrecision, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const pins = pgTable('pins', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull().default(''),
  x: doublePrecision('x').notNull(),
  y: doublePrecision('y').notNull(),
  thumbnail: text('thumbnail'),
  videoUrl: text('video_url'),
  panoramaUrl: text('panorama_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type PinRow = typeof pins.$inferSelect
