'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/shop/product-card'

const hormoneProducts = [
  {
    id: 'CD50',
    name: 'Clomiphene (Clomid)',
    description: '50mg, 100 tablets',
    price: 89.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'PCT'],
    spec_tags: ['50mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '50mg',
    stock: 50,
    badge: 'Best Seller' as const
  },
  {
    id: 'LZ25',
    name: 'Letrozole',
    description: '2.5mg, 100 tablets',
    price: 79.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'AI'],
    spec_tags: ['2.5mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '2.5mg',
    stock: 50
  },
  {
    id: '325',
    name: 'T3 (Liothyronine sodium)',
    description: '25mcg, 100 tablets',
    price: 69.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'Thyroid'],
    spec_tags: ['25mcg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '25mcg',
    stock: 50
  },
  {
    id: '340',
    name: 'T3 (Liothyronine sodium)',
    description: '40mcg, 100 tablets',
    price: 74.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'Thyroid'],
    spec_tags: ['40mcg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '40mcg',
    stock: 50
  },
  {
    id: '440',
    name: 'T4',
    description: '40mcg, 100 tablets',
    price: 72.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'Thyroid'],
    spec_tags: ['40mcg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '40mcg',
    stock: 50
  },
  {
    id: 'T20',
    name: 'Tamoxifen (Nolvadex)',
    description: '20mg, 100 tablets',
    price: 84.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'PCT'],
    spec_tags: ['20mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '20mg',
    stock: 50
  },
  {
    id: 'XE25',
    name: 'Aromasin (Exemestane)',
    description: '25mg, 100 tablets',
    price: 94.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'AI'],
    spec_tags: ['25mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '25mg',
    stock: 50
  },
  {
    id: 'DEX1',
    name: 'Anastrozole (ARIMIDEX)',
    description: '1mg, 100 tablets',
    price: 89.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'AI'],
    spec_tags: ['1mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '1mg',
    stock: 50
  },
  {
    id: 'SD100',
    name: 'Sildenafil',
    description: '100mg, 100 tablets',
    price: 59.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'ED'],
    spec_tags: ['100mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '100mg',
    stock: 50
  },
  {
    id: 'DT20',
    name: 'Tadalafil',
    description: '20mg, 100 tablets',
    price: 64.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'ED'],
    spec_tags: ['20mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '20mg',
    stock: 50
  },
  {
    id: 'B70',
    name: 'COCK BOMBS',
    description: '70mg, 100 tablets',
    price: 79.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'Performance'],
    spec_tags: ['70mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '70mg',
    stock: 50,
    badge: 'Premium' as const
  },
  {
    id: 'T500',
    name: 'Tesofensine',
    description: '500mcg (0.5mg), 100 tablets/bottle',
    price: 149.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'Weight Loss'],
    spec_tags: ['500mcg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '500mcg',
    stock: 50
  },
  {
    id: 'L40',
    name: 'LGD-4033 (Ligandrol)',
    description: '10mg, 100 tablets',
    price: 119.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['SARM', 'Muscle Building'],
    spec_tags: ['10mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '10mg',
    stock: 50,
    badge: 'Trending' as const
  },
  {
    id: 'M6',
    name: 'MK-677 (Ibutamoren)',
    description: '10mg, 100 tablets',
    price: 129.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['SARM', 'GH Secretagogue'],
    spec_tags: ['10mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '10mg',
    stock: 50
  },
  {
    id: 'S9',
    name: 'SR9009',
    description: '10mg, 100 tablets',
    price: 109.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['SARM', 'Endurance'],
    spec_tags: ['10mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '10mg',
    stock: 50
  },
  {
    id: 'R14',
    name: 'RAD140',
    description: '10mg, 100 tablets',
    price: 134.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['SARM', 'Strength'],
    spec_tags: ['10mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '10mg',
    stock: 50
  },
  {
    id: 'M28',
    name: 'Ostarine (MK-2866)',
    description: '25mg, 100 tablets',
    price: 99.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['SARM', 'Lean Mass'],
    spec_tags: ['25mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '25mg',
    stock: 50
  },
  {
    id: 'A10',
    name: 'AICAR',
    description: '10mg, 100 tablets',
    price: 159.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Research', 'Endurance'],
    spec_tags: ['10mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '10mg',
    stock: 50
  },
  {
    id: 'S040',
    name: 'Andarine S4',
    description: '25mg, 100 tablets',
    price: 104.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['SARM', 'Cutting'],
    spec_tags: ['25mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '25mg',
    stock: 50
  },
  {
    id: 'G50',
    name: 'GW-501516 (Cardarine)',
    description: '10mg, 100 tablets',
    price: 114.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Research', 'Fat Loss'],
    spec_tags: ['10mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '10mg',
    stock: 50
  },
  {
    id: 'Y1',
    name: 'YK11',
    description: '10mg, 100 tablets',
    price: 139.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['SARM', 'Myostatin Inhibitor'],
    spec_tags: ['10mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '10mg',
    stock: 50
  },
  {
    id: 'CG25',
    name: 'Cabergoline',
    description: '0.25mg, 100 tablets',
    price: 94.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'Prolactin Control'],
    spec_tags: ['0.25mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '0.25mg',
    stock: 50
  },
  {
    id: 'FS5',
    name: 'Finasteride',
    description: '5mg, 100 tablets',
    price: 54.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'Hair Loss'],
    spec_tags: ['5mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '5mg',
    stock: 50
  },
  {
    id: 'FB100',
    name: 'Flibanserin',
    description: '100mg, 30 tablets',
    price: 89.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'Female Enhancement'],
    spec_tags: ['100mg', '30 tablets'],
    purity: '99.9% Pure',
    dosage: '100mg',
    stock: 50
  },
  {
    id: 'M1T10',
    name: '17a-Methyl-1-testosterone M1T',
    description: '10mg, 100 tablets',
    price: 124.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'Anabolic'],
    spec_tags: ['10mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '10mg',
    stock: 50
  },
  {
    id: 'PDN10',
    name: 'Prednisone',
    description: '10mg, 100 tablets',
    price: 39.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Hormone', 'Anti-inflammatory'],
    spec_tags: ['10mg', '100 tablets'],
    purity: '99.9% Pure',
    dosage: '10mg',
    stock: 50
  },
  {
    id: 'PND',
    name: 'DNP',
    description: '200mg, 50 capsules',
    price: 79.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Research', 'Fat Loss'],
    spec_tags: ['200mg', '50 capsules'],
    purity: '99.9% Pure',
    dosage: '200mg',
    stock: 50
  }
]

const categories = ['All', 'Hormone', 'SARM', 'Research']

export default function HormonePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProducts = selectedCategory === 'All' 
    ? hormoneProducts 
    : hormoneProducts.filter(product => product.category_tags.includes(selectedCategory))

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative min-h-[500px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          {/* Fallback gradient background */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-950 via-red-900 to-purple-950">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-red-500/20" />
              <div className="absolute inset-0 bg-gradient-to-bl from-red-500/15 via-transparent to-purple-500/15" />
            </div>
          </div>

          {/* Video element */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 z-10 w-full h-full object-cover"
            style={{ objectPosition: 'center center' }}
          >
            <source src="/videos/hormone-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Molecular pattern overlay */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="molecules" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="#ffd700" opacity="0.4"/>
                <circle cx="80" cy="40" r="1.5" fill="#00ffff" opacity="0.3"/>
                <circle cx="50" cy="70" r="1" fill="#ff6600" opacity="0.5"/>
                <circle cx="30" cy="90" r="1.5" fill="#ffd700" opacity="0.3"/>
                <line x1="20" y1="20" x2="50" y2="70" stroke="#ffd700" strokeWidth="0.5" opacity="0.4"/>
                <line x1="50" y1="70" x2="80" y2="40" stroke="#00ffff" strokeWidth="0.5" opacity="0.3"/>
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
        <div className="relative z-10 container mx-auto px-4 py-16 flex items-center justify-center min-h-[500px]">
          <div className="text-center text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-yellow-400 drop-shadow-lg">
              Hormone & Performance
            </h1>
            <p className="text-lg text-gray-100 mb-8 drop-shadow-md">
              Professional-grade hormonal compounds and performance enhancers for advanced research applications.
              Each compound is certified for purity and potency.
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-[#0a0a1a] py-12">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-yellow-500 text-black'
                    : 'border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16 text-center">
            <div className="bg-black/50 backdrop-blur-lg rounded-lg p-8 max-w-4xl mx-auto border border-gray-800">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                Research & Performance Compounds
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Our hormone and performance products are intended for research purposes only. 
                All compounds are manufactured in certified facilities and undergo rigorous quality testing. 
                These products are not intended for human consumption and should only be used by qualified researchers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}