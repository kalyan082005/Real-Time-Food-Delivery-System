import React, { useState } from 'react'
import { CreditCard, Smartphone, Banknote, Plus } from 'lucide-react'

const PaymentMethodSelector = ({ 
  selectedMethod, 
  onMethodChange, 
  savedCards = [], 
  onAddCard 
}) => {
  const [showCardForm, setShowCardForm] = useState(false)

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay securely with your card'
    },
    {
      id: 'digital_wallet',
      name: 'Digital Wallet',
      icon: Smartphone,
      description: 'Apple Pay, Google Pay, etc.'
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      icon: Banknote,
      description: 'Pay when your order arrives'
    }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
      
      {/* Payment method options */}
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          return (
            <label
              key={method.id}
              className={`
                relative flex cursor-pointer rounded-lg border p-4 focus:outline-none
                ${selectedMethod === method.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
                }
              `}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => onMethodChange(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center w-full">
                <Icon className={`h-6 w-6 ${
                  selectedMethod === method.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {method.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {method.description}
                  </div>
                </div>
                <div className={`
                  h-4 w-4 rounded-full border-2 flex items-center justify-center
                  ${selectedMethod === method.id
                    ? 'border-primary-600'
                    : 'border-gray-300'
                  }
                `}>
                  {selectedMethod === method.id && (
                    <div className="h-2 w-2 rounded-full bg-primary-600" />
                  )}
                </div>
              </div>
            </label>
          )
        })}
      </div>

      {/* Saved cards section */}
      {selectedMethod === 'card' && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">Saved Cards</h4>
            <button
              onClick={() => setShowCardForm(true)}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Card</span>
            </button>
          </div>

          {savedCards.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
              <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No saved cards</p>
              <button
                onClick={() => setShowCardForm(true)}
                className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Add your first card
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {savedCards.map((card) => (
                <label
                  key={card.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="savedCard"
                    value={card.id}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        •••• •••• •••• {card.lastFour}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {card.brand.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Expires {card.expiryMonth}/{card.expiryYear}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Digital wallet options */}
      {selectedMethod === 'digital_wallet' && (
        <div className="mt-6 space-y-3">
          <h4 className="text-md font-medium text-gray-900">Choose Wallet</h4>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">Apple Pay</span>
            </button>
            <button className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">Google Pay</span>
            </button>
            <button className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">PayPal</span>
            </button>
            <button className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">Samsung Pay</span>
            </button>
          </div>
        </div>
      )}

      {/* Cash on delivery info */}
      {selectedMethod === 'cash' && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Banknote className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Cash on Delivery</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Please have exact change ready. Our delivery partner will collect the payment when your order arrives.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentMethodSelector