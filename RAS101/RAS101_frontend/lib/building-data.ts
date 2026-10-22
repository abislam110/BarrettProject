import type { Building } from './types'

/**
 * ---------------------------------------------------------------------------
 * STAND-IN ASSETS — replace these with your own when ready.
 * ---------------------------------------------------------------------------
 * - `mapImage`   : generated placeholder floor plan at /public/maps.
 *                  Swap for your real map export (PNG/SVG/WEBP). Pin
 *                  coordinates are percentages, so any aspect ratio works.
 * - `PANORAMA_*` : public sample equirectangular photos. Replace with your
 *                  own 360° images (drop them in /public/panoramas).
 * - `VIDEO_*`    : public sample MP4s. Replace with your own walkthrough
 *                  clips (drop them in /public/videos).
 *
 * Coordinates are { x, y } percentages measured from the TOP-LEFT of the map
 * image (0–100). The pin's pointer tip sits exactly on that point.
 */

const PANORAMA_STANDIN =
  '/maps/img1.jpg'

const VIDEO_STANDIN_A =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
const VIDEO_STANDIN_B =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'

export const building: Building = {
  id: 'innovation-hall',
  name: 'Room 212',
  address: 'Poly ISTB12 · Floor 2',
  mapImage: '/maps/building-floorplan.png',
  locations: [
    {
      id: 'main-entrance',
      name: 'RAS Lab 1',
      category: 'room',
      description:
        'The Robotics Lab 1',
      coordinates: { x: 80, y: 15 },
      panoramaUrl: '/maps/img1.jpg',
    },

  ],
}
