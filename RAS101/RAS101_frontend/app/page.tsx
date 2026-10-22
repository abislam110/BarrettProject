import { MapExplorer } from '@/components/map-explorer'
import { building } from '@/lib/building-data'
import { getCustomBackgroundUrl } from '@/lib/map-background'
import { listPins } from '@/lib/pins'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [locations, customBackground] = await Promise.all([
    listPins(),
    getCustomBackgroundUrl(),
  ])
  return (
    <MapExplorer
      building={{ ...building, locations }}
      defaultMapImage={building.mapImage}
      initialMapImage={customBackground ?? building.mapImage}
    />
  )
}
