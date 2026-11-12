# Barrett Project – Building Map & 360° Virtual Tour

An interactive building map and virtual tour interface that allows users to explore a building's floor plan, select locations, and navigate connected 360° panoramic views.

## Features

- **Interactive floor plan:** View a building map with clickable location pins.
- **Location details:** Display descriptions and media associated with map locations.
- **360° virtual tour:** Navigate between panoramic scenes using interactive arrows.
- **Room organization:** Group multiple panoramic views under a single building location.
- **Interactive hotspots:** Select objects within panoramic scenes to view descriptions and images or videos.
- **Configurable building data:** Customize locations, coordinates, panorama scenes, navigation links, and hotspots through the building data configuration.

## Technology

- Next.js
- React
- TypeScript
- Photo Sphere Viewer
- Tailwind CSS

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/suddin13/BarrettProject.git
   ```

2. Navigate to the frontend project:

   ```bash
   cd BarrettProject/RAS101/building-map-interface1
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Configuration

Building locations, map coordinates, panorama scenes, navigation arrows, and hotspots are configured in:

`lib/building-data.ts`

Panorama images and other media are stored in the project's `public` directory.

## Contributing

Fork the repository, create a branch for your changes, and submit a pull request when your work is ready for review.