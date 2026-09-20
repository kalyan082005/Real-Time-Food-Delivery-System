import api from './api'

const addressAPI = {
  // Get all addresses for a user
  getUserAddresses: (userId) => {
    return api.get(`/addresses/user/${userId}`)
  },

  // Get single address by ID
  getAddressById: (addressId) => {
    return api.get(`/addresses/${addressId}`)
  },

  // Create new address
  createAddress: (userId, addressData) => {
    return api.post(`/addresses/user/${userId}`, {
      addressLine: addressData.addressLine,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      isDefault: addressData.isDefault || false
    })
  },

  // Update existing address
  updateAddress: (addressId, addressData) => {
    return api.put(`/addresses/${addressId}`, {
      addressLine: addressData.addressLine,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      isDefault: addressData.isDefault
    })
  },

  // Set address as default
  setDefaultAddress: (addressId, userId) => {
    return api.put(`/addresses/${addressId}/default`, { userId })
  },

  // Delete address
  deleteAddress: (addressId) => {
    return api.delete(`/addresses/${addressId}`)
  }
}

export default addressAPI
