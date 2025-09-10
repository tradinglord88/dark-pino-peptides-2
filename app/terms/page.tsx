import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service & Disclaimer - Dark Pino Peptides',
  description: 'Complete Terms of Service and Disclaimer for Dark Pino Peptides research compounds.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle size={32} className="text-yellow-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Terms of Service & Disclaimer
            </h1>
          </div>
          
          <p className="text-gray-300 text-lg">
            Last Updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 rounded-lg p-6 sm:p-8 space-y-8">
          <div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Welcome to Dark Pino Peptides. By accessing or using this website, you agree to the following terms and conditions. Please read them carefully before proceeding.
            </p>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Research Use Only</h2>
            <div className="space-y-3 text-gray-300">
              <p>• All products sold by Dark Pino Peptides are intended solely for laboratory research and development purposes.</p>
              <p>• These compounds are not approved for human or animal consumption, medical use, diagnostic use, or therapeutic application.</p>
              <p>• By purchasing, you confirm that you are a qualified researcher or institution with the knowledge and facilities to safely handle research compounds.</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Assumption of Risk</h2>
            <div className="space-y-3 text-gray-300">
              <p>• You acknowledge that handling research chemicals carries inherent risks.</p>
              <p>• Dark Pino Peptides does not make any representation or warranty regarding the safety, efficacy, or suitability of its products.</p>
              <p>• You assume full responsibility for the safe handling, storage, and use of any product obtained through this website.</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. No Liability</h2>
            <div className="space-y-3 text-gray-300">
              <p>• Dark Pino Peptides, its owners, employees, and affiliates shall not be held liable for any loss, damage, injury, or adverse outcome resulting from the use, misuse, or handling of its products.</p>
              <p>• The buyer agrees to indemnify and hold harmless Dark Pino Peptides against all claims, liabilities, and expenses arising from the use of purchased products.</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Eligibility & Compliance</h2>
            <div className="space-y-3 text-gray-300">
              <p>• You must be at least 21 years of age to access or purchase from this website.</p>
              <p>• It is your responsibility to ensure compliance with all applicable laws and regulations in your jurisdiction before ordering.</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. No Medical Advice</h2>
            <div className="space-y-3 text-gray-300">
              <p>• The information provided on this website is for educational and informational purposes only.</p>
              <p>• Nothing contained herein should be construed as medical advice, treatment guidance, or a recommendation for personal use.</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Product Information & Quality</h2>
            <div className="space-y-3 text-gray-300">
              <p>• All products are sold with certificates of analysis when available.</p>
              <p>• We strive to maintain the highest purity standards, but variations may occur.</p>
              <p>• Products should be stored according to manufacturer recommendations.</p>
              <p>• Expiration dates and storage conditions are provided when available.</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Ordering & Shipping</h2>
            <div className="space-y-3 text-gray-300">
              <p>• Orders are subject to availability and verification.</p>
              <p>• We reserve the right to refuse orders at our discretion.</p>
              <p>• Shipping methods and times vary by location and product.</p>
              <p>• Customer is responsible for any customs fees or import duties.</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Privacy & Data Protection</h2>
            <div className="space-y-3 text-gray-300">
              <p>• We collect only necessary information for order processing and shipping.</p>
              <p>• Customer information is kept confidential and not shared with third parties except as required for order fulfillment.</p>
              <p>• Payment processing is handled by secure third-party providers.</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Returns & Refunds</h2>
            <div className="space-y-3 text-gray-300">
              <p>• Due to the nature of research compounds, returns are generally not accepted.</p>
              <p>• Refunds may be considered for damaged or incorrectly shipped items.</p>
              <p>• Claims must be made within 7 days of delivery.</p>
              <p>• All refund requests are subject to review and approval.</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Agreement to Terms</h2>
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6">
              <p className="text-blue-200 font-medium">
                By entering this website and/or purchasing from Dark Pino Peptides, you acknowledge that you have read, understood, and agreed to these Terms of Service and Disclaimer.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
            <div className="space-y-3 text-gray-300">
              <p>If you have questions about these terms or our products, please contact us:</p>
              <p>• Email: support@darkpinopeptides.com</p>
              <p>• Response time: 24-48 hours during business days</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft size={18} />
            <span>Return to Dark Pino Peptides</span>
          </Link>
        </div>
      </div>
    </div>
  )
}