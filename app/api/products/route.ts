import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Fetch products from Supabase
  const products = []
  
  return NextResponse.json(products)
}