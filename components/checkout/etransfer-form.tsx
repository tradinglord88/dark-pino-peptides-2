'use client'

interface ETransferFormProps {
  amount: number
  onSuccess: (reference: string) => void
  onError: (error: string) => void
}

export function ETransferForm({ amount, onSuccess }: ETransferFormProps) {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('payments@darkpinopeptides.com')
    // You could add a toast notification here
  }

  const handleCopyReference = () => {
    const reference = `ORDER-${Date.now()}`
    navigator.clipboard.writeText(reference)
    // You could add a toast notification here
  }

  return (
    <div className="text-center p-6">
      <h3 className="text-lg font-semibold text-white mb-4">E-Transfer Payment</h3>
      
      <div className="bg-gray-700/50 p-6 rounded-lg mb-6">
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Send E-Transfer To:
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-3 bg-gray-800 rounded text-white text-sm">
                payments@darkpinopeptides.com
              </code>
              <button
                onClick={handleCopyEmail}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount:
            </label>
            <div className="p-3 bg-gray-800 rounded text-white font-semibold">
              ${amount.toFixed(2)} CAD
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reference (include in message):
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-3 bg-gray-800 rounded text-white text-sm">
                ORDER-{Date.now()}
              </code>
              <button
                onClick={handleCopyReference}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
        <h4 className="text-blue-300 font-semibold mb-2">📧 E-Transfer Instructions</h4>
        <ol className="text-blue-200 text-sm text-left space-y-1">
          <li>1. Log into your online banking</li>
          <li>2. Go to &quot;Send Money&quot; or &quot;Interac e-Transfer&quot;</li>
          <li>3. Use the email address above</li>
          <li>4. Enter the exact amount: ${amount.toFixed(2)}</li>
          <li>5. Include the reference number in the message</li>
          <li>6. Send the e-Transfer</li>
        </ol>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onSuccess(`etransfer-${Date.now()}`)}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          I&apos;ve Sent the E-Transfer
        </button>
        
        <p className="text-xs text-gray-400">
          Your order will be processed once we receive and verify the e-Transfer.
          This usually takes 1-2 business hours during business days.
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        <p className="mb-1">💡 Auto-deposit is enabled - no security question needed</p>
        <p>🇨🇦 Available for Canadian bank accounts only</p>
      </div>
    </div>
  )
}