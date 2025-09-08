'use client'

interface SolanaPaySimpleProps {
  amount: number
  onSuccess: (signature: string) => void
  onError: (error: string) => void
}

export function SolanaPaySimple({ amount, onSuccess, onError }: SolanaPaySimpleProps) {
  console.log('SolanaPaySimple component rendered!')
  console.log('Amount:', amount)

  return (
    <div className="text-center p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Solana Pay (Test Mode)</h3>
      
      <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Amount:</span>
          <span className="font-semibold">${amount.toFixed(2)} USD</span>
        </div>
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Token:</span>
          <span>USDC</span>
        </div>
        <div className="flex justify-between text-sm text-gray-300">
          <span>Network:</span>
          <span>Solana</span>
        </div>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-4">
        <p className="text-yellow-300 text-sm">
          ⚠️ Solana Pay is in test mode. Component loaded successfully!
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onSuccess('test-signature-123')}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          Test Success
        </button>
        
        <button
          onClick={() => onError('Test error message')}
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          Test Error
        </button>
      </div>

      <div className="text-xs text-gray-400 mt-4">
        <p className="mb-1">This is a test version to verify the component loads properly.</p>
        <p>Check the console for debug information.</p>
      </div>
    </div>
  )
}