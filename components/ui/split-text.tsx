'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number // Delay between letters/words in ms
  duration?: number // Duration of each animation in seconds
  ease?: string // Easing function
  splitType?: 'chars' | 'words' | 'lines'
  from?: {
    opacity?: number
    y?: number
    x?: number
    scale?: number
    rotate?: number
  }
  to?: {
    opacity?: number
    y?: number
    x?: number
    scale?: number
    rotate?: number
  }
  threshold?: number // Intersection observer threshold
  rootMargin?: string // Intersection observer root margin
  textAlign?: 'left' | 'center' | 'right'
  onLetterAnimationComplete?: () => void
  triggerOnce?: boolean // Only animate once
  autoStart?: boolean // Start animation immediately without intersection observer
}

export default function SplitText({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'easeOut',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete,
  triggerOnce = true,
  autoStart = false
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(autoStart)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Split text based on splitType
  const splitText = () => {
    switch (splitType) {
      case 'words':
        return text.split(' ').map((word, index) => ({ content: word, index, isSpace: false }))
      case 'lines':
        return text.split('\n').map((line, index) => ({ content: line, index, isSpace: false }))
      case 'chars':
      default:
        return text.split('').map((char, index) => ({ 
          content: char, 
          index, 
          isSpace: char === ' ' 
        }))
    }
  }

  const textSegments = splitText()

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    if (autoStart) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
          setIsVisible(true)
          if (triggerOnce) {
            setHasAnimated(true)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [threshold, rootMargin, triggerOnce, hasAnimated, autoStart])

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay / 1000, // Convert ms to seconds
      }
    }
  }

  const itemVariants = {
    hidden: from,
    visible: {
      ...to,
      transition: {
        duration,
        ease: ease === 'power3.out' ? [0.215, 0.61, 0.355, 1] : ease,
      }
    }
  }

  // Handle animation complete
  const handleAnimationComplete = () => {
    if (onLetterAnimationComplete) {
      onLetterAnimationComplete()
    }
  }

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center', 
    right: 'text-right'
  }[textAlign]

  return (
    <div ref={containerRef} className={`${alignmentClass} ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="inline-block"
        onAnimationComplete={handleAnimationComplete}
      >
        {textSegments.map((segment, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className={`inline-block ${segment.isSpace ? 'w-2' : ''}`}
            style={{
              whiteSpace: segment.isSpace ? 'pre' : 'normal'
            }}
          >
            {segment.isSpace ? '\u00A0' : segment.content}
            {splitType === 'words' && index < textSegments.length - 1 && '\u00A0'}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}