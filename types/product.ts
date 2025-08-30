export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url?: string
  tags: string[]
  stock: number
  created_at: Date
  updated_at: Date
}