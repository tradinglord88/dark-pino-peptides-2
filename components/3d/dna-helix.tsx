'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function DNAHelix() {
  const meshRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * -0.1
    }
  })

  // Enhanced DNA helix with base pairs
  const helixPoints = []
  const helixColors = []
  const basePairPoints = []
  const basePairColors = []
  const particleCount = 800

  for (let i = 0; i < particleCount; i++) {
    const t = (i / particleCount) * Math.PI * 10 // 5 full turns
    const radius = 1.8
    const height = 8

    // First strand (sugar-phosphate backbone)
    const x1 = Math.cos(t) * radius
    const y1 = (i / particleCount - 0.5) * height
    const z1 = Math.sin(t) * radius

    helixPoints.push(x1, y1, z1)
    helixColors.push(0.2, 0.8, 1.0) // bright cyan

    // Second strand (complementary strand)
    const x2 = Math.cos(t + Math.PI) * radius
    const y2 = (i / particleCount - 0.5) * height
    const z2 = Math.sin(t + Math.PI) * radius

    helixPoints.push(x2, y2, z2)
    helixColors.push(1.0, 0.3, 0.6) // bright magenta

    // Base pairs (connecting the strands)
    if (i % 8 === 0) { // Every 8th point
      const steps = 5
      for (let j = 1; j < steps; j++) {
        const progress = j / steps
        const bx = x1 + (x2 - x1) * progress
        const by = y1 + (y2 - y1) * progress
        const bz = z1 + (z2 - z1) * progress
        
        basePairPoints.push(bx, by, bz)
        
        // Color based on base type (A-T, G-C)
        if (i % 16 === 0) {
          basePairColors.push(1.0, 1.0, 0.2) // yellow (A-T)
        } else {
          basePairColors.push(0.2, 1.0, 0.2) // green (G-C)
        }
      }
    }
  }

  // Floating peptide molecules
  const peptidePoints = []
  const peptideColors = []
  const peptideCount = 200

  for (let i = 0; i < peptideCount; i++) {
    const angle = (i / peptideCount) * Math.PI * 2
    const radius = 4 + Math.random() * 3
    const height = (Math.random() - 0.5) * 10
    
    const x = Math.cos(angle) * radius
    const y = height
    const z = Math.sin(angle) * radius

    peptidePoints.push(x, y, z)
    
    // Different colors for different amino acids
    const colorType = Math.floor(Math.random() * 4)
    switch (colorType) {
      case 0: peptideColors.push(1.0, 0.8, 0.2); break // orange
      case 1: peptideColors.push(0.8, 0.2, 1.0); break // purple  
      case 2: peptideColors.push(0.2, 1.0, 0.8); break // teal
      case 3: peptideColors.push(1.0, 0.2, 0.4); break // red
    }
  }

  return (
    <>
      {/* Main DNA Helix */}
      <group ref={meshRef}>
        {/* Sugar-phosphate backbone */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(helixPoints), 3]}
            />
            <bufferAttribute
              attach="attributes-color"  
              args={[new Float32Array(helixColors), 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            vertexColors
            transparent
            opacity={0.9}
            sizeAttenuation={false}
          />
        </points>

        {/* Base pairs */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(basePairPoints), 3]}
            />
            <bufferAttribute
              attach="attributes-color"  
              args={[new Float32Array(basePairColors), 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            vertexColors
            transparent
            opacity={0.7}
            sizeAttenuation={false}
          />
        </points>
      </group>

      {/* Floating peptide molecules */}
      <group ref={particlesRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(peptidePoints), 3]}
            />
            <bufferAttribute
              attach="attributes-color"  
              args={[new Float32Array(peptideColors), 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.12}
            vertexColors
            transparent
            opacity={0.6}
            sizeAttenuation={true}
          />
        </points>
      </group>
    </>
  )
}