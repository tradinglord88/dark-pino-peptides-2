import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          {/* Mascot */}
          <div className="mb-8 animate-float">
            <Image
              src="/images/mascots/dark-pino-mascot.png"
              alt="Dark Pino Mascot"
              width={300}
              height={400}
              className="mx-auto animate-pulse-slow"
              priority
            />
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-fade-in-up">
            Dark Pino Peptides
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Premium research peptides for advanced researchers and enthusiasts.
            Discover our curated selection of high-quality compounds.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Link
              href="/products"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 animate-pulse-glow"
            >
              Browse Products
            </Link>
            <button className="border border-slate-600 hover:border-slate-500 px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:bg-slate-800">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 border-t border-slate-800">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center animate-fade-in-up animation-delay-600 hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <span className="text-2xl">🧬</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Research Grade</h3>
            <p className="text-slate-400">
              Premium quality peptides for serious research applications
            </p>
          </div>
          <div className="text-center animate-fade-in-up animation-delay-800 hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow animation-delay-200">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
            <p className="text-slate-400">
              Safe and secure checkout powered by Stripe
            </p>
          </div>
          <div className="text-center animate-fade-in-up animation-delay-1000 hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow animation-delay-400">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
            <p className="text-slate-400">
              Free shipping worldwide on all orders
            </p>
          </div>
        </div>
      </div>

      {/* Product Categories Preview */}
      <div className="container mx-auto px-4 py-16 border-t border-slate-800">
        <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in-up animation-delay-1200">
          Product Categories
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg animate-fade-in-up animation-delay-1400">
            <h3 className="text-lg font-semibold mb-2">Tissue Repair</h3>
            <p className="text-slate-400 text-sm">Advanced healing compounds</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg animate-fade-in-up animation-delay-1600">
            <h3 className="text-lg font-semibold mb-2">Anti-Aging</h3>
            <p className="text-slate-400 text-sm">
              Longevity research peptides
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg animate-fade-in-up animation-delay-1800">
            <h3 className="text-lg font-semibold mb-2">Cognitive</h3>
            <p className="text-slate-400 text-sm">
              Brain enhancement compounds
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg animate-fade-in-up animation-delay-2000">
            <h3 className="text-lg font-semibold mb-2">Recovery</h3>
            <p className="text-slate-400 text-sm">Performance optimization</p>
          </div>
        </div>
      </div>
    </div>
  )
}
