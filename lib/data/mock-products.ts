export interface ProductData {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_tags: string[]
  spec_tags: string[]
  badge?: 'Best Seller' | 'Premium' | 'Trending' | 'New'
  purity: string
  dosage: string
  stock: number
}

export const mockProducts: ProductData[] = [
  {
    id: '1',
    name: 'BPC-157',
    description:
      'Body Protection Compound - Promotes healing of muscles, tendons, and ligaments. Supports gut health and reduces inflammation.',
    price: 89.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Tissue Repair', 'Gut Health'],
    spec_tags: ['5mg', '99.9% Pure'],
    badge: 'Best Seller',
    purity: '99.9% Pure',
    dosage: '5mg',
    stock: 50,
  },
  {
    id: '2',
    name: 'TB-500',
    description:
      'Thymosin Beta-4 - Accelerates wound healing, reduces inflammation, and improves flexibility. Supports cardiovascular health.',
    price: 94.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Recovery', 'Flexibility'],
    spec_tags: ['5mg', '99.5% Pure'],
    purity: '99.5% Pure',
    dosage: '5mg',
    stock: 35,
  },
  {
    id: '3',
    name: 'GHK-Cu',
    description:
      'Copper Peptide - Powerful anti-aging properties, stimulates collagen production, improves skin elasticity and hair growth.',
    price: 129.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Anti-Aging', 'Skin Health'],
    spec_tags: ['50mg', '99.1% Pure'],
    badge: 'Premium',
    purity: '99.1% Pure',
    dosage: '50mg',
    stock: 25,
  },
  {
    id: '4',
    name: 'Semaglutide',
    description:
      'GLP-1 Agonist - Supports weight management, improves blood sugar control, reduces appetite and cardiovascular risk.',
    price: 299.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Weight Loss', 'Metabolic'],
    spec_tags: ['3mg', '99.8% Pure'],
    badge: 'Trending',
    purity: '99.8% Pure',
    dosage: '3mg',
    stock: 15,
  },
  {
    id: '5',
    name: 'Tirzepatide',
    description:
      'Dual GIP/GLP-1 Agonist - Advanced metabolic support, significant weight reduction, improved insulin sensitivity.',
    price: 349.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Weight Loss', 'Diabetes'],
    spec_tags: ['5mg', '99.7% Pure'],
    badge: 'New',
    purity: '99.7% Pure',
    dosage: '5mg',
    stock: 10,
  },
  {
    id: '6',
    name: 'CJC-1295',
    description:
      'Growth Hormone Releasing Hormone - Increases growth hormone production, improves sleep quality, enhances fat loss.',
    price: 69.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['GH Release', 'Sleep'],
    spec_tags: ['2mg', '99.6% Pure'],
    purity: '99.6% Pure',
    dosage: '2mg',
    stock: 30,
  },
  {
    id: '7',
    name: 'Ipamorelin',
    description:
      'Selective GH Secretagogue - Stimulates natural growth hormone release, improves bone density, enhances recovery.',
    price: 59.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['GH Release', 'Recovery'],
    spec_tags: ['5mg', '99.5% Pure'],
    purity: '99.5% Pure',
    dosage: '5mg',
    stock: 40,
  },
  {
    id: '8',
    name: 'Melanotan II',
    description:
      'Melanocortin Agonist - Promotes skin tanning, may support libido, potential appetite suppression.',
    price: 49.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Tanning', 'Libido'],
    spec_tags: ['10mg', '99.3% Pure'],
    purity: '99.3% Pure',
    dosage: '10mg',
    stock: 35,
  },
  {
    id: '9',
    name: 'PT-141',
    description:
      'Bremelanotide - Enhances libido and sexual function, works through nervous system rather than vascular system.',
    price: 69.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Libido', 'Sexual Health'],
    spec_tags: ['10mg', '99.4% Pure'],
    purity: '99.4% Pure',
    dosage: '10mg',
    stock: 25,
  },
  {
    id: '10',
    name: 'Selank',
    description:
      'Anxiolytic Peptide - Reduces anxiety and stress, improves cognitive function, enhances immune system.',
    price: 84.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Anti-Anxiety', 'Cognitive'],
    spec_tags: ['10mg', '99.4% Pure'],
    purity: '99.4% Pure',
    dosage: '10mg',
    stock: 20,
  },
  {
    id: '11',
    name: 'Semax',
    description:
      'Nootropic Peptide - Enhances cognitive performance, improves memory and focus, neuroprotective properties.',
    price: 99.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Nootropic', 'Focus'],
    spec_tags: ['30mg', '99.5% Pure'],
    purity: '99.5% Pure',
    dosage: '30mg',
    stock: 15,
  },
  {
    id: '12',
    name: 'DSIP',
    description:
      'Delta Sleep-Inducing Peptide - Promotes deep restorative sleep, reduces stress, normalizes blood pressure.',
    price: 54.99,
    image_url: '/images/products/peptide.png',
    category_tags: ['Sleep', 'Stress Relief'],
    spec_tags: ['5mg', '99.2% Pure'],
    purity: '99.2% Pure',
    dosage: '5mg',
    stock: 25,
  },
  {
    id: '13',
    name: 'Bacteriostatic Water 10ml',
    description:
      'Medical grade sterile water with 0.9% benzyl alcohol preservative. Essential for peptide reconstitution.',
    price: 14.99,
    image_url: '/images/products/bacteriostatic-water.avif',
    category_tags: ['Supplies', 'Reconstitution'],
    spec_tags: ['10ml', '0.9% BA'],
    badge: 'New',
    purity: 'USP Grade',
    dosage: '10ml',
    stock: 50,
  },
  {
    id: '14',
    name: 'Bacteriostatic Water 30ml',
    description:
      'Our most popular size. Perfect for multiple reconstitutions. Maintains sterility for extended use.',
    price: 24.99,
    image_url: '/images/products/bacteriostatic-water.avif',
    category_tags: ['Supplies', 'Reconstitution'],
    spec_tags: ['30ml', '0.9% BA'],
    badge: 'Best Seller',
    purity: 'USP Grade',
    dosage: '30ml',
    stock: 100,
  },
  {
    id: '15',
    name: 'Bacteriostatic Water 100ml',
    description:
      'Maximum value for research facilities and frequent users. Long-lasting supply with optimal preservation.',
    price: 49.99,
    image_url: '/images/products/bacteriostatic-water.avif',
    category_tags: ['Supplies', 'Reconstitution'],
    spec_tags: ['100ml', '0.9% BA'],
    badge: 'Premium',
    purity: 'USP Grade',
    dosage: '100ml',
    stock: 25,
  },
  {
    id: '16',
    name: 'CU-GLOW Copper Peptide Face Cream',
    description:
      'Advanced anti-aging face cream infused with GHK-Cu copper peptides. Stimulates collagen production, reduces fine lines, and promotes skin regeneration.',
    price: 89.99,
    image_url: '/images/products/cu-glow-face-cream.png',
    category_tags: ['Skincare', 'Anti-Aging'],
    spec_tags: ['60ml', 'GHK-Cu'],
    badge: 'Premium',
    purity: 'Cosmetic Grade',
    dosage: '60ml',
    stock: 30,
  },
  {
    id: 'test-001',
    name: 'Test Peptide - Stripe Integration',
    description:
      'Test product for Stripe payment integration. This is a dummy product for payment testing purposes only.',
    price: 2.00,
    image_url: '/images/products/peptide.png',
    category_tags: ['Test'],
    spec_tags: ['1mg', 'Test Grade'],
    badge: 'New',
    purity: 'Test Grade',
    dosage: '1mg',
    stock: 999,
  },
]
