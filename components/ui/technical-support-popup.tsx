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
        <div className="bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-lg border border-gray-700/50 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white flex items-center">
              <MessageSquare className="mr-2 text-yellow-400" size={20} />
              Technical Support
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isSubmitted ? (
              /* Success State */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="text-green-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Message Sent Successfully
                </h3>
                <p className="text-gray-300 text-sm">
                  Our technical team will review your inquiry and respond within 24-48 hours.
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-gray-300 text-sm mb-6">
                  For custom synthesis inquiries, bulk orders, or research collaborations, 
                  contact our scientific team for specialized consultation.
                </p>

                {/* Name */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    <User size={16} className="inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                    placeholder="Dr. John Smith"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    <Mail size={16} className="inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                    placeholder="john.smith@university.edu"
                  />
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    <Building size={16} className="inline mr-1" />
                    Organization
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                    placeholder="University, Lab, or Company"
                  />
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Inquiry Type
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  >
                    <option value="general">General Support</option>
                    <option value="custom">Custom Synthesis</option>
                    <option value="bulk">Bulk Orders</option>
                    <option value="collaboration">Research Collaboration</option>
                    <option value="technical">Technical Questions</option>
                    <option value="quality">Quality Assurance</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 resize-none"
                    placeholder="Please describe your inquiry, research needs, or technical questions..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 text-black font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  Response time: 24-48 hours • Secure & confidential
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}