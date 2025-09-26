'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Wallet } from 'lucide-react'
import { useCallback } from 'react'

export function WalletButton() {
  const { wallet, publicKey, disconnect, connecting } = useWallet()
  const { setVisible } = useWalletModal()

  const handleWalletClick = useCallback(() => {
    if (!wallet) {
      setVisible(true)
    } else {
      disconnect()
    }
  }, [wallet, setVisible, disconnect])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <button
      onClick={handleWalletClick}
      disabled={connecting}
      className="flex items-center space-x-2 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all duration-200"
    >
      <Wallet size={18} className="text-white" />
      <span className="hidden sm:block text-white font-medium">
        {connecting ? 'Connecting...' : 
         publicKey ? formatAddress(publicKey.toString()) : 
         'Wallet'}
      </span>
    </button>
  )
}