'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FeatureCards } from './feature-cards'
import { Clouds } from '@/components/ui/clouds'
import SplitText from '@/components/ui/split-text'
import ElectricBorder from '@/components/ui/electric-border'

export function HeroSection() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        {/* Fallback gradient background - positioned behind video */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950 via-teal-900 to-cyan-950">
          {/* Overlay pattern for DNA-like texture */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-purple-500/20" />
            <div className="absolute inset-0 bg-gradient-to-bl from-teal-500/15 via-transparent to-blue-500/15" />
          </div>
        </div>
        
        {/* Video element - positioned above fallback */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 z-10 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          onError={(e) => console.log('Video error:', e)}
          onLoadedData={() => console.log('Video loaded successfully')}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for text readability - positioned above video */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
      </div>


      {/* Hero Content - Positioned higher on screen */}
      <div className="relative z-20 min-h-screen flex flex-col justify-start items-center px-4 pt-8 sm:pt-16 pb-8">
        {/* Main Title - Animated with Electric Letter Effects */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <SplitText
            text="DARK PINO"
            className="text-3d-yellow hero-title text-3xl xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-permanent-marker mb-2 tracking-wider leading-tight"
            delay={150}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 100, scale: 0.6, rotate: -15 }}
            to={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            threshold={0.2}
            autoStart={true}
            onLetterAnimationComplete={() => console.log('DARK PINO animation complete!')}
          />
          
          {/* Mascot between DARK PINO and PEPTIDES */}
          <div className="text-center my-3 sm:my-4 animate-fade-in-up">
            <div className="animate-float">
              <Image
                src="/images/mascots/dark-pino-mascot.png"
                alt="Dark Pino Mascot"
                width={720}
                height={1280}
                className="drop-shadow-2xl mx-auto w-16 h-auto sm:w-20 md:w-24 lg:w-28 xl:w-32"
                priority
              />
            </div>
          </div>
          
          <SplitText
            text="RESEARCH PEPTIDES"
            className="hero-subtitle text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold tracking-widest text-white/90 drop-shadow-lg block mt-2"
            delay={80}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 50, scale: 0.8 }}
            to={{ opacity: 1, y: 0, scale: 1 }}
            threshold={0.2}
            autoStart={true}
          />
        </div>

        {/* Subtitle - Clean White Text */}
        <div className="mb-4 sm:mb-6 md:mb-8 text-center max-w-xs sm:max-w-lg md:max-w-2xl mx-auto">
          <SplitText
            text="Premium research compounds for advanced scientific exploration"
            className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-medium drop-shadow-lg"
            delay={50}
            duration={0.4}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            autoStart={true}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 animate-fade-in-up animation-delay-600 justify-center items-center">
          <Link
            href="/peptides"
            className="w-full sm:w-auto px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25 text-center min-w-[160px]"
          >
            Explore Products
          </Link>
          <button className="w-full sm:w-auto px-8 py-3 sm:px-10 sm:py-4 border-2 border-white/30 hover:border-white/50 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:bg-white/10 min-w-[160px]">
            Learn More
          </button>
        </div>
      </div>

      {/* Feature Cards Section - Moved below main content */}
      <div className="relative z-20 -mt-32 sm:-mt-48 md:-mt-64 lg:-mt-80 xl:-mt-96">
        <FeatureCards />
      </div>

      {/* Clouds at bottom - Original Dark Pino Element */}
      <Clouds />
    </div>
  )
}