import { ProductCard } from './product-card'
import { mockProducts, ProductData } from '@/lib/data/mock-products'

interface ProductGridProps {
  category?: 'all' | 'peptides' | 'bacteriostatic-water'
}

export function ProductGrid({ category = 'all' }: ProductGridProps) {
  const filteredProducts = mockProducts.filter((product: ProductData) => {
    if (category === 'all') return true
    if (category === 'peptides') {
      return !product.name.toLowerCase().includes('bacteriostatic water')
    }
    if (category === 'bacteriostatic-water') {
      return product.name.toLowerCase().includes('bacteriostatic water')
    }
    return true
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
