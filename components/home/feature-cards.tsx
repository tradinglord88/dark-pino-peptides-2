'use client'

export function FeatureCards() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      title: "FREE DELIVERY",
      description: "Any purchase of $200 or more qualifies for free delivery within the USA."
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
    }
  ]

  return (
    <div className="bg-black/95 backdrop-blur-sm border-t border-gray-800">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      <div className="relative container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
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
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
      </div>
    </div>
  )
}