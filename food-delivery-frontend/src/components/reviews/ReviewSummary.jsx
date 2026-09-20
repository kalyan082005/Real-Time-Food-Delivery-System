import React from 'react'
import { Star } from 'lucide-react'
import { DisplayRating } from './StarRating'

const ReviewSummary = ({ 
  averageRating = 0, 
  totalReviews = 0, 
  ratingDistribution = {},
  className = '' 
}) => {
  // Default rating distribution if not provided
  const defaultDistribution = {
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  }
  
  const distribution = { ...defaultDistribution, ...ratingDistribution }
  
  // Calculate percentages
  const getPercentage = (count) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0
  }

  const ratingLabels = {
    5: 'Excellent',
    4: 'Very Good', 
    3: 'Good',
    2: 'Fair',
    1: 'Poor'
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Reviews</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <DisplayRating rating={averageRating} reviewCount={0} size="lg" />
          <p className="text-sm text-gray-600 mt-2">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating] || 0
            const percentage = getPercentage(count)
            
            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm text-gray-600">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="w-12 text-right">
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Rating Breakdown */}
      {totalReviews > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = distribution[rating] || 0
              const percentage = getPercentage(count)
              
              return (
                <div key={rating} className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {percentage.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {ratingLabels[rating]}
                  </div>
                  <div className="text-xs text-gray-500">
                    ({count} {count === 1 ? 'review' : 'reviews'})
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {totalReviews > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600">
                {getPercentage(distribution[5] + distribution[4]).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Positive</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-yellow-600">
                {getPercentage(distribution[3]).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Neutral</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-red-600">
                {getPercentage(distribution[2] + distribution[1]).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Negative</div>
            </div>
          </div>
        </div>
      )}

      {/* No Reviews State */}
      {totalReviews === 0 && (
        <div className="text-center py-8">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
          <p className="text-gray-600">
            Be the first to share your experience!
          </p>
        </div>
      )}
    </div>
  )
}

export default ReviewSummary