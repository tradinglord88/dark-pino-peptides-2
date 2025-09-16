'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CartModal } from '@/components/cart/cart-modal'
import { ProductCard } from '@/components/products/product-card'
import { useCartStore } from '@/stores/cart-store'

const hormoneProducts = [
  {
    id: 'CD50',
    name: 'Clomiphene (Clomid)',
    description: '50mg, 100 tablets - 克罗米芬',
    price: 89.99,
    image: '/images/products/hormone/clomiphene.jpg',
    category: 'Hormone'
  },
  {
    id: 'LZ25',
    name: 'Letrozole',
    description: '2.5mg, 100 tablets - 来曲唑',
    price: 79.99,
    image: '/images/products/hormone/letrozole.jpg',
    category: 'Hormone'
  },
  {
    id: '325',
    name: 'T3 (Liothyronine sodium)',
    description: '25mcg, 100 tablets - 三碘甲状腺氨酸钠',
    price: 69.99,
    image: '/images/products/hormone/t3-25.jpg',
    category: 'Hormone'
  },
  {
    id: '340',
    name: 'T3 (Liothyronine sodium)',
    description: '40mcg, 100 tablets - 三碘甲状腺氨酸钠',
    price: 74.99,
    image: '/images/products/hormone/t3-40.jpg',
    category: 'Hormone'
  },
  {
    id: '440',
    name: 'T4',
    description: '40mcg, 100 tablets',
    price: 72.99,
    image: '/images/products/hormone/t4.jpg',
    category: 'Hormone'
  },
  {
    id: 'T20',
    name: 'Tamoxifen (Nolvadex)',
    description: '20mg, 100 tablets - 他莫酱芬',
    price: 84.99,
    image: '/images/products/hormone/tamoxifen.jpg',
    category: 'Hormone'
  },
  {
    id: 'XE25',
    name: 'Aromasin (Exemestane)',
    description: '25mg, 100 tablets - 依西美坦',
    price: 94.99,
    image: '/images/products/hormone/aromasin.jpg',
    category: 'Hormone'
  },
  {
    id: 'DEX1',
    name: 'Anastrozole (ARIMIDEX)',
    description: '1mg, 100 tablets - 闷那曲唑',
    price: 89.99,
    image: '/images/products/hormone/anastrozole.jpg',
    category: 'Hormone'
  },
  {
    id: 'SD100',
    name: 'Sildenafil',
    description: '100mg, 100 tablets - 伟哥',
    price: 59.99,
    image: '/images/products/hormone/sildenafil.jpg',
    category: 'Hormone'
  },
  {
    id: 'DT20',
    name: 'Tadalafil',
    description: '20mg, 100 tablets - 西力士',
    price: 64.99,
    image: '/images/products/hormone/tadalafil.jpg',
    category: 'Hormone'
  },
  {
    id: 'B70',
    name: 'COCK BOMBS',
    description: '70mg, 100 tablets',
    price: 79.99,
    image: '/images/products/hormone/cock-bombs.jpg',
    category: 'Hormone'
  },
  {
    id: 'T500',
    name: 'Tesofensine',
    description: '500mcg (0.5mg), 100 tablets/bottle',
    price: 149.99,
    image: '/images/products/hormone/tesofensine.jpg',
    category: 'Hormone'
  },
  {
    id: 'L40',
    name: 'LGD-4033 (Ligandrol)',
    description: '10mg, 100 tablets',
    price: 119.99,
    image: '/images/products/hormone/lgd-4033.jpg',
    category: 'SARM'
  },
  {
    id: 'M6',
    name: 'MK-677 (Ibutamoren)',
    description: '10mg, 100 tablets',
    price: 129.99,
    image: '/images/products/hormone/mk-677.jpg',
    category: 'SARM'
  },
  {
    id: 'S9',
    name: 'SR9009',
    description: '10mg, 100 tablets',
    price: 109.99,
    image: '/images/products/hormone/sr9009.jpg',
    category: 'SARM'
  },
  {
    id: 'R14',
    name: 'RAD140',
    description: '10mg, 100 tablets',
    price: 134.99,
    image: '/images/products/hormone/rad140.jpg',
    category: 'SARM'
  },
  {
    id: 'M28',
    name: 'Ostarine (MK-2866)',
    description: '25mg, 100 tablets',
    price: 99.99,
    image: '/images/products/hormone/ostarine.jpg',
    category: 'SARM'
  },
  {
    id: 'A10',
    name: 'AICAR',
    description: '10mg, 100 tablets',
    price: 159.99,
    image: '/images/products/hormone/aicar.jpg',
    category: 'Research'
  },
  {
    id: 'S040',
    name: 'Andarine S4',
    description: '25mg, 100 tablets',
    price: 104.99,
    image: '/images/products/hormone/andarine.jpg',
    category: 'SARM'
  },
  {
    id: 'G50',
    name: 'GW-501516 (Cardarine)',
    description: '10mg, 100 tablets',
    price: 114.99,
    image: '/images/products/hormone/cardarine.jpg',
    category: 'Research'
  },
  {
    id: 'Y1',
    name: 'YK11',
    description: '10mg, 100 tablets',
    price: 139.99,
    image: '/images/products/hormone/yk11.jpg',
    category: 'SARM'
  },
  {
    id: 'CG25',
    name: 'Cabergoline',
    description: '0.25mg, 100 tablets',
    price: 94.99,
    image: '/images/products/hormone/cabergoline.jpg',
    category: 'Hormone'
  },
  {
    id: 'FS5',
    name: 'Finasteride',
    description: '5mg, 100 tablets',
    price: 54.99,
    image: '/images/products/hormone/finasteride.jpg',
    category: 'Hormone'
  },
  {
    id: 'FB100',
    name: 'Flibanserin',
    description: '100mg, 30 tablets',
    price: 89.99,
    image: '/images/products/hormone/flibanserin.jpg',
    category: 'Hormone'
  },
  {
    id: 'M1T10',
    name: '17a-Methyl-1-testosterone M1T',
    description: '10mg, 100 tablets',
    price: 124.99,
    image: '/images/products/hormone/m1t.jpg',
    category: 'Hormone'
  },
  {
    id: 'PDN10',
    name: 'Prednisone',
    description: '10mg, 100 tablets',
    price: 39.99,
    image: '/images/products/hormone/prednisone.jpg',
    category: 'Hormone'
  },
  {
    id: 'PND',
    name: 'DNP',
    description: '200mg, 50 capsules',
    price: 79.99,
    image: '/images/products/hormone/dnp.jpg',
    category: 'Research'
  }
]

const categories = ['All', 'Hormone', 'SARM', 'Research']

export default function HormonePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { isCartOpen } = useCartStore()

  const filteredProducts = selectedCategory === 'All' 
    ? hormoneProducts 
    : hormoneProducts.filter(product => product.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Laboratory Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/laboratory.jpg"
          alt="Research Laboratory"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Hormone & Performance Products
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Professional-grade hormonal compounds and performance enhancers for advanced research applications
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
          <div className="bg-black/50 backdrop-blur-lg rounded-lg p-8 max-w-4xl mx-auto">
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

      {/* Cart Modal */}
      {isCartOpen && <CartModal />}
    </div>
  )
}