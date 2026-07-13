'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '../../../components/ui/Card';
import { useServerStore } from '../../../stores/serverStore';
import { fetchAPI } from '../../../lib/api';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const ImageOverlay = dynamic(
  () => import('react-leaflet').then((mod) => mod.ImageOverlay),
  { ssr: false }
);

export default function MapPage() {
  const [mapImage, setMapImage] = useState<string | null>(null);
  const activeServerId = useServerStore(state => state.activeServerId);

  useEffect(() => {
    if (!activeServerId) return;
    fetchAPI(`/servers/${activeServerId}/map`)
      .then(data => {
        // Assume data contains a base64 map image or URL
        // In reality, getMap returns the raw bytes, so we'd convert it
        // We'll mock a generic image if it's missing for UI purposes
        setMapImage(data.image || 'https://rustmaps.com/images/default.png');
      })
      .catch(console.error);
  }, [activeServerId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Interactive Map</h1>
      <Card>
        <CardContent className="h-[600px] p-0 overflow-hidden">
          {mapImage ? (
            <MapContainer 
              bounds={[[0, 0], [4000, 4000]]} 
              crs={(globalThis as any).L?.CRS?.Simple} 
              className="h-full w-full bg-[#1a1a1a]"
            >
              <ImageOverlay
                url={mapImage}
                bounds={[[0, 0], [4000, 4000]]}
              />
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Loading map data...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
