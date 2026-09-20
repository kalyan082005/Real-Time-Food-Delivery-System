import React from 'react'
import { CreditCard, Smartphone, Banknote, Shield, AlertCircle } from 'lucide-react'

const PaymentSummary = ({ 
  paymentMethod, 
  selectedCard, 
  orderTotal, 
  processingFee = 0,
  onProcessPayment,
  isProcessing = false 
}) => {
  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case 'card':
        return <CreditCard className="h-5 w-5 text-primary-600" />
      case 'digital_wallet':
        return <Smartphone className="h-5 w-5 text-primary-600" />
      case 'cash':
        return <Banknote className="h-5 w-5 text-primary-600" />
      default:
        return <CreditCard className="h-5 w-5 text-gray-400" />
    }
  }

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'card':
        return selectedCard ? `Card ending in ${selectedCard.lastFour}` : 'Credit/Debit Card'
      case 'digital_wallet':
        return 'Digital Wallet'
      case 'cash':
        return 'Cash on Delivery'
      default:
        return 'Select Payment Method'
    }
  }

  const totalAmount = orderTotal + processingFee

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Summary</h3>
      
      {/* Selected Payment Method */}
      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg mb-6">
        {getPaymentIcon()}
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">
            {getPaymentMethodName()}
          </div>
          {selectedCard && (
            <div className="text-sm text-gray-600">
              {selectedCard.brand.toUpperCase()} • Expires {selectedCard.expiryMonth}/{selectedCard.expiryYear}
            </div>
          )}
        </div>
      </div>

      {/* Order Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Order Total</span>
          <span className="text-gray-900">${orderTotal.toFixed(2)}</span>
        </div>
        
        {processingFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Processing Fee</span>
            <span className="text-gray-900">${processingFee.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span className="text-gray-900">Total to Pay</span>
            <span className="text-gray-900">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg mb-6">
        <Shield className="h-5 w-5 text-green-600 mt-0.5" />
        <div>
          <div className="text-sm font-medium text-green-800">Secure Payment</div>
          <div className="text-sm text-green-700">
            Your payment is protected by 256-bit SSL encryption
          </div>
        </div>
      </div>

      {/* Cash on Delivery Notice */}
      {paymentMethod === 'cash' && (
        <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-yellow-800">Cash Payment</div>
            <div className="text-sm text-yellow-700">
              Please have exact change ready. Amount: ${totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Payment Terms */}
      <div className="text-xs text-gray-500 mb-6">
        By completing this payment, you agree to our{' '}
        <a href="/terms" className="text-primary-600 hover:text-primary-700">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-primary-600 hover:text-primary-700">
          Privacy Policy
        </a>
        . Your order will be processed immediately after payment confirmation.
      </div>

      {/* Process Payment Button */}
      <button
        onClick={onProcessPayment}
        disabled={isProcessing || !paymentMethod}
        className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing Payment...</span>
          </div>
        ) : paymentMethod === 'cash' ? (
          `Place Order - ${getPaymentMethodName()}`
        ) : (
          `Pay $${totalAmount.toFixed(2)}`
        )}
      </button>

      {/* Payment Methods Accepted */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center mb-3">
          We accept
        </div>
        <div className="flex justify-center space-x-4">
          <div className="text-2xl">💳</div>
          <div className="text-2xl">📱</div>
          <div className="text-2xl">💵</div>
        </div>
        <div className="flex justify-center space-x-4 mt-2">
          <span className="text-xs text-gray-500">Cards</span>
          <span className="text-xs text-gray-500">Digital</span>
          <span className="text-xs text-gray-500">Cash</span>
        </div>
      </div>
    </div>
  )
}

export default PaymentSummary