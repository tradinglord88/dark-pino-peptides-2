import { NextResponse } from 'next/server'
import { mockProducts } from '@/lib/data/mock-products'

export async function GET() {
  // TODO: Fetch products from Supabase
  // For now, return mock products
  return NextResponse.json(mockProducts)
}
