import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Trust Statement Section */}
      <div className="border-b border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-lg mb-2">
            darkpinopeptides.com is your trusted source for premium research peptides. All products are manufactured in 
            cGMP & ISO 9001 Certified Labs and all products are HPLC tested to ensure quality. Buy with 
            confidence from darkpinopeptides.com
          </p>
          <p className="text-gray-400 text-sm">
            #PEPTIDES #RESEARCH #PREMIUM #DARKPINO #SCIENCE #INNOVATION
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/mascots/dark-pino-mascot.png"
                alt="Dark Pino"
                width={40}
                height={40}
                className="w-10 h-auto"
              />
              <div>
                <h3 className="text-xl font-bold">Dark Pino Peptides</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Dark Pino Peptides is your premier source for high-quality research peptides.
            </p>
            <div className="border-t border-gray-800 pt-4">
              <p className="text-xs text-gray-500">
                Copyright 2024 - 2025 darkpinopeptides.com
              </p>
            </div>
          </div>

          {/* Research Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Research Products</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-white transition-colors">Shop All Products</Link></li>
              <li><Link href="/products?category=peptides" className="hover:text-white transition-colors">BPC-157</Link></li>
              <li><Link href="/products?category=peptides" className="hover:text-white transition-colors">TB-500</Link></li>
              <li><Link href="/products?category=peptides" className="hover:text-white transition-colors">GHK-Cu</Link></li>
              <li><Link href="/products?category=blends" className="hover:text-white transition-colors">Research Blends</Link></li>
              <li><Link href="/products?category=skincare" className="hover:text-white transition-colors">Skincare Research</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-lg font-semibold mb-4">My Account</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/auth" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">My Order History</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">Account Settings</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/subscriptions" className="hover:text-white transition-colors">Subscriptions</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Research Blog</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            Buy research peptides online, including premium compounds and research blends. Shop legal, high-quality peptides with fast shipping and HPLC-tested purity
          </p>
        </div>
      </div>
    </footer>
  )
}