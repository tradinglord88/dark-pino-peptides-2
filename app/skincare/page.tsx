import { ProductGrid } from '@/components/shop/product-grid'

export default function SkincarePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e]">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Premium Skincare
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Advanced skincare formulations featuring cutting-edge peptides and 
            research-backed ingredients for optimal skin health and appearance.
          </p>
        </div>

        <ProductGrid category="skincare" />
      </div>
    </div>
  )
}