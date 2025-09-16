import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e]">
      {/* Hero Section with Split Layout */}
      <div className="relative min-h-[600px] overflow-hidden">
        {/* Left side - Light background with content */}
        <div className="absolute inset-0">
          <div className="flex h-full">
            {/* Light section */}
            <div className="w-full lg:w-2/3 bg-gradient-to-br from-gray-50 to-gray-100 relative">
              {/* Diagonal cut */}
              <div 
                className="absolute top-0 right-0 h-full w-32 bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e]"
                style={{
                  clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)'
                }}
              />
              
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-8 lg:px-16 max-w-4xl">
                  <h1 className="text-5xl lg:text-7xl font-bold mb-8 text-transparent bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text tracking-tight">
                    ABOUT DARK<br />
                    PINO PEPTIDES
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Dark section with molecular pattern */}
            <div className="hidden lg:block w-1/3 bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] relative">
              {/* Molecular pattern overlay */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="molecules-about" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                      {/* Molecular structures */}
                      <circle cx="30" cy="30" r="3" fill="#ffd700" opacity="0.4"/>
                      <circle cx="90" cy="50" r="2.5" fill="#00ffff" opacity="0.3"/>
                      <circle cx="60" cy="80" r="2" fill="#ff6600" opacity="0.5"/>
                      <circle cx="40" cy="100" r="2.5" fill="#ffd700" opacity="0.3"/>
                      <circle cx="80" cy="20" r="2" fill="#00ffff" opacity="0.4"/>
                      
                      {/* Hexagonal structures */}
                      <polygon points="70,70 85,78 85,94 70,102 55,94 55,78" 
                               stroke="#ffd700" strokeWidth="1" fill="none" opacity="0.2"/>
                      <polygon points="20,50 35,58 35,74 20,82 5,74 5,58" 
                               stroke="#00ffff" strokeWidth="0.8" fill="none" opacity="0.15"/>
                      
                      {/* Connecting lines */}
                      <line x1="30" y1="30" x2="60" y2="80" stroke="#ffd700" strokeWidth="0.8" opacity="0.3"/>
                      <line x1="60" y1="80" x2="90" y2="50" stroke="#00ffff" strokeWidth="0.6" opacity="0.2"/>
                      <line x1="90" y1="50" x2="80" y2="20" stroke="#ff6600" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#molecules-about)"/>
                </svg>
              </div>
              
              {/* Additional hexagonal overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 right-20 w-32 h-32 border-2 border-yellow-400" 
                     style={{clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'}}>
                </div>
                <div className="absolute bottom-32 right-10 w-24 h-24 border border-cyan-400" 
                     style={{clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'}}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative -mt-20 z-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Company Description */}
            <div className="mb-16">
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 lg:p-12 border border-slate-700/50">
                <p className="text-lg lg:text-xl text-gray-300 leading-relaxed mb-8">
                  We are a leading provider of high-quality peptides for laboratories, researchers, and academic institutions across the globe. 
                  All our products are synthesized and lyophilized in the United States, with purity levels exceeding 99%+. We have a wide 
                  offering of standard peptides as well as topical peptides, peptide blends, customizable orders, and an expert team ready to assist you.
                </p>
              </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center">
                Why Choose Us?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Top Quality */}
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">Top Quality</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Our peptides are manufactured locally against the highest standards for synthesis, undergoing rigorous quality control 
                        measures to ensure their purity, stability, and consistency.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Range of Products */}
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">Range of Products</h3>
                      <p className="text-gray-300 leading-relaxed">
                        We offer a comprehensive and industry-leading peptide catalog. Whether you require standard peptides, blends, 
                        topical peptides, or customized orders, our experienced team is ready to assist you.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expert Customer Service */}
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">Expert Customer Service</h3>
                      <p className="text-gray-300 leading-relaxed">
                        We believe in building long-lasting relationships with our customers. Our dedicated customer support team is here to 
                        support you. We will do everything in our power to ensure that our customers are satisfied, even after products are delivered.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fast and Secure Delivery */}
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L15 6.586A1 1 0 0014.414 6H14v1z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">Fast and Secure Delivery</h3>
                      <p className="text-gray-300 leading-relaxed">
                        We strive to provide fast and reliable delivery, no matter where you are. For orders over $200, the shipping is on us. 
                        All products are packaged securely and shipped with proper temperature controls.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-lg rounded-xl p-8 border border-slate-700/50">
                <p className="text-lg text-gray-300 mb-6">
                  For customized peptide inquiries or to place an order, please reach out to our customer support team by visiting our{' '}
                  <Link 
                    href="/contact" 
                    className="text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text hover:from-pink-400 hover:to-purple-400 font-semibold transition-all duration-200"
                  >
                    Contact page
                  </Link>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/peptides"
                    className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Browse Peptides
                  </Link>
                  <Link 
                    href="/contact"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}