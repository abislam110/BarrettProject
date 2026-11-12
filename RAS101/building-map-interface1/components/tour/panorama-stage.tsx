
'use client'

import { useEffect, useRef, useState } from 'react'
import type { Viewer } from '@photo-sphere-viewer/core'
import type { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin'
import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'
import type { TourScene } from '@/lib/types'

const DEFAULT_LINK_PITCH = -25
const TRANSITION_MS = 1000

interface PanoramaStageProps {
  scene: TourScene
  sceneNames: Record<string, string>
  onNavigate: (sceneId: string) => void
  onSelectHotspot: (hotspotId: string) => void
  onHeadingChange?: (degrees: number) => void
  onLoadingChange?: (loading: boolean) => void
  className?: string
}

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

const toDegrees = (radians: number) =>
  (((radians * 180) / Math.PI) % 360 + 360) % 360

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

function arrowHtml(label: string) {
  return `<div class="tour-arrow" aria-label="Go to ${escapeHtml(label)}">
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none"
      stroke="currentColor" stroke-width="3" stroke-linecap="round"
      stroke-linejoin="round" aria-hidden="true">
      <path d="m6 15 6-6 6 6"/>
    </svg>
  </div>`
}

function hotspotHtml(title: string) {
  return `<div
    role="button"
    aria-label="More information about ${escapeHtml(title)}"
    style="
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #2563eb;
      color: white;
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.35);
      cursor: pointer;
      font-size: 23px;
      font-weight: bold;
    "
  >i</div>`
}

function renderMarkers(
  markers: MarkersPlugin,
  scene: TourScene,
  sceneNames: Record<string, string>,
) {
  markers.clearMarkers()

  // Existing navigation arrows
  scene.links.forEach((link, index) => {
    const label = sceneNames[link.to] ?? link.to

    markers.addMarker({
      id: `${scene.id}->${link.to}-${index}`,
      position: {
        yaw: toRadians(link.yaw),
        pitch: toRadians(link.pitch ?? DEFAULT_LINK_PITCH),
      },
      html: arrowHtml(label),
      size: { width: 64, height: 64 },
      anchor: 'center center',
      data: { to: link.to },
    })
  })

  // New information hotspots
  scene.hotspots?.forEach((hotspot) => {
    markers.addMarker({
      id: `hotspot-${scene.id}-${hotspot.id}`,
      position: {
        yaw: toRadians(hotspot.yaw),
        pitch: toRadians(hotspot.pitch),
      },
      html: hotspotHtml(hotspot.title),
      size: { width: 42, height: 42 },
      anchor: 'center center',
      tooltip: {
        content: escapeHtml(hotspot.title),
        position: 'top center',
      },
      data: { hotspotId: hotspot.id },
    })
  })
}

export function PanoramaStage({
  scene,
  sceneNames,
  onNavigate,
  onSelectHotspot,
  onHeadingChange,
  onLoadingChange,
  className,
}: PanoramaStageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const markersRef = useRef<MarkersPlugin | null>(null)
  const loadedSceneRef = useRef<string | null>(null)
  const [ready, setReady] = useState(false)

  const latest = useRef({
    scene,
    sceneNames,
    onNavigate,
    onSelectHotspot,
    onHeadingChange,
    onLoadingChange,
  })

  useEffect(() => {
    latest.current = {
      scene,
      sceneNames,
      onNavigate,
      onSelectHotspot,
      onHeadingChange,
      onLoadingChange,
    }
  })

  useEffect(() => {
    let cancelled = false
    let viewer: Viewer | null = null

    async function init() {
      const [{ Viewer }, { MarkersPlugin }] = await Promise.all([
        import('@photo-sphere-viewer/core'),
        import('@photo-sphere-viewer/markers-plugin'),
      ])

      if (cancelled || !containerRef.current) return

      const initial = latest.current.scene

      viewer = new Viewer({
        container: containerRef.current,
        panorama: initial.image,
        defaultYaw: toRadians(initial.initialYaw ?? 0),
        defaultZoomLvl: 20,
        navbar: ['zoom', 'fullscreen'],
        loadingTxt: 'Loading 360° scene…',
        plugins: [MarkersPlugin],
      })

      const markers = viewer.getPlugin<MarkersPlugin>(MarkersPlugin)

      markers.addEventListener('select-marker', ({ marker }) => {
        const to = marker.data?.to as string | undefined
        const hotspotId = marker.data?.hotspotId as string | undefined

        if (to) {
          latest.current.onNavigate(to)
        } else if (hotspotId) {
          latest.current.onSelectHotspot(hotspotId)
        }
      })

      viewer.addEventListener('position-updated', ({ position }) => {
        latest.current.onHeadingChange?.(toDegrees(position.yaw))
      })

      viewer.addEventListener(
        'ready',
        () => {
          renderMarkers(
            markers,
            latest.current.scene,
            latest.current.sceneNames,
          )

          loadedSceneRef.current = latest.current.scene.id
          setReady(true)
        },
        { once: true },
      )

      viewerRef.current = viewer
      markersRef.current = markers
    }

    void init()

    return () => {
      cancelled = true
      viewer?.destroy()
      viewerRef.current = null
      markersRef.current = null
      loadedSceneRef.current = null
    }
  }, [])

  useEffect(() => {
    const viewer = viewerRef.current
    const markers = markersRef.current

    if (!ready || !viewer || !markers) return
    if (loadedSceneRef.current === scene.id) return

    loadedSceneRef.current = scene.id
    markers.clearMarkers()

    latest.current.onLoadingChange?.(true)

    viewer
      .setPanorama(scene.image, {
        transition: {
          speed: TRANSITION_MS,
          rotation: false,
          effect: 'fade',
        },
        showLoader: false,
        ...(scene.initialYaw !== undefined && {
          position: {
            yaw: toRadians(scene.initialYaw),
            pitch: 0,
          },
        }),
      })
      .then((completed) => {
        if (completed && loadedSceneRef.current === scene.id) {
          renderMarkers(markers, scene, latest.current.sceneNames)
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to load tour scene', scene.id, error)
      })
      .finally(() => {
        if (loadedSceneRef.current === scene.id) {
          latest.current.onLoadingChange?.(false)
        }
      })
  }, [ready, scene])

  return <div ref={containerRef} className={className} />
}
