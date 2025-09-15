'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TermsPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted terms
    const hasAccepted = localStorage.getItem('termsAccepted')
    if (!hasAccepted) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('termsAccepted', 'true')
    setIsVisible(false)
  }

  const handleDisagree = () => {
    setIsVisible(false)
    // Optionally redirect or show alternative content
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 text-sm text-gray-300">
            <p className="mb-2">
              With your agreement, we and our{' '}
              <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                4 partners
              </Link>{' '}
              use cookies or similar technologies to store, access, and process personal data like your visit on this website, IP addresses and cookie identifiers. Some partners do not ask for your consent to process your data and rely on their legitimate business interest. You can withdraw your consent or object to data processing based on legitimate interest at any time by clicking on &quot;Learn More&quot; or in our Privacy Policy on this website.
            </p>
            <div className="text-xs text-gray-400">
              <p className="font-medium mb-1">We and our partners process data for the following purposes</p>
              <p>
                Personalised advertising and content, advertising and content measurement, audience research and services development, Precise geolocation data, and identification through device scanning, Store and/or access information on a device
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
            <Link 
              href="/terms"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-md transition-colors whitespace-nowrap text-center"
            >
              Learn More →
            </Link>
            <button
              onClick={handleDisagree}
              className="px-4 py-2 text-sm text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors whitespace-nowrap"
            >
              Disagree and close
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
            >
              Agree and close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}