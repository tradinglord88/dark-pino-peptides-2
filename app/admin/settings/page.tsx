'use client'

import { useState } from 'react'
import {
  Store, Shield, Bell, Mail, DollarSign, Truck,
  Save, AlertCircle, CheckCircle, Key, Globe,
  CreditCard, Bitcoin
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'shipping' | 'security'>('general')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const [settings, setSettings] = useState({
    // General Settings
    storeName: 'Dark Pino Peptides',
    storeEmail: 'support@darkpino.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Research Way, Science City, SC 12345',

    // Payment Settings
    stripeEnabled: true,
    solanaEnabled: true,
    etransferEnabled: true,
    solanaWalletAddress: 'DarkPino...xyz',
    etransferEmail: 'payments@darkpino.com',

    // Shipping Settings
    freeShippingThreshold: 150,
    standardShippingRate: 9.99,
    expressShippingRate: 24.99,
    processingTime: '1-2 business days',

    // Security Settings
    twoFactorEnabled: false,
    sessionTimeout: 30,
    ipWhitelist: false,
    allowedIps: ''
  })

  const handleSave = async () => {
    setSaveStatus('saving')

    // Simulate saving to database
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 3000)
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Store Name
        </label>
        <input
          type="text"
          value={settings.storeName}
          onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Support Email
        </label>
        <input
          type="email"
          value={settings.storeEmail}
          onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={settings.storePhone}
          onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Business Address
        </label>
        <textarea
          value={settings.storeAddress}
          onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        />
      </div>
    </div>
  )

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Payment Settings</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-medium">Stripe Payments</p>
              <p className="text-gray-400 text-sm">Credit/Debit card processing</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.stripeEnabled}
              onChange={(e) => setSettings({ ...settings, stripeEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Bitcoin className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white font-medium">Solana Payments</p>
              <p className="text-gray-400 text-sm">Cryptocurrency payments</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.solanaEnabled}
              onChange={(e) => setSettings({ ...settings, solanaEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>

        {settings.solanaEnabled && (
          <div className="ml-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Solana Wallet Address
            </label>
            <input
              type="text"
              value={settings.solanaWalletAddress}
              onChange={(e) => setSettings({ ...settings, solanaWalletAddress: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            />
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-medium">E-Transfer</p>
              <p className="text-gray-400 text-sm">Bank transfer payments</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.etransferEnabled}
              onChange={(e) => setSettings({ ...settings, etransferEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>

        {settings.etransferEnabled && (
          <div className="ml-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              E-Transfer Email
            </label>
            <input
              type="email"
              value={settings.etransferEmail}
              onChange={(e) => setSettings({ ...settings, etransferEmail: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            />
          </div>
        )}
      </div>
    </div>
  )

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Shipping Settings</h2>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Free Shipping Threshold ($)
        </label>
        <input
          type="number"
          value={settings.freeShippingThreshold}
          onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) })}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        />
        <p className="text-gray-400 text-xs mt-1">Orders above this amount get free shipping</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Standard Shipping Rate ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.standardShippingRate}
            onChange={(e) => setSettings({ ...settings, standardShippingRate: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Express Shipping Rate ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.expressShippingRate}
            onChange={(e) => setSettings({ ...settings, expressShippingRate: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Processing Time
        </label>
        <input
          type="text"
          value={settings.processingTime}
          onChange={(e) => setSettings({ ...settings, processingTime: e.target.value })}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        />
        <p className="text-gray-400 text-xs mt-1">How long it takes to process orders before shipping</p>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-medium">Admin Authentication</p>
            <p className="text-gray-300 text-sm mt-1">
              Currently using hardcoded admin credentials. For production, configure Supabase authentication.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-white font-medium">Two-Factor Authentication</p>
            <p className="text-gray-400 text-sm">Require 2FA for admin access</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.twoFactorEnabled}
            onChange={(e) => setSettings({ ...settings, twoFactorEnabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        />
        <p className="text-gray-400 text-xs mt-1">Automatically logout admin after inactivity</p>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-white font-medium">IP Whitelist</p>
            <p className="text-gray-400 text-sm">Restrict admin access to specific IPs</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.ipWhitelist}
            onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
        </label>
      </div>

      {settings.ipWhitelist && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Allowed IP Addresses
          </label>
          <textarea
            value={settings.allowedIps}
            onChange={(e) => setSettings({ ...settings, allowedIps: e.target.value })}
            rows={4}
            placeholder="Enter one IP address per line"
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          />
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Configure your store settings and preferences</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
            saveStatus === 'saving'
              ? 'bg-gray-700 cursor-not-allowed'
              : saveStatus === 'saved'
              ? 'bg-green-600 hover:bg-green-700'
              : saveStatus === 'error'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-yellow-500 hover:bg-yellow-600'
          } text-black`}
        >
          {saveStatus === 'saving' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
              <span>Saving...</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Saved</span>
            </>
          ) : saveStatus === 'error' ? (
            <>
              <AlertCircle className="w-5 h-5" />
              <span>Error</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'general'
                ? 'border-yellow-500 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Store className="w-4 h-4" />
              <span>General</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'payment'
                ? 'border-yellow-500 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Payment</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'shipping'
                ? 'border-yellow-500 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span>Shipping</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'security'
                ? 'border-yellow-500 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'payment' && renderPaymentSettings()}
        {activeTab === 'shipping' && renderShippingSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
      </div>
    </div>
  )
}