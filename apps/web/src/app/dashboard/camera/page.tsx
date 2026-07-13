'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { useSocket } from '../../../hooks/useSocket';

export default function CameraPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    
    socket.on('camera:frame', (data) => {
      // Logic to draw JPEG buffer to canvas
      setIsConnected(true);
      if (ctx && data.buffer) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
        };
        img.src = `data:image/jpeg;base64,${data.buffer}`;
      }
    });

    return () => {
      socket.off('camera:frame');
    };
  }, [socket]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">CCTV Camera Station</h1>
      <Card>
        <CardContent className="flex flex-col items-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black border border-gray-700 rounded overflow-hidden">
            <canvas ref={canvasRef} width={800} height={450} className="w-full h-full object-cover" />
            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center text-red-500 font-mono">
                NO SIGNAL
              </div>
            )}
          </div>
          <div className="mt-6 flex space-x-4">
            <div className="text-gray-400 text-sm">Use WASD to pan, SPACE to fire turret</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
