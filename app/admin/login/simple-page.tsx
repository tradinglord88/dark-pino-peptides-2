'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'

// HARDCODED ADMIN CREDENTIALS
const ADMIN_CREDENTIALS = {
  email: 'admin@darkpino.com',
  password: 'DarkPino2024!@#'
}

export default function SimpleAdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simple hardcoded authentication
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Set admin session in localStorage
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminEmail', email)
      localStorage.setItem('adminLoginTime', new Date().toISOString())

      // Set admin cookie for middleware
      document.cookie = 'adminAuth=true; path=/; max-age=86400' // 24 hours

      // Redirect to admin dashboard
      router.push('/admin/dashboard')
    } else {
      setError('Invalid email or password')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-3 mb-6">
            <Image
              src="/images/pepe-mascot.png"
              alt="Dark Pino Logo"
              width={60}
              height={60}
              className="rounded-lg"
            />
            <div className="text-left">
              <div className="text-2xl font-permanent-marker text-yellow-400">DARK PINO</div>
              <div className="text-sm text-gray-400 font-semibold tracking-wider">ADMIN PORTAL</div>
            </div>
          </Link>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-yellow-500/10 rounded-full">
              <ShieldCheck className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-8">Admin Login</h2>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}


          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-colors"
                  placeholder="admin@darkpino.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Access Admin Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              Return to Main Site
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              This is a secure admin area. All login attempts are logged.
              Unauthorized access attempts will be reported.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}