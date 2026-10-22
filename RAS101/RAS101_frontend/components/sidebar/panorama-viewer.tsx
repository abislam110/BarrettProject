
'use client'

import { useEffect, useRef, useState } from 'react'
import { Viewer } from '@photo-sphere-viewer/core'
import '@photo-sphere-viewer/core/index.css'
import { tourScenes } from '@/lib/tour-data'
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin'
import type { MarkersPlugin as MarkersPluginType } from '@photo-sphere-viewer/markers-plugin'
import '@photo-sphere-viewer/markers-plugin/index.css'

type SceneId = keyof typeof tourScenes


export function PanoramaViewer() {
  const [sceneId, setSceneId] = useState<SceneId>('lobby')
  const viewerContainerRef = useRef<HTMLDivElement>(null)
const [viewerReady, setViewerReady] = useState(false)
  const viewerRef = useRef<Viewer | null>(null)

  const scene = tourScenes[sceneId]

  // Create the interactive 360-degree viewer.


  // Keep the rest of your existing effect unchanged.

  // Create the interactive 360-degree viewer.
  useEffect(() => {
    if (!viewerContainerRef.current) return

    const viewer = new Viewer({
      container: viewerContainerRef.current,
      panorama: tourScenes.lobby.image,
      navbar: ['zoom', 'fullscreen'],
      defaultZoomLvl: 50,
      plugins: [[MarkersPlugin, { markers: [] }]],
    })

    // ADD THE CLICK HANDLER HERE
const markersPlugin = viewer.getPlugin(MarkersPlugin)

markersPlugin.addEventListener('select-marker', (event) => {
  const target = event.marker.data?.target as SceneId | undefined

  if (target) {
    setSceneId(target)
  }
})

    // Store the initialized viewer.
    viewerRef.current = viewer
setViewerReady(true)

    return () => {
      viewer.destroy()
      viewerRef.current = null
    }
  }, [])


  // Load the next panorama when the selected scene changes.
  
  // Change panorama and update its clickable arrows.
  useEffect(() => {
    const viewer = viewerRef.current
if (!viewerReady || !viewer) return

const markersPlugin = viewer.getPlugin<MarkersPluginType>(
  MarkersPlugin
)
    if (!markersPlugin) return

    void viewer.setPanorama(scene.image).then(() => {
      markersPlugin.clearMarkers()

      scene.arrows.forEach((arrow, index) => {
        markersPlugin.addMarker({
          id: `${sceneId}-${index}`,
          position: {
            yaw: arrow.yaw,
            pitch: arrow.pitch,
          },
          html: '<div style="width:70px;height:70px;display:flex;align-items:center;justify-content:center;background:transparent;color:white;-webkit-text-stroke:4px black;font-family:Comic Sans MS, Comic Sans, cursive;font-size:70px;font-weight:bold;line-height:1;transform:translateY(20px);">^</div>',
          tooltip: arrow.label,
          size: { width: 50, height: 50 },
          anchor: 'center center',
          data: { target: arrow.target },
        })
      })
    })
    .catch((error) => {
      console.error('Failed to load panorama markers:', error)
    })
}, [viewerReady, sceneId, scene])


  return (
    <div className="w-full space-y-3">
      <div
        ref={viewerContainerRef}
        className="w-full overflow-hidden rounded-xl"
        style={{ height: '70vh', minHeight: '400px' }}
      />

       
    </div>
  )
}
