'use client'

import { motion } from 'framer-motion'

export function Clouds() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
      {/* Cloud layer 1 - back */}
      <motion.div
        className="absolute bottom-0 left-0 w-[120%] h-24 bg-gradient-to-t from-white/10 to-transparent rounded-t-full blur-sm"
        animate={{
          x: ['0%', '-10%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />
      
      {/* Cloud layer 2 - middle */}
      <motion.div
        className="absolute bottom-0 left-[10%] w-[110%] h-20 bg-gradient-to-t from-white/15 to-transparent rounded-t-full blur-sm"
        animate={{
          x: ['0%', '8%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />
      
      {/* Cloud layer 3 - front */}
      <motion.div
        className="absolute bottom-0 left-[5%] w-[130%] h-28 bg-gradient-to-t from-white/20 to-transparent rounded-t-full"
        animate={{
          x: ['0%', '-5%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />
    </div>
  )
}