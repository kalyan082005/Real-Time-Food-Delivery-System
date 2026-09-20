import React, { useState } from 'react'
import { Star } from 'lucide-react'

const StarRating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 'md', 
  interactive = false, 
  onRatingChange,
  showValue = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  }

  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  const getStarColor = (index) => {
    const currentRating = interactive ? (hoverRating || rating) : rating
    
    if (index <= currentRating) {
      return 'text-yellow-400 fill-current'
    } else if (index - 0.5 <= currentRating) {
      return 'text-yellow-400 fill-current opacity-50'
    } else {
      return 'text-gray-300'
    }
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
              className={`
                ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                transition-transform duration-150
                ${interactive ? '' : 'pointer-events-none'}
              `}
            >
              <Star 
                className={`
                  ${sizeClasses[size]} 
                  ${getStarColor(starValue)}
                  transition-colors duration-150
                `}
              />
            </button>
          )
        })}
      </div>
      
      {showValue && (
        <span className="text-sm font-medium text-gray-700 ml-2">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

// Preset component for display-only ratings
export const DisplayRating = ({ rating, reviewCount, size = 'md', className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <StarRating rating={rating} size={size} />
      <span className="text-sm text-gray-600">
        {rating.toFixed(1)} ({reviewCount} reviews)
      </span>
    </div>
  )
}

// Preset component for interactive rating input
export const RatingInput = ({ rating, onRatingChange, label, required = false }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <StarRating 
        rating={rating} 
        interactive={true} 
        onRatingChange={onRatingChange}
        size="lg"
      />
      <p className="text-xs text-gray-500">
        Click to rate from 1 to 5 stars
      </p>
    </div>
  )
}

export default StarRating