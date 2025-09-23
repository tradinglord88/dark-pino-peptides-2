'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TechnicalSupportPopup } from '@/components/ui/technical-support-popup'

export default function AboutPage() {
  const [isSupportPopupOpen, setIsSupportPopupOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e]">

      {/* Hero Section */}
      <div className="relative min-h-[500px] overflow-hidden">
        {/* Laboratory Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/laboratory.jpg"
            alt="Research Laboratory"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Molecular pattern overlay */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="molecules" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="#ffd700" opacity="0.4"/>
                <circle cx="80" cy="40" r="1.5" fill="#00ffff" opacity="0.3"/>
                <circle cx="50" cy="70" r="1" fill="#ff6600" opacity="0.5"/>
                <circle cx="30" cy="90" r="1.5" fill="#ffd700" opacity="0.3"/>
                <line x1="20" y1="20" x2="50" y2="70" stroke="#ffd700" strokeWidth="0.5" opacity="0.4"/>
                <line x1="50" y1="70" x2="80" y2="40" stroke="#00ffff" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#molecules)"/>
          </svg>
        </div>

        {/* Diagonal cut - darker shade */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0a1a]"
          style={{
            clipPath: 'polygon(0 100%, 100% 40%, 100% 100%)'
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 flex items-center justify-center min-h-[500px]">
          <div className="text-center text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-yellow-400 drop-shadow-lg">
              About Dark Pino
            </h1>
            <p className="text-lg text-gray-100 mb-8 drop-shadow-md">
              Leading provider of pharmaceutical-grade peptides for laboratories, researchers, and academic institutions globally.
              Advanced compounds synthesized with precision and excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-[#0a0a1a] py-12">
        <div className="container mx-auto px-4">
          {/* Metrics Bar */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              <div className="text-center p-3 lg:p-4 bg-black/50 backdrop-blur rounded-lg border border-gray-800">
                <div className="text-xl lg:text-3xl font-bold text-yellow-400 mb-1">99%+</div>
                <div className="text-xs lg:text-sm text-gray-400 uppercase tracking-wide">Purity Level</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-black/50 backdrop-blur rounded-lg border border-gray-800">
                <div className="text-xl lg:text-3xl font-bold text-yellow-400 mb-1">500+</div>
                <div className="text-xs lg:text-sm text-gray-400 uppercase tracking-wide">Compounds</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-black/50 backdrop-blur rounded-lg border border-gray-800">
                <div className="text-xl lg:text-3xl font-bold text-yellow-400 mb-1">ISO</div>
                <div className="text-xs lg:text-sm text-gray-400 uppercase tracking-wide">Certified</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-black/50 backdrop-blur rounded-lg border border-gray-800">
                <div className="text-xl lg:text-3xl font-bold text-yellow-400 mb-1">48h</div>
                <div className="text-xs lg:text-sm text-gray-400 uppercase tracking-wide">Synthesis</div>
              </div>
            </div>
          </div>

          {/* Company Description */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <div className="bg-black/50 backdrop-blur rounded-lg p-6 lg:p-8 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  The Future of Medicine: Peptide Signaling
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Peptides represent the future of medicine by harnessing your body's own signaling mechanisms. These naturally occurring
                  biological messengers orchestrate healing, regeneration, and cellular communication throughout your system. Unlike traditional
                  pharmaceuticals that force chemical changes, peptides work with your body's innate intelligence to restore balance and
                  optimize function.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Your body produces thousands of peptides that regulate everything from tissue repair and immune response to metabolism
                  and cognitive function. By supplementing with bioidentical peptides, we can amplify these natural healing signals,
                  enabling your body to heal itself more effectively. This is precision medicine at the molecular level - targeted,
                  natural, and working in harmony with your biological systems.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Dark Pino provides pharmaceutical-grade peptides with purity exceeding 99%+ for research institutions exploring these
                  revolutionary therapeutic applications. Our comprehensive catalog supports groundbreaking research in regenerative medicine,
                  longevity science, and cellular optimization.
                </p>
                
                {/* Pharmaceutical Research Video */}
                <div className="rounded-lg overflow-hidden shadow-lg border border-gray-700">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto"
                  >
                    <source src="/videos/pharmaceutical-research.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            {/* Capabilities Grid */}
            <div className="mb-8 lg:mb-12">
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6 lg:mb-8 text-center">Core Capabilities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                {/* Quality Assurance */}
                <div className="bg-black/50 backdrop-blur rounded-lg p-4 lg:p-5 border border-gray-800 hover:border-yellow-500/50 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-yellow-400 rounded-full"></div>
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-white">Quality Assurance</h3>
                  </div>
                  <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                    State-of-the-art facilities with rigorous QC protocols. HPLC/MS verification, 
                    CoA documentation, and chain-of-custody tracking.
                  </p>
                </div>

                {/* Custom Synthesis */}
                <div className="bg-black/50 backdrop-blur rounded-lg p-4 lg:p-5 border border-gray-800 hover:border-yellow-500/50 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 bg-yellow-400 rounded-sm"></div>
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-white">Custom Synthesis</h3>
                  </div>
                  <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                    Bespoke peptide manufacturing from research to production scale. 
                    Modified amino acids, complex cyclization, and purification services.
                  </p>
                </div>

                {/* Regulatory Compliance */}
                <div className="bg-black/50 backdrop-blur rounded-lg p-4 lg:p-5 border border-gray-800 hover:border-yellow-500/50 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-yellow-400"></div>
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-white">Regulatory Compliance</h3>
                  </div>
                  <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                    ISO 9001:2015 certified operations. Full documentation packages 
                    for research compliance and institutional requirements.
                  </p>
                </div>

                {/* Cold Chain Logistics */}
                <div className="bg-black/50 backdrop-blur rounded-lg p-4 lg:p-5 border border-gray-800 hover:border-yellow-500/50 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 bg-yellow-400"></div>
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-white">Cold Chain Logistics</h3>
                  </div>
                  <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                    Temperature-controlled storage and shipping. Real-time monitoring 
                    and expedited delivery for time-sensitive research applications.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="text-center mt-16">
              <div className="bg-black/50 backdrop-blur-lg rounded-lg p-8 max-w-4xl mx-auto border border-gray-800">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                  Research Partnerships
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  For custom synthesis inquiries, bulk orders, or research collaborations, 
                  contact our scientific team for specialized consultation and technical support.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/peptides"
                    className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors duration-200"
                  >
                    Browse Catalog
                  </Link>
                  <button 
                    onClick={() => setIsSupportPopupOpen(true)}
                    className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 border border-gray-600"
                  >
                    Technical Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Support Popup */}
      <TechnicalSupportPopup 
        isOpen={isSupportPopupOpen}
        onClose={() => setIsSupportPopupOpen(false)}
      />
    </div>
  )
}