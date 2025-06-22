'use client'; // This component needs to be a client component

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { Suspense } from 'react';

// This is a separate component for the model itself
// It's good practice to keep the model loading logic separate
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // @ts-ignore - R3F and TS have a known issue with the primitive element
  return <primitive object={scene} />;
}

interface ModelViewerProps {
  modelUrl?: string; // The URL to the .glb or .gltf file
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
  if (!modelUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
        No 3D Model Available
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading 3D Model...</div>}>
      <Canvas dpr={[1, 2]} camera={{ fov: 45 }} style={{ width: '100%', height: '100%' }}>
        {/* Stage provides a nice default environment, ground plane, and centered model */}
        <Stage environment="city" intensity={0.6}>
          <Model url={modelUrl} />
        </Stage>
        {/* OrbitControls allow the user to rotate and zoom with the mouse */}
        <OrbitControls autoRotate />
      </Canvas>
    </Suspense>
  );
}

// Preload the model to improve performance
if (typeof window !== 'undefined') {
  useGLTF.preload('/models/character.glb');
} 