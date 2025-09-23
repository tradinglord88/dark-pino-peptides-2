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
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
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