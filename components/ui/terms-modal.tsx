'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useTermsStore } from '@/stores/terms-store'
import Link from 'next/link'

export function TermsModal() {
  const {
    isModalOpen,
    isHydrated,
    agreeToTerms,
    hideModal,
  } = useTermsStore()

  const [hasReadTerms, setHasReadTerms] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        // Don't allow closing with escape - user must agree
        return
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isModalOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  // Don't render until hydrated to prevent SSR mismatches
  if (!isHydrated || !isModalOpen) return null

  const handleAgree = () => {
    if (agreedToTerms) {
      agreeToTerms()
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement
    const { scrollTop, scrollHeight, clientHeight } = element
    
    // Check if user has scrolled to within 50px of the bottom
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setHasReadTerms(true)
    }
  }

  return (
    <>
      {/* Backdrop - Non-clickable */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-lg border border-slate-700/50 rounded-lg shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-2">
                <AlertTriangle size={24} className="text-yellow-400" />
                <h2 className="text-xl font-bold text-white">
                  Terms of Service & Disclaimer
                </h2>
              </div>
              {/* No close button - user must agree */}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-4">
                  Please read and accept our Terms of Service to continue accessing Dark Pino Peptides.
                </p>
              </div>

              {/* Terms Content - Scrollable */}
              <div 
                className="bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto border border-slate-700/30 mb-6"
                onScroll={handleScroll}
              >
                <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Welcome to Dark Pino Peptides</h3>
                    <p>By accessing or using this website, you agree to the following terms and conditions. Please read them carefully before proceeding.</p>
                  </div>

                  <div className="border-t border-slate-600/50 pt-4">
                    <h4 className="text-white font-semibold mb-2">1. Research Use Only</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>All products sold by Dark Pino Peptides are intended solely for laboratory research and development purposes.</li>
                      <li>These compounds are not approved for human or animal consumption, medical use, diagnostic use, or therapeutic application.</li>
                      <li>By purchasing, you confirm that you are a qualified researcher or institution with the knowledge and facilities to safely handle research compounds.</li>
                    </ul>
                  </div>

                  <div className="border-t border-slate-600/50 pt-4">
                    <h4 className="text-white font-semibold mb-2">2. Assumption of Risk</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>You acknowledge that handling research chemicals carries inherent risks.</li>
                      <li>Dark Pino Peptides does not make any representation or warranty regarding the safety, efficacy, or suitability of its products.</li>
                      <li>You assume full responsibility for the safe handling, storage, and use of any product obtained through this website.</li>
                    </ul>
                  </div>

                  <div className="border-t border-slate-600/50 pt-4">
                    <h4 className="text-white font-semibold mb-2">3. No Liability</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Dark Pino Peptides, its owners, employees, and affiliates shall not be held liable for any loss, damage, injury, or adverse outcome resulting from the use, misuse, or handling of its products.</li>
                      <li>The buyer agrees to indemnify and hold harmless Dark Pino Peptides against all claims, liabilities, and expenses arising from the use of purchased products.</li>
                    </ul>
                  </div>

                  <div className="border-t border-slate-600/50 pt-4">
                    <h4 className="text-white font-semibold mb-2">4. Eligibility & Compliance</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>You must be at least 21 years of age to access or purchase from this website.</li>
                      <li>It is your responsibility to ensure compliance with all applicable laws and regulations in your jurisdiction before ordering.</li>
                    </ul>
                  </div>

                  <div className="border-t border-slate-600/50 pt-4">
                    <h4 className="text-white font-semibold mb-2">5. No Medical Advice</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>The information provided on this website is for educational and informational purposes only.</li>
                      <li>Nothing contained herein should be construed as medical advice, treatment guidance, or a recommendation for personal use.</li>
                    </ul>
                  </div>

                  <div className="border-t border-slate-600/50 pt-4">
                    <h4 className="text-white font-semibold mb-2">6. Agreement to Terms</h4>
                    <p>By entering this website and/or purchasing from Dark Pino Peptides, you acknowledge that you have read, understood, and agreed to these Terms of Service and Disclaimer.</p>
                  </div>

                  {/* Scroll indicator */}
                  {!hasReadTerms && (
                    <div className="text-center text-yellow-400 text-xs italic py-2">
                      Please scroll to the bottom to continue ↓
                    </div>
                  )}
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="space-y-4">
                <div 
                  className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                    hasReadTerms 
                      ? 'bg-slate-800/50 border-slate-600/50' 
                      : 'bg-slate-700/30 border-slate-700/30 opacity-50'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="agree-terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      disabled={!hasReadTerms}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                    />
                  </div>
                  <label 
                    htmlFor="agree-terms" 
                    className={`text-sm leading-relaxed cursor-pointer ${
                      hasReadTerms ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    I acknowledge that I have read, understood, and agree to these Terms of Service and Disclaimer. 
                    I confirm that I am at least 21 years old and am a qualified researcher purchasing these products 
                    solely for laboratory research purposes.
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/terms"
                    className="flex-1 px-6 py-3 border border-slate-600 text-gray-300 rounded-lg hover:bg-slate-800/50 transition-colors text-center"
                  >
                    Read Full Terms
                  </Link>
                  
                  <button
                    onClick={handleAgree}
                    disabled={!agreedToTerms}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle2 size={18} />
                      <span>I Agree - Enter Site</span>
                    </div>
                  </button>
                </div>

                <div className="text-center text-xs text-gray-400">
                  🔒 Your agreement is stored locally and securely
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}