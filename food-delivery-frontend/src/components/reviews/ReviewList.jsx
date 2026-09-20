import React, { useState } from 'react'
import { ThumbsUp, ThumbsDown, Flag, MoreHorizontal, Calendar } from 'lucide-react'
import { DisplayRating } from './StarRating'

const ReviewList = ({ 
  reviews = [], 
  isLoading = false, 
  onLoadMore, 
  hasMore = false,
  onHelpfulClick,
  onReportClick 
}) => {
  const [expandedReviews, setExpandedReviews] = useState(new Set())
  const [sortBy, setSortBy] = useState('newest')

  const toggleExpanded = (reviewId) => {
    const newExpanded = new Set(expandedReviews)
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId)
    } else {
      newExpanded.add(reviewId)
    }
    setExpandedReviews(newExpanded)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rated' },
    { value: 'lowest', label: 'Lowest Rated' },
    { value: 'helpful', label: 'Most Helpful' }
  ]

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      case 'helpful':
        return (b.helpfulCount || 0) - (a.helpfulCount || 0)
      default:
        return 0
    }
  })

  if (isLoading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Sort */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Customer Reviews ({reviews.length})
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reviews */}
      {sortedReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600">
            Be the first to share your experience with this restaurant
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => {
            const isExpanded = expandedReviews.has(review.id)
            const shouldTruncate = review.comment.length > 200
            const displayComment = shouldTruncate && !isExpanded 
              ? review.comment.substring(0, 200) + '...' 
              : review.comment

            return (
              <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-medium text-sm">
                      {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {review.userName || 'Anonymous'}
                          </span>
                          {review.isVerifiedPurchase && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <DisplayRating rating={review.rating} reviewCount={0} size="sm" />
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{formatDate(review.createdAt)}</span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Review Title */}
                    {review.title && (
                      <h4 className="font-medium text-gray-900 mb-2">
                        {review.title}
                      </h4>
                    )}

                    {/* Review Content */}
                    <div className="text-gray-700 mb-4">
                      <p className="whitespace-pre-wrap">{displayComment}</p>
                      {shouldTruncate && (
                        <button
                          onClick={() => toggleExpanded(review.id)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {review.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt={`Review ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80"
                          />
                        ))}
                        {review.images.length > 3 && (
                          <div className="w-full h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-sm text-gray-600">
                            +{review.images.length - 3} more
                          </div>
                        )}
                      </div>
                    )}

                    {/* Restaurant Response */}
                    {review.restaurantResponse && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">Restaurant Response</span>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.restaurantResponse.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {review.restaurantResponse.message}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => onHelpfulClick?.(review.id, true)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Helpful ({review.helpfulCount || 0})</span>
                      </button>
                      
                      <button
                        onClick={() => onHelpfulClick?.(review.id, false)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>Not helpful</span>
                      </button>
                      
                      <button
                        onClick={() => onReportClick?.(review.id)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600"
                      >
                        <Flag className="h-4 w-4" />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewList