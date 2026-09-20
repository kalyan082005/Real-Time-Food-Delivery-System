import React from 'react'

const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  // Size variants
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  // Color variants
  const colorClasses = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600',
    green: 'border-green-600',
    red: 'border-red-600',
  }

  return (
    <div className={`
      animate-spin rounded-full border-2 border-t-transparent
      ${sizeClasses[size]}
      ${colorClasses[color]}
      ${className}
    `} />
  )
}

// Full page loading component
export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  )
}

// Inline loading component
export const InlineLoader = ({ message = 'Loading...', className = '' }) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <LoadingSpinner size="sm" />
      <span className="text-gray-600 text-sm">{message}</span>
    </div>
  )
}

// Button loading component
export const ButtonLoader = ({ size = 'sm' }) => {
  return <LoadingSpinner size={size} color="white" />
}

export default LoadingSpinner