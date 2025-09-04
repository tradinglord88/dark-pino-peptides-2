'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function DNAHelix() {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  // Create helix geometry
  const points = []
  const colors = []
  const particleCount = 1000

  for (let i = 0; i < particleCount; i++) {
    const t = (i / particleCount) * Math.PI * 8 // 4 full turns
    const radius = 1.5
    const height = 6

    // First strand
    const x1 = Math.cos(t) * radius
    const y1 = (i / particleCount - 0.5) * height
    const z1 = Math.sin(t) * radius

    points.push(x1, y1, z1)
    colors.push(0.3, 0.8, 1.0) // cyan

    // Second strand (offset by π)
    const x2 = Math.cos(t + Math.PI) * radius
    const y2 = (i / particleCount - 0.5) * height
    const z2 = Math.sin(t + Math.PI) * radius

    points.push(x2, y2, z2)
    colors.push(1.0, 1.0, 0.8) // warm white
  }

  return (
    <group ref={meshRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(points), 3]}
          />
          <bufferAttribute
            attach="attributes-color"  
            args={[new Float32Array(colors), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={false}
        />
      </points>
    </group>
  )
}