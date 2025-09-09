import Link from 'next/link'
import Image from 'next/image'
import { Clouds } from '@/components/ui/clouds'

export default function HomePage() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* DNA Background - CSS fallback with option for custom image */}
      <div className="absolute inset-0">
        {/* Fallback gradient background inspired by DNA visualization */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-teal-900 to-cyan-950">
          {/* Overlay pattern for DNA-like texture */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-purple-500/20" />
            <div className="absolute inset-0 bg-gradient-to-bl from-teal-500/15 via-transparent to-blue-500/15" />
          </div>
        </div>
        
        {/* Custom background image (when dna-background.png exists) */}
        <div className="absolute inset-0 opacity-80" id="custom-bg">
          <Image
            src="/images/dna-background.png"
            alt="DNA Background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      </div>


      {/* Hero Content */}
      <div className="relative z-20 min-h-screen flex flex-col justify-center items-center px-4 py-8">
        {/* Mascot above title */}
        <div className="text-center mb-4 sm:mb-6 animate-fade-in-up">
          <div className="animate-float">
            <Image
              src="/images/mascots/dark-pino-mascot.png"
              alt="Dark Pino Mascot"
              width={150}
              height={150}
              className="drop-shadow-2xl mx-auto sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px]"
              priority
            />
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in-up animation-delay-200">
          <h1 className="hero-title text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-permanent-marker mb-2 tracking-wider leading-tight">
            <span className="text-3d-yellow">
              DARK PINO
            </span>
          </h1>
          <h2 className="hero-subtitle text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold tracking-widest text-white/90 drop-shadow-lg">
            PEPTIDES
          </h2>
        </div>

        {/* Subtitle */}
        <div className="mb-6 sm:mb-8 animate-fade-in-up animation-delay-400">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl bg-white bg-opacity-100 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-center max-w-xs sm:max-w-lg md:max-w-2xl mx-auto font-medium shadow-lg border border-gray-200">
            Premium research compounds for advanced scientific exploration
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 animate-fade-in-up animation-delay-600 justify-center items-center">
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25 text-center min-w-[160px]"
          >
            Explore Products
          </Link>
          <button className="w-full sm:w-auto px-8 py-3 sm:px-10 sm:py-4 border-2 border-white/30 hover:border-white/50 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:bg-white/10 min-w-[160px]">
            Learn More
          </button>
        </div>
      </div>

      {/* Clouds at bottom */}
      <Clouds />
    </div>
  )
}
