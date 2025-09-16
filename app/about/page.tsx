import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#1a1a2e]">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tech-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 30h60M30 0v60" stroke="#00ffff" strokeWidth="0.5" opacity="0.3"/>
              <circle cx="30" cy="30" r="2" fill="#00ffff" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-grid)"/>
        </svg>
      </div>

      {/* Compact Hero Section */}
      <div className="relative py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-white tracking-tight">
              DARK PINO PEPTIDES
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-6"></div>
            <p className="text-lg lg:text-xl text-gray-400 font-light">
              Advanced Pharmaceutical Research Solutions
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="relative z-10 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              <div className="text-center p-3 lg:p-4 bg-slate-900/80 backdrop-blur rounded-lg border border-slate-700/30">
                <div className="text-xl lg:text-3xl font-bold text-cyan-400 mb-1">99%+</div>
                <div className="text-xs lg:text-sm text-gray-400 uppercase tracking-wide">Purity Level</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-slate-900/80 backdrop-blur rounded-lg border border-slate-700/30">
                <div className="text-xl lg:text-3xl font-bold text-cyan-400 mb-1">500+</div>
                <div className="text-xs lg:text-sm text-gray-400 uppercase tracking-wide">Compounds</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-slate-900/80 backdrop-blur rounded-lg border border-slate-700/30">
                <div className="text-xl lg:text-3xl font-bold text-cyan-400 mb-1">ISO</div>
                <div className="text-xs lg:text-sm text-gray-400 uppercase tracking-wide">Certified</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-slate-900/80 backdrop-blur rounded-lg border border-slate-700/30">
                <div className="text-xl lg:text-3xl font-bold text-cyan-400 mb-1">48h</div>
                <div className="text-xs lg:text-sm text-gray-400 uppercase tracking-wide">Synthesis</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Company Description */}
            <div className="mb-12">
              <div className="bg-slate-900/60 backdrop-blur rounded-lg p-6 lg:p-8 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  Research Excellence
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Leading provider of pharmaceutical-grade peptides for laboratories, researchers, and academic institutions globally. 
                  All compounds are synthesized and lyophilized in FDA-registered facilities with purity exceeding 99%+. 
                  Comprehensive catalog includes research peptides, custom synthesis, and analytical services.
                </p>
              </div>
            </div>

            {/* Capabilities Grid */}
            <div className="mb-8 lg:mb-12">
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6 lg:mb-8 text-center">Core Capabilities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                {/* Quality Assurance */}
                <div className="bg-slate-900/60 backdrop-blur rounded-lg p-4 lg:p-5 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-cyan-400 rounded-full"></div>
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-white">Quality Assurance</h3>
                  </div>
                  <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                    FDA-registered facilities with rigorous QC protocols. HPLC/MS verification, 
                    CoA documentation, and chain-of-custody tracking.
                  </p>
                </div>

                {/* Custom Synthesis */}
                <div className="bg-slate-900/60 backdrop-blur rounded-lg p-4 lg:p-5 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 bg-cyan-400 rounded-sm"></div>
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-white">Custom Synthesis</h3>
                  </div>
                  <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                    Bespoke peptide manufacturing from research to production scale. 
                    Modified amino acids, complex cyclization, and purification services.
                  </p>
                </div>

                {/* Regulatory Compliance */}
                <div className="bg-slate-900/60 backdrop-blur rounded-lg p-4 lg:p-5 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-cyan-400"></div>
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-white">Regulatory Compliance</h3>
                  </div>
                  <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                    ISO 9001:2015 certified operations. Full documentation packages 
                    for research compliance and institutional requirements.
                  </p>
                </div>

                {/* Cold Chain Logistics */}
                <div className="bg-slate-900/60 backdrop-blur rounded-lg p-4 lg:p-5 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 bg-cyan-400"></div>
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
            <div className="text-center">
              <div className="bg-slate-900/60 backdrop-blur rounded-lg p-4 lg:p-6 border border-slate-700/50">
                <h3 className="text-base lg:text-lg font-semibold text-white mb-3">Research Partnerships</h3>
                <p className="text-gray-400 text-xs lg:text-sm mb-4 lg:mb-6 max-w-2xl mx-auto">
                  For custom synthesis inquiries, bulk orders, or research collaborations, 
                  contact our scientific team for specialized consultation and technical support.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 justify-center">
                  <Link 
                    href="/peptides"
                    className="px-4 lg:px-6 py-2 lg:py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-colors duration-200 text-xs lg:text-sm"
                  >
                    Browse Catalog
                  </Link>
                  <Link 
                    href="/contact"
                    className="px-4 lg:px-6 py-2 lg:py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors duration-200 text-xs lg:text-sm border border-slate-600"
                  >
                    Technical Support
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