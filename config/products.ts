export const productCategories = [
  'Tissue Repair',
  'Anti-Aging',
  'Cognitive Enhancement',
  'Growth Factors',
  'Recovery',
] as const

export const productTags = [
  'Popular',
  'New',
  'Research',
  'Premium',
  'Limited',
] as const

export type ProductCategory = (typeof productCategories)[number]
export type ProductTag = (typeof productTags)[number]