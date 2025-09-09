import { ProductCard } from './product-card'
import { mockProducts, ProductData } from '@/lib/data/mock-products'

interface ProductGridProps {
  category?: 'all' | 'peptides' | 'bacteriostatic-water' | 'skincare'
}

export function ProductGrid({ category = 'all' }: ProductGridProps) {
  const filteredProducts = mockProducts.filter((product: ProductData) => {
    if (category === 'all') return true
    if (category === 'peptides') {
      return !product.name.toLowerCase().includes('bacteriostatic water') && 
             !product.category_tags.includes('Skincare') &&
             !product.category_tags.includes('Test')
    }
    if (category === 'bacteriostatic-water') {
      return product.name.toLowerCase().includes('bacteriostatic water')
    }
    if (category === 'skincare') {
      return product.category_tags.includes('Skincare')
    }
    return true
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
