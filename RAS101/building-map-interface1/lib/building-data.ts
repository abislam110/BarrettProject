import type { Building } from './types'

/**
 * The single source of truth for everything the app renders.
 *
 * This is a pure frontend project — there is no backend. To adapt the map to a
 * real building, edit this file only; you should not need to touch any
 * components:
 *   - `mapImage`: point at your floor-plan image (in /public) or an absolute URL.
 *   - each location's `coordinates`: x/y as percentages (0–100) of the map image.
 *   - `description`: shown in the sidebar detail view.
 *   - `videoUrl` (optional): drop files in /public/videos and reference them here.
 *   - `tourSceneId` (optional): which 360° tour scene "View 360°" opens.
 *   - `thumbnail` (optional): small preview image for the detail view.
 *
 * 360° TOUR (the `/tour` page):
 * `tour.scenes` is a graph. Each scene is one equirectangular photo in
 * `/public/panoramas/<scene-id>.jpg`; its `links` are the Street View-style
 * arrows that walk you to neighbouring scenes.
 *   - Replace a photo: overwrite the file in public/panoramas, same filename.
 *   - Add a scene: drop `<id>.jpg` in public/panoramas, add an entry below,
 *     and add a link to it from at least one other scene (links are one-way,
 *     so add the return link too).
 *   - Aim an arrow: open the scene, face the doorway, and copy the "Heading"
 *     value shown in the tour's top bar into that link's `yaw`.
 *
 * The scene photos come from the RAS101 fork (img1–img5), resized to
 * 6144×3072 for faster loading. The video/thumbnail URLs are public stand-ins.
 */
export const building: Building = {
  id: 'innovation-hall',
  name: 'Second Floor',
  address: 'Poly ISTB12',
  mapImage: '/maps/building-floorplan.png',
  locations: [
    
    {
      id: 'lab-room-212',
      name: 'Lab Room 212',
      category: 'room',
      description:
        'Lab room used by robotics & manufacturing students',
      coordinates: { x: 57, y: 17 },
      thumbnail: '',
      tourSceneId: 'lobby',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    
  ],
  tour: {
    startSceneId: 'lobby',
    scenes: [
      {
        id: 'lobby',
        name: 'Lab Room 1',
        locationId: 'lab-room-212',
        image: '/panoramas/lobby.jpg',
        coordinates: { x: 55, y: 17 },
        links: [
          { to: 'hallway', yaw: 310 },
          { to: 'courtyard', yaw: 220 },
        ],
      },
      {
        id: 'hallway',
        name: 'Hallway',
        locationId: 'lab-room-212',
        image: '/panoramas/hallway.jpg',
        coordinates: { x: 55, y: 10 },
        links: [
          { to: 'lobby', yaw: 130 },
          { to: 'classroom', yaw: 235 },
        ],
  hotspots: [
    {
      id: 'franc-cobot',
      title: 'FRANUC Cobot',
      description:
        'The FRANUC Cobot is a collaborative robot used in the lab for various tasks and demonstrations.',
      yaw: 285,
      pitch: 355,
      image: '/thumbnails/lobby.png',
    },
  ],
      },
      {
        id: 'classroom',
        name: 'Classroom',
        locationId: 'lab-room-212',
        image: '/panoramas/classroom.jpg',
        coordinates: { x: 47, y: 10 },
        links: [
          { to: 'hallway', yaw: 50 },
          { to: 'innovation-lab', yaw: 235 },
        ],
        
  hotspots: [
    {
      id: 'unitree-robotic-dog',
      title: 'Unitree Robotic Dog',
      description:
        'The Unitree Robotic Dog is a quadruped robot used in the lab for various tasks and demonstrations.',
      yaw: 490,
      pitch: 340,
      videoUrl: '/thumbnails/unitreeRoboticDog.MOV',
    },
  ],
      },
      {
        id: 'innovation-lab',
        name: 'Innovation Lab',
        locationId: 'lab-room-212',
        image: '/panoramas/innovation-lab.jpg',
        coordinates: { x: 40, y: 10 },
        links: [
          { to: 'classroom', yaw: 330 },
          { to: 'courtyard', yaw: 20 },
        ],
        hotspots: [
    {
      id: 'pentaMachine',
      title: 'Penta CNC V2-10 Machine',
      description:
        'A precision CNC machine that runs on 5 axes used in the lab for various tasks and demonstrations. These machines can cut on wood, durin, and hard wax materials.',
      yaw: 530,
      pitch: 355,
      image: '/thumbnails/pentaCNC.gif',
    },
  ],
      },
      {
        id: 'courtyard',
        name: 'Central Courtyard',
        locationId: 'lab-room-212',
        image: '/panoramas/courtyard.jpg',
        coordinates: { x: 47, y: 17 },
        links: [
          { to: 'innovation-lab', yaw: 217 },
          { to: 'lobby', yaw: 0 },
        ],
        hotspots: [
    {
      id: 'cobots',
      title: 'Cobots',
      description:
        'Collaborative robots used in the lab for various tasks and demonstrations.',
      yaw: 240,
      pitch: 355,
      image: '',
    },
    
    {
      id: 'humanoid',
      title: 'Humanoid Robot',
      description:
        'A humanoid robot used in the lab for various tasks and demonstrations.',
      yaw: 280,
      pitch: 355,
      image: '',
    },
  ],
  
      },
    ],
  },
}
