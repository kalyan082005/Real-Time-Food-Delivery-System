import api from './api'

const authAPI = {
  // User registration
  register: (userData) => {
    return api.post('/auth/register', {
      name: userData.name,           // User's full name
      email: userData.email,         // User's email address
      password: userData.password,   // User's password
      phone: userData.phone,         // User's phone number
      role: userData.role || 'CUSTOMER', // User role (default: CUSTOMER)
      address: userData.address      // User's address information
    })
  },

  // User login
  login: (credentials) => {
    return api.post('/auth/login', {
      email: credentials.email,      // User's email
      password: credentials.password // User's password
    })
  },

  // Get current user profile
  getCurrentUser: () => {
    return api.get('/auth/me') // Get authenticated user's profile
  },

  // Update user profile
  updateProfile: (profileData) => {
    return api.put('/auth/profile', {
      name: profileData.name,        // Updated name
      phone: profileData.phone,      // Updated phone
      email: profileData.email,      // Updated email
      address: profileData.address   // Updated address
    })
  },

  // Change password
  changePassword: (passwordData) => {
    return api.put('/auth/change-password', {
      currentPassword: passwordData.currentPassword, // Current password for verification
      newPassword: passwordData.newPassword         // New password
    })
  },

  // Request password reset
  requestPasswordReset: (email) => {
    return api.post('/auth/forgot-password', {
      email: email // Email to send reset link to
    })
  },

  // Reset password with token
  resetPassword: (resetData) => {
    return api.post('/auth/reset-password', {
      token: resetData.token,        // Password reset token
      newPassword: resetData.newPassword // New password
    })
  },

  // Verify email address
  verifyEmail: (token) => {
    return api.post('/auth/verify-email', {
      token: token // Email verification token
    })
  },

  // Resend email verification
  resendVerification: (email) => {
    return api.post('/auth/resend-verification', {
      email: email // Email to resend verification to
    })
  },

  // Refresh JWT token
  refreshToken: () => {
    return api.post('/auth/refresh-token') // Refresh the current JWT token
  },

  // Logout user (invalidate token on server)
  logout: () => {
    return api.post('/auth/logout') // Logout and invalidate server-side session
  },

  // Delete user account
  deleteAccount: (password) => {
    return api.delete('/auth/account', {
      data: { password: password } // Require password confirmation for account deletion
    })
  },

  // Update notification preferences
  updateNotificationPreferences: (preferences) => {
    return api.put('/auth/notification-preferences', {
      emailNotifications: preferences.emailNotifications,     // Email notification setting
      pushNotifications: preferences.pushNotifications,       // Push notification setting
      orderUpdates: preferences.orderUpdates,                 // Order update notifications
      promotions: preferences.promotions                       // Promotional notifications
    })
  },

  // Get user's addresses
  getAddresses: () => {
    return api.get('/auth/addresses') // Get all saved addresses for user
  },

  // Add new address
  addAddress: (addressData) => {
    return api.post('/auth/addresses', {
      type: addressData.type,        // Address type (home, work, other)
      street: addressData.street,    // Street address
      city: addressData.city,        // City
      state: addressData.state,      // State/Province
      zipCode: addressData.zipCode,  // ZIP/Postal code
      country: addressData.country,  // Country
      latitude: addressData.latitude, // GPS latitude
      longitude: addressData.longitude, // GPS longitude
      isDefault: addressData.isDefault || false // Set as default address
    })
  },

  // Update existing address
  updateAddress: (addressId, addressData) => {
    return api.put(`/auth/addresses/${addressId}`, {
      type: addressData.type,
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      country: addressData.country,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      isDefault: addressData.isDefault
    })
  },

  // Delete address
  deleteAddress: (addressId) => {
    return api.delete(`/auth/addresses/${addressId}`) // Delete specific address
  },

  // Set default address
  setDefaultAddress: (addressId) => {
    return api.put(`/auth/addresses/${addressId}/default`) // Set address as default
  }
}

export default authAPI