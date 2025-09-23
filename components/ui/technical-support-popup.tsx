'use client'

import { useState } from 'react'
import { X, Send, User, Mail, MessageSquare, Building } from 'lucide-react'

interface TechnicalSupportPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function TechnicalSupportPopup({ isOpen, onClose }: TechnicalSupportPopupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    inquiryType: 'general',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after showing success
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        organization: '',
        inquiryType: 'general',
        message: ''
      })
      onClose()
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-lg border border-gray-700/50 rounded-lg shadow-2xl w-full max-w-2xl">

          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
            <h2 className="text-lg font-bold text-white flex items-center">
              <MessageSquare className="mr-2 text-yellow-400" size={18} />
              Contact Support
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-3">
            {isSubmitted ? (
              /* Success State */
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="text-green-400" size={20} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  Message Sent Successfully
                </h3>
                <p className="text-gray-300 text-xs">
                  Thank you for contacting us! We'll get back to you within 24-48 hours.
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-2">
                <p className="text-gray-300 text-xs mb-3">
                  Get in touch with our support team for any questions.
                </p>

                {/* Name and Email in same row */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-white text-xs font-medium mb-1">
                      <User size={14} className="inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-2 py-1.5 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs font-medium mb-1">
                      <Mail size={14} className="inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-2 py-1.5 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {/* Organization and Inquiry Type in same row */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-white text-xs font-medium mb-1">
                      <Building size={14} className="inline mr-1" />
                      Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1.5 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-sm"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs font-medium mb-1">
                      Inquiry Type
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1.5 bg-slate-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-sm"
                    >
                      <option value="general">General Support</option>
                      <option value="product">Product Information</option>
                      <option value="order">Order Status & Shipping</option>
                      <option value="technical">Technical Questions</option>
                      <option value="bulk">Bulk Orders</option>
                      <option value="custom">Custom Requests</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-white text-xs font-medium mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-2 py-1.5 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 resize-none text-sm"
                    placeholder="Describe your question or how we can help..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 text-black font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-black border-t-transparent mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-2">
                  Response time: 24-48 hours
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}