  import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8088') + '/api', // Backend API base URL
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Get JWT token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Add Bearer token to headers
    }
    return config
  },
  (error) => {
    return Promise.reject(error) // Handle request errors
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response // Return successful responses as-is
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token')
          toast.error('Session expired. Please login again.')
          window.location.href = '/login'
          break
          
        case 403:
          // Forbidden - user doesn't have permission
          toast.error('You do not have permission to perform this action.')
          break
          
        case 404:
          // Not found
          toast.error('The requested resource was not found.')
          break
          
        case 422:
          // Validation error
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach(err => toast.error(err.message))
          } else {
            toast.error(data.message || 'Validation error occurred.')
          }
          break
          
        case 500:
          // Server error
          toast.error('Server error occurred. Please try again later.')
          break
          
        default:
          // Other errors
          toast.error(data.message || 'An unexpected error occurred.')
      }
    } else if (error.request) {
      // Network error - no response received
      toast.error('Network error. Please check your connection.')
    } else {
      // Other errors
      toast.error('An unexpected error occurred.')
    }
    
    return Promise.reject(error) // Always reject to allow component-level error handling
  }
)

// Helper function to handle file uploads
export const uploadFile = async (file, endpoint) => {
  const formData = new FormData()
  formData.append('file', file) // Append file to form data
  
  return api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Set content type for file upload
    },
  })
}

// Helper function for GET requests with query parameters
export const getWithParams = (endpoint, params = {}) => {
  return api.get(endpoint, { params }) // Add query parameters to GET request
}

// Helper function for paginated requests
export const getPaginated = (endpoint, page = 1, limit = 10, params = {}) => {
  return api.get(endpoint, {
    params: {
      page,
      limit,
      ...params
    }
  })
}

export default api