import axios from 'axios'
import store from '../store'
import { logout } from '../store/slices/authSlice'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8088/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      store.dispatch(logout())
      // Redirect to login page
      window.location.href = '/login'
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.'
    }
    
    return Promise.reject(error)
  }
)

// API service methods
const apiService = {
  // Authentication endpoints
  auth: {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    refreshToken: () => api.post('/auth/refresh'),
    updateProfile: (profileData) => api.put('/auth/profile', profileData),
    changePassword: (passwordData) => api.put('/auth/password', passwordData),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (resetData) => api.post('/auth/reset-password', resetData),
    verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  },

  // Restaurant endpoints
  restaurants: {
    search: (params) => api.get('/restaurants/search', { params }),
    getById: (id) => api.get(`/restaurants/${id}`),
    getMenu: (id) => api.get(`/restaurants/${id}/menu`),
    getFeatured: () => api.get('/restaurants/featured'),
    getByLocation: (location) => api.get('/restaurants/by-location', { params: { location } }),
    getCuisines: () => api.get('/restaurants/cuisines'),
    getReviews: (id, params) => api.get(`/restaurants/${id}/reviews`, { params }),
    addReview: (id, reviewData) => api.post(`/restaurants/${id}/reviews`, reviewData),
  },

  // Order endpoints
  orders: {
    create: (orderData) => api.post('/orders', orderData),
    getHistory: (params) => api.get('/orders/history', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    track: (id) => api.get(`/orders/${id}/track`),
    cancel: (id) => api.put(`/orders/${id}/cancel`),
    rate: (id, ratingData) => api.post(`/orders/${id}/rate`, ratingData),
    getActive: () => api.get('/orders/active'),
  },

  // Cart endpoints
  cart: {
    validate: (cartData) => api.post('/cart/validate', cartData),
    calculateDelivery: (addressData) => api.post('/cart/calculate-delivery', addressData),
  },

  // Payment endpoints
  payment: {
    createIntent: (paymentData) => api.post('/payment/create-intent', paymentData),
    confirm: (paymentIntentId) => api.post('/payment/confirm', { paymentIntentId }),
    getMethods: () => api.get('/payment/methods'),
    addMethod: (methodData) => api.post('/payment/methods', methodData),
    removeMethod: (methodId) => api.delete(`/payment/methods/${methodId}`),
    processRefund: (orderId) => api.post(`/payment/refund`, { orderId }),
  },

  // User profile endpoints
  profile: {
    get: () => api.get('/profile'),
    update: (profileData) => api.put('/profile', profileData),
    getAddresses: () => api.get('/profile/addresses'),
    addAddress: (addressData) => api.post('/profile/addresses', addressData),
    updateAddress: (id, addressData) => api.put(`/profile/addresses/${id}`, addressData),
    deleteAddress: (id) => api.delete(`/profile/addresses/${id}`),
    setDefaultAddress: (id) => api.put(`/profile/addresses/${id}/default`),
  },

  // Notification endpoints
  notifications: {
    get: (params) => api.get('/notifications', { params }),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    updatePreferences: (preferences) => api.put('/notifications/preferences', preferences),
    getPreferences: () => api.get('/notifications/preferences'),
  },

  // Search and discovery endpoints
  search: {
    restaurants: (query, params) => api.get('/search/restaurants', { params: { query, ...params } }),
    dishes: (query, params) => api.get('/search/dishes', { params: { query, ...params } }),
    suggestions: (query) => api.get('/search/suggestions', { params: { query } }),
    popular: () => api.get('/search/popular'),
  },

  // Location endpoints
  location: {
    geocode: (address) => api.get('/location/geocode', { params: { address } }),
    reverseGeocode: (lat, lng) => api.get('/location/reverse-geocode', { params: { lat, lng } }),
    getDeliveryZones: (restaurantId) => api.get(`/location/delivery-zones/${restaurantId}`),
    validateAddress: (address) => api.post('/location/validate-address', address),
  },

  // Admin endpoints (for admin users)
  admin: {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: (params) => api.get('/admin/users', { params }),
    getRestaurants: (params) => api.get('/admin/restaurants', { params }),
    getOrders: (params) => api.get('/admin/orders', { params }),
    getAnalytics: (params) => api.get('/admin/analytics', { params }),
    updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, { status }),
    updateRestaurantStatus: (restaurantId, status) => api.put(`/admin/restaurants/${restaurantId}/status`, { status }),
  },

  // Restaurant management endpoints (for restaurant owners)
  restaurantManagement: {
    getProfile: () => api.get('/restaurant-management/profile'),
    updateProfile: (profileData) => api.put('/restaurant-management/profile', profileData),
    getMenu: () => api.get('/restaurant-management/menu'),
    addMenuItem: (itemData) => api.post('/restaurant-management/menu', itemData),
    updateMenuItem: (itemId, itemData) => api.put(`/restaurant-management/menu/${itemId}`, itemData),
    deleteMenuItem: (itemId) => api.delete(`/restaurant-management/menu/${itemId}`),
    getOrders: (params) => api.get('/restaurant-management/orders', { params }),
    updateOrderStatus: (orderId, status) => api.put(`/restaurant-management/orders/${orderId}/status`, { status }),
    getAnalytics: (params) => api.get('/restaurant-management/analytics', { params }),
  },

  // Delivery partner endpoints (for delivery partners)
  delivery: {
    getProfile: () => api.get('/delivery/profile'),
    updateProfile: (profileData) => api.put('/delivery/profile', profileData),
    getAvailableOrders: (params) => api.get('/delivery/available-orders', { params }),
    acceptOrder: (orderId) => api.post(`/delivery/orders/${orderId}/accept`),
    updateOrderStatus: (orderId, status) => api.put(`/delivery/orders/${orderId}/status`, { status }),
    updateLocation: (locationData) => api.put('/delivery/location', locationData),
    getEarnings: (params) => api.get('/delivery/earnings', { params }),
    setAvailability: (isAvailable) => api.put('/delivery/availability', { isAvailable }),
  },
}

export default apiService