'use client'

import { useState, useEffect } from 'react'
import {
  Bitcoin, ArrowRightLeft, CreditCard, Search, CheckCircle,
  XCircle, Clock, AlertTriangle, Copy, ExternalLink,
  RefreshCw, DollarSign, Hash, User, Calendar, Shield
} from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Connection, PublicKey } from '@solana/web3.js'

interface PaymentTab {
  id: string
  label: string
  icon: React.ReactNode
  count: number
}

interface SolanaPayment {
  id: string
  order_id: string
  signature: string
  from_wallet: string
  to_wallet: string
  amount: number
  token_symbol: string
  verification_status: string
  confirmations: number
  created_at: string
}

interface ETransferPayment {
  id: string
  order_id: string
  reference_number: string
  sender_email: string
  sender_name: string
  amount: number
  currency: string
  status: string
  created_at: string
}

export default function PaymentsPage() {
  const supabase = createClientComponentClient()
  const [activeTab, setActiveTab] = useState('solana')
  const [solanaPayments, setSolanaPayments] = useState<SolanaPayment[]>([])
  const [etransferPayments, setEtransferPayments] = useState<ETransferPayment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [verifyingPayment, setVerifyingPayment] = useState<string | null>(null)

  // New e-transfer form
  const [showETransferForm, setShowETransferForm] = useState(false)
  const [etransferForm, setEtransferForm] = useState({
    order_number: '',
    reference_number: '',
    sender_email: '',
    sender_name: '',
    amount: '',
    currency: 'CAD'
  })

  // Solana verification form
  const [showSolanaForm, setShowSolanaForm] = useState(false)
  const [solanaForm, setSolanaForm] = useState({
    order_number: '',
    signature: '',
    from_wallet: '',
    amount: ''
  })

  const merchantWallet = process.env.NEXT_PUBLIC_MERCHANT_WALLET || 'YOUR_WALLET_ADDRESS'

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setIsLoading(true)
    try {
      // Fetch Solana payments
      const { data: solana } = await supabase
        .from('solana_payments')
        .select('*')
        .order('created_at', { ascending: false })

      // Fetch e-transfer payments
      const { data: etransfer } = await supabase
        .from('etransfer_payments')
        .select('*')
        .order('created_at', { ascending: false })

      setSolanaPayments(solana || [])
      setEtransferPayments(etransfer || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const verifySolanaTransaction = async (signature: string, orderId: string) => {
    setVerifyingPayment(signature)
    try {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
      )

      // Get transaction details
      const tx = await connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0
      })

      if (tx) {
        // Update payment verification status
        await supabase
          .from('solana_payments')
          .update({
            verification_status: 'confirmed',
            confirmed: true,
            confirmations: tx.slot,
            block_time: new Date(tx.blockTime! * 1000).toISOString()
          })
          .eq('signature', signature)

        // Update order payment status
        await supabase
          .from('orders')
          .update({
            payment_status: 'completed',
            paid_at: new Date().toISOString()
          })
          .eq('id', orderId)

        // Refresh data
        await fetchPayments()
      }
    } catch (error) {
      console.error('Verification error:', error)
      alert('Failed to verify transaction. Please check the signature.')
    } finally {
      setVerifyingPayment(null)
    }
  }

  const recordETransfer = async () => {
    try {
      // Find order by order number
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', etransferForm.order_number)
        .single()

      if (!order) {
        alert('Order not found')
        return
      }

      // Create e-transfer payment record
      await supabase
        .from('etransfer_payments')
        .insert({
          order_id: order.id,
          reference_number: etransferForm.reference_number,
          sender_email: etransferForm.sender_email,
          sender_name: etransferForm.sender_name,
          amount: parseFloat(etransferForm.amount),
          currency: etransferForm.currency,
          status: 'received',
          received_at: new Date().toISOString()
        })

      // Update order
      await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          paid_at: new Date().toISOString(),
          etransfer_reference: etransferForm.reference_number
        })
        .eq('id', order.id)

      // Reset form and refresh
      setEtransferForm({
        order_number: '',
        reference_number: '',
        sender_email: '',
        sender_name: '',
        amount: '',
        currency: 'CAD'
      })
      setShowETransferForm(false)
      await fetchPayments()
    } catch (error) {
      console.error('Error recording e-transfer:', error)
      alert('Failed to record e-transfer')
    }
  }

  const recordSolanaPayment = async () => {
    try {
      // Find order by order number
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', solanaForm.order_number)
        .single()

      if (!order) {
        alert('Order not found')
        return
      }

      // Create Solana payment record
      await supabase
        .from('solana_payments')
        .insert({
          order_id: order.id,
          signature: solanaForm.signature,
          from_wallet: solanaForm.from_wallet,
          to_wallet: merchantWallet,
          amount: parseFloat(solanaForm.amount),
          token_symbol: 'SOL',
          verification_status: 'pending'
        })

      // Automatically verify the transaction
      await verifySolanaTransaction(solanaForm.signature, order.id)

      // Reset form
      setSolanaForm({
        order_number: '',
        signature: '',
        from_wallet: '',
        amount: ''
      })
      setShowSolanaForm(false)
    } catch (error) {
      console.error('Error recording Solana payment:', error)
      alert('Failed to record Solana payment')
    }
  }

  const tabs: PaymentTab[] = [
    {
      id: 'solana',
      label: 'Solana',
      icon: <Bitcoin className="w-4 h-4" />,
      count: solanaPayments.filter(p => p.verification_status === 'pending').length
    },
    {
      id: 'etransfer',
      label: 'E-Transfer',
      icon: <ArrowRightLeft className="w-4 h-4" />,
      count: etransferPayments.filter(p => p.status === 'pending').length
    },
    {
      id: 'stripe',
      label: 'Stripe',
      icon: <CreditCard className="w-4 h-4" />,
      count: 0
    }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Payment Verification</h1>
          <p className="text-gray-400 mt-1">Verify and manage payment transactions</p>
        </div>
        <button
          onClick={fetchPayments}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Merchant Wallet Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Merchant Wallet (Solana)</p>
              <p className="text-white font-mono text-sm">{merchantWallet}</p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(merchantWallet)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Copy wallet address"
          >
            <Copy className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-1 py-3 border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-transparent text-gray-400 hover:text-white'
                }
              `}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      ) : (
        <>
          {/* Solana Payments */}
          {activeTab === 'solana' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Solana Transactions</h2>
                <button
                  onClick={() => setShowSolanaForm(!showSolanaForm)}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg transition-colors"
                >
                  + Record Payment
                </button>
              </div>

              {/* Solana Payment Form */}
              {showSolanaForm && (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Record Solana Payment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Order Number (e.g., ORD-001)"
                      value={solanaForm.order_number}
                      onChange={(e) => setSolanaForm({...solanaForm, order_number: e.target.value})}
                      className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      placeholder="Transaction Signature"
                      value={solanaForm.signature}
                      onChange={(e) => setSolanaForm({...solanaForm, signature: e.target.value})}
                      className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      placeholder="From Wallet Address"
                      value={solanaForm.from_wallet}
                      onChange={(e) => setSolanaForm({...solanaForm, from_wallet: e.target.value})}
                      className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
                    />
                    <input
                      type="number"
                      placeholder="Amount (SOL)"
                      value={solanaForm.amount}
                      onChange={(e) => setSolanaForm({...solanaForm, amount: e.target.value})}
                      className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={recordSolanaPayment}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg"
                    >
                      Record & Verify
                    </button>
                    <button
                      onClick={() => setShowSolanaForm(false)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Solana Payments List */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Transaction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">From Wallet</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {solanaPayments.map(payment => (
                      <tr key={payment.id} className="hover:bg-gray-800/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-mono text-white">
                              {payment.signature.slice(0, 8)}...{payment.signature.slice(-8)}
                            </p>
                            <button
                              onClick={() => copyToClipboard(payment.signature)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono text-gray-300">
                            {payment.from_wallet.slice(0, 6)}...{payment.from_wallet.slice(-4)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-white">
                            {payment.amount} {payment.token_symbol}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {payment.verification_status === 'confirmed' ? (
                            <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full inline-flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" /> Confirmed
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-full inline-flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-400">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {payment.verification_status === 'pending' && (
                              <button
                                onClick={() => verifySolanaTransaction(payment.signature, payment.order_id)}
                                disabled={verifyingPayment === payment.signature}
                                className="px-3 py-1 bg-purple-500 hover:bg-purple-400 text-white text-sm rounded transition-colors disabled:opacity-50"
                              >
                                {verifyingPayment === payment.signature ? 'Verifying...' : 'Verify'}
                              </button>
                            )}
                            <a
                              href={`https://solscan.io/tx/${payment.signature}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {solanaPayments.length === 0 && (
                  <div className="text-center py-12">
                    <Bitcoin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No Solana payments yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* E-Transfer Payments */}
          {activeTab === 'etransfer' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">E-Transfer Payments</h2>
                <button
                  onClick={() => setShowETransferForm(!showETransferForm)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-colors"
                >
                  + Record E-Transfer
                </button>
              </div>

              {/* E-Transfer Form */}
              {showETransferForm && (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Record E-Transfer Payment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Order Number (e.g., ORD-001)"
                      value={etransferForm.order_number}
                      onChange={(e) => setEtransferForm({...etransferForm, order_number: e.target.value})}
                      className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      placeholder="Reference Number"
                      value={etransferForm.reference_number}
                      onChange={(e) => setEtransferForm({...etransferForm, reference_number: e.target.value})}
                      className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
                    />
                    <input
                      type="email"
                      placeholder="Sender Email"
                      value={etransferForm.sender_email}
                      onChange={(e) => setEtransferForm({...etransferForm, sender_email: e.target.value})}
                      className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      placeholder="Sender Name"
                      value={etransferForm.sender_name}
                      onChange={(e) => setEtransferForm({...etransferForm, sender_name: e.target.value})}
                      className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={etransferForm.amount}
                      onChange={(e) => setEtransferForm({...etransferForm, amount: e.target.value})}
                      className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
                    />
                    <select
                      value={etransferForm.currency}
                      onChange={(e) => setEtransferForm({...etransferForm, currency: e.target.value})}
                      className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
                    >
                      <option value="CAD">CAD</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={recordETransfer}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"
                    >
                      Record Payment
                    </button>
                    <button
                      onClick={() => setShowETransferForm(false)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* E-Transfer List */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Sender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {etransferPayments.map(payment => (
                      <tr key={payment.id} className="hover:bg-gray-800/30">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-white">{payment.reference_number}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-white">{payment.sender_name}</p>
                            <p className="text-xs text-gray-400">{payment.sender_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-white">
                            ${payment.amount} {payment.currency}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-400">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {etransferPayments.length === 0 && (
                  <div className="text-center py-12">
                    <ArrowRightLeft className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No e-transfer payments recorded</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stripe Payments */}
          {activeTab === 'stripe' && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
              <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Stripe Payments</h3>
              <p className="text-gray-400">
                Stripe payments are automatically processed and verified.
                Check the Orders page for Stripe payment details.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}