import { ProductGrid } from '@/components/shop/product-grid'
import { SubscriptionPlans } from '@/components/subscriptions/subscription-plans'

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e]">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Premium Research Peptides
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Discover our curated selection of high-quality research peptides,
            each rigorously tested for purity and potency.
          </p>
        </div>

        {/* Subscription Plans Section */}
        <div className="mb-16">
          <SubscriptionPlans />
        </div>

        {/* Individual Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-white">
            Individual Products
          </h2>
          <p className="text-center text-gray-300 mb-8">
            Purchase individual peptides without a subscription
          </p>
        </div>

        <ProductGrid />
      </div>
    </div>
  )
}
