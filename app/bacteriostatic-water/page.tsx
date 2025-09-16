import { ProductGrid } from '@/components/shop/product-grid'
import Link from 'next/link'
import Image from 'next/image'

export default function BacteriostaticWaterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e]">
      {/* Hero Section */}
      <div className="relative min-h-[500px] overflow-hidden">
        {/* Laboratory Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/laboratory.jpg"
            alt="Research Laboratory"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Molecular pattern overlay */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="molecules-bac" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="#007bff" opacity="0.4"/>
                <circle cx="80" cy="40" r="1.5" fill="#6610f2" opacity="0.3"/>
                <circle cx="50" cy="70" r="1" fill="#e83e8c" opacity="0.5"/>
                <circle cx="30" cy="90" r="1.5" fill="#007bff" opacity="0.3"/>
                <line x1="20" y1="20" x2="50" y2="70" stroke="#007bff" strokeWidth="0.5" opacity="0.4"/>
                <line x1="50" y1="70" x2="80" y2="40" stroke="#6610f2" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#molecules-bac)"/>
          </svg>
        </div>

        {/* Diagonal cut - darker shade */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0a1a]"
          style={{
            clipPath: 'polygon(0 100%, 100% 40%, 100% 100%)'
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 flex items-center justify-center min-h-[500px]">
          <div className="text-center text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
              Bacteriostatic Water
            </h1>
            <p className="text-lg text-gray-100 mb-8 drop-shadow-md">
              Essential bacteriostatic water for reconstituting and diluting research peptides.
              Available in multiple sizes to meet your research requirements.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Shop Bacteriostatic Water
            </Link>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-[#0a0a1a] py-12">
        <div className="container mx-auto px-4">
          {/* Filter options */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
              Price ▼
            </button>
            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
              Size ▼
            </button>
            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
              On Sale
            </button>
            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
              In Stock
            </button>
          </div>

          <ProductGrid category="bacteriostatic-water" />
        </div>
      </div>
    </div>
  )
}