import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CreditCard, Lock, Calendar, Hash, User } from 'lucide-react'

// Validation schema for card form
const cardSchema = yup.object({
  cardNumber: yup
    .string()
    .matches(/^[0-9\s]{13,19}$/, 'Please enter a valid card number')
    .required('Card number is required'),
  expiryDate: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Please enter MM/YY format')
    .required('Expiry date is required'),
  cvv: yup
    .string()
    .matches(/^[0-9]{3,4}$/, 'Please enter a valid CVV')
    .required('CVV is required'),
  cardholderName: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Cardholder name is required'),
  saveCard: yup.boolean()
})

const CardForm = ({ onSubmit, onCancel, isLoading = false }) => {
  const [cardType, setCardType] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(cardSchema),
    defaultValues: {
      saveCard: false
    }
  })

  const cardNumber = watch('cardNumber')

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  // Detect card type
  const detectCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '')
    
    if (/^4/.test(cleanNumber)) return 'visa'
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard'
    if (/^3[47]/.test(cleanNumber)) return 'amex'
    if (/^6/.test(cleanNumber)) return 'discover'
    
    return ''
  }

  // Handle card number change
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setValue('cardNumber', formatted)
    setCardType(detectCardType(formatted))
  }

  // Handle expiry date change
  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value)
    setValue('expiryDate', formatted)
  }

  const onFormSubmit = (data) => {
    // Clean card number for submission
    const cleanCardNumber = data.cardNumber.replace(/\s/g, '')
    onSubmit({
      ...data,
      cardNumber: cleanCardNumber,
      cardType
    })
  }

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return '💳'
      case 'mastercard':
        return '💳'
      case 'amex':
        return '💳'
      case 'discover':
        return '💳'
      default:
        return <CreditCard className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Add Payment Card</h3>
        <div className="flex items-center space-x-2">
          <Lock className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-600">Secure</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <div className="relative">
            <input
              {...register('cardNumber')}
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              onChange={handleCardNumberChange}
              className={`
                w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
                ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getCardIcon()}
            </div>
          </div>
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <div className="relative">
              <input
                {...register('expiryDate')}
                type="text"
                placeholder="MM/YY"
                maxLength="5"
                onChange={handleExpiryChange}
                className={`
                  w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
                  ${errors.expiryDate ? 'border-red-300' : 'border-gray-300'}
                `}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
            )}
          </div>

          {/* CVV */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <div className="relative">
              <input
                {...register('cvv')}
                type="text"
                placeholder="123"
                maxLength="4"
                className={`
                  w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
                  ${errors.cvv ? 'border-red-300' : 'border-gray-300'}
                `}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
            )}
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <div className="relative">
            <input
              {...register('cardholderName')}
              type="text"
              placeholder="John Doe"
              className={`
                w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
                ${errors.cardholderName ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <User className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {errors.cardholderName && (
            <p className="mt-1 text-sm text-red-600">{errors.cardholderName.message}</p>
          )}
        </div>

        {/* Save Card Option */}
        <div className="flex items-center">
          <input
            {...register('saveCard')}
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Save this card for future purchases
          </label>
        </div>

        {/* Security Notice */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Secure Payment</h4>
              <p className="text-sm text-gray-600 mt-1">
                Your payment information is encrypted and secure. We never store your full card details.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Adding Card...' : 'Add Card'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CardForm