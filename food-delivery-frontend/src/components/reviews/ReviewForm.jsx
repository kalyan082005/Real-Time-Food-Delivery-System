import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Camera, X } from 'lucide-react'
import { RatingInput } from './StarRating'

// Validation schema
const reviewSchema = yup.object({
  rating: yup
    .number()
    .min(1, 'Please provide a rating')
    .max(5, 'Rating cannot exceed 5 stars')
    .required('Rating is required'),
  title: yup
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .required('Review title is required'),
  comment: yup
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review cannot exceed 1000 characters')
    .required('Review comment is required'),
  wouldRecommend: yup.boolean()
})

const ReviewForm = ({ 
  restaurantId, 
  orderId, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  initialData = null 
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0)
  const [uploadedImages, setUploadedImages] = useState(initialData?.images || [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      title: initialData?.title || '',
      comment: initialData?.comment || '',
      wouldRecommend: initialData?.wouldRecommend || false
    }
  })

  const comment = watch('comment')
  const title = watch('title')

  const handleRatingChange = (newRating) => {
    setRating(newRating)
  }

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result
          }])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId))
  }

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      rating,
      restaurantId,
      orderId,
      images: uploadedImages
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
        <p className="text-sm text-gray-600 mt-1">
          Share your experience to help other customers
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Rating */}
        <div>
          <RatingInput
            rating={rating}
            onRatingChange={handleRatingChange}
            label="Overall Rating"
            required={true}
          />
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
          )}
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Review Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title')}
            type="text"
            placeholder="Summarize your experience in a few words"
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              ${errors.title ? 'border-red-300' : 'border-gray-300'}
            `}
          />
          <div className="flex justify-between mt-1">
            {errors.title ? (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            ) : (
              <p className="text-sm text-gray-500">Make it descriptive and helpful</p>
            )}
            <span className="text-sm text-gray-400">{title?.length || 0}/100</span>
          </div>
        </div>

        {/* Review Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('comment')}
            rows={4}
            placeholder="Tell us about your experience with the food, delivery, and service..."
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none
              ${errors.comment ? 'border-red-300' : 'border-gray-300'}
            `}
          />
          <div className="flex justify-between mt-1">
            {errors.comment ? (
              <p className="text-sm text-red-600">{errors.comment.message}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Share details about food quality, delivery time, packaging, etc.
              </p>
            )}
            <span className="text-sm text-gray-400">{comment?.length || 0}/1000</span>
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          
          {/* Upload Button */}
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Camera className="h-4 w-4 mr-2" />
              Upload Photos
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-500">
              Up to 5 photos, max 5MB each
            </span>
          </div>

          {/* Image Previews */}
          {uploadedImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {uploadedImages.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.preview}
                    alt="Review"
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendation */}
        <div className="flex items-center">
          <input
            {...register('wouldRecommend')}
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            I would recommend this restaurant to others
          </label>
        </div>

        {/* Guidelines */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Review Guidelines</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Be honest and constructive in your feedback</li>
            <li>• Focus on your experience with the food and service</li>
            <li>• Avoid personal attacks or inappropriate language</li>
            <li>• Include specific details that would help other customers</li>
          </ul>
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
            disabled={isLoading || rating === 0}
            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm