import { ProductGrid } from '@/components/shop/product-grid'

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e]">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Premium Research Peptides
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our curated selection of high-quality research peptides,
            each rigorously tested for purity and potency.
          </p>
        </div>

        <ProductGrid />
      </div>
    </div>
  )
}
