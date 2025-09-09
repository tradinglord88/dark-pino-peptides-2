'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { DNAHelix } from './dna-helix'

export function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        className="w-full h-full"
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance" 
        }}
      >
        <Suspense fallback={null}>
          {/* Enhanced Scientific Lighting */}
          <ambientLight intensity={0.3} color="#4f46e5" />
          <directionalLight position={[10, 10, 5]} intensity={0.6} color="#06b6d4" />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#06b6d4" />
          <pointLight position={[-5, -5, -5]} intensity={0.4} color="#a855f7" />
          <pointLight position={[0, 8, 0]} intensity={0.3} color="#10b981" />
          <pointLight position={[0, -8, 0]} intensity={0.3} color="#f59e0b" />
          
          {/* DNA Helix */}
          <DNAHelix />
          
          {/* Camera controls - gentle scientific observation */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 2.9}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}