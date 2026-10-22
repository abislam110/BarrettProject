import { MapExplorer } from '@/components/map-explorer'
import { building } from '@/lib/building-data'
import { listPins } from '@/lib/pins'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const locations = await listPins()
  return <MapExplorer building={{ ...building, locations }} />
}
