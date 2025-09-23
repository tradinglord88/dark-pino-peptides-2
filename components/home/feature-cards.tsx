'use client'

import { useState } from 'react'
import { TechnicalSupportPopup } from '@/components/ui/technical-support-popup'

export function FeatureCards() {
  const [isSupportPopupOpen, setIsSupportPopupOpen] = useState(false)
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      title: "WORLDWIDE SHIPPING",
      description: "Fast and reliable shipping to locations worldwide with tracking included."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "HIGHEST QUALITY PEPTIDES",
      description: "Our products are scientifically-formulated and produced in cGMP facilities."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "ONLINE SUPPORT",
      description: "Have questions? We can help. Email us or connect with us via our Contact page."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m-3-6h6" />
        </svg>
      ),
      title: "PAY WITH CRYPTO",
      description: "Secure cryptocurrency payments accepted. Bitcoin, Ethereum, and other major cryptocurrencies supported."
    }
  ]

  return (
    <div className="bg-black/95 backdrop-blur-sm border-t border-gray-800 pb-24 mb-0">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      <div className="relative container mx-auto px-4 py-6 lg:py-8 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              onClick={() => {
                if (feature.title === "ONLINE SUPPORT") {
                  setIsSupportPopupOpen(true)
                }
              }}
              className="group text-center space-y-4 p-6 rounded-lg hover:bg-gray-800/30 transition-all duration-300 cursor-pointer border border-transparent hover:border-yellow-500/20"
            >
              {/* Icon */}
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-yellow-500/25">
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-lg lg:text-xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-300 text-sm lg:text-base leading-relaxed group-hover:text-white transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Bottom accent line */}
        <div className="mt-4 mb-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
      </div>
      
      {/* Technical Support Popup */}
      <TechnicalSupportPopup 
        isOpen={isSupportPopupOpen} 
        onClose={() => setIsSupportPopupOpen(false)} 
      />
    </div>
  )
}