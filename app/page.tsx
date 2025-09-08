import Link from 'next/link'
import Image from 'next/image'
import { HeroScene } from '@/components/3d/hero-scene'
import { Clouds } from '@/components/ui/clouds'

export default function HomePage() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Space Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black">
        {/* Stars background effect */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 3D DNA Helix Scene */}
      <div className="absolute inset-0 z-10">
        <HeroScene />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 min-h-screen flex flex-col justify-center items-center px-4">
        {/* Mascot above title */}
        <div className="text-center mb-4 animate-fade-in-up">
          <div className="animate-float">
            <Image
              src="/images/mascots/dark-pino-mascot.png"
              alt="Dark Pino Mascot"
              width={200}
              height={200}
              className="drop-shadow-2xl mx-auto"
              priority
            />
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8 animate-fade-in-up animation-delay-200">
          <h1 className="hero-title text-6xl sm:text-8xl md:text-9xl font-permanent-marker mb-2 tracking-wider">
            <span className="text-3d-yellow">
              DARK PINO
            </span>
          </h1>
          <h2 className="hero-subtitle text-2xl sm:text-4xl md:text-5xl font-bold tracking-widest text-white/90 drop-shadow-lg">
            PEPTIDES
          </h2>
        </div>

        {/* Subtitle */}
        <div className="mb-8 animate-fade-in-up animation-delay-400">
          <p className="text-lg md:text-xl bg-white bg-opacity-100 text-black px-6 py-3 rounded-lg text-center max-w-2xl mx-auto font-medium shadow-lg border border-gray-200">
            Premium research compounds for advanced scientific exploration
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in-up animation-delay-600">
          <Link
            href="/products"
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25 text-center"
          >
            Explore Products
          </Link>
          <button className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-white/30 hover:border-white/50 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:bg-white/10">
            Learn More
          </button>
        </div>
      </div>

      {/* Clouds at bottom */}
      <Clouds />
    </div>
  )
}
