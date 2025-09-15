import { ProductGrid } from '@/components/shop/product-grid'
import Image from 'next/image'
import Link from 'next/link'

export default function PeptidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e]">
      {/* Hero Section */}
      <div className="relative min-h-[400px] overflow-hidden">
        {/* Molecular pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="molecules" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="#ffd700" opacity="0.3"/>
                <circle cx="80" cy="40" r="1.5" fill="#00ffff" opacity="0.2"/>
                <circle cx="50" cy="70" r="1" fill="#ff6600" opacity="0.4"/>
                <circle cx="30" cy="90" r="1.5" fill="#ffd700" opacity="0.2"/>
                <line x1="20" y1="20" x2="50" y2="70" stroke="#ffd700" strokeWidth="0.5" opacity="0.3"/>
                <line x1="50" y1="70" x2="80" y2="40" stroke="#00ffff" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#molecules)"/>
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
        <div className="relative z-10 container mx-auto px-4 py-16 flex items-center justify-center min-h-[400px]">
          <div className="text-center text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-yellow-400">
              Research Peptides
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6">
              For Sale
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Premium quality research peptides for advanced scientific research. 
              Each compound is HPLC tested for purity and potency.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Shop All Peptides
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
              Categories ▼
            </button>
            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
              On Sale
            </button>
            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
              In Stock
            </button>
          </div>

          <ProductGrid category="peptides" />
        </div>
      </div>
    </div>
  )
}