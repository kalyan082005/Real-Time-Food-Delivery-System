import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import addressAPI from '../../services/addressAPI'

// Async thunk for getting user addresses
export const getUserAddresses = createAsyncThunk(
  'addresses/getUserAddresses',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await addressAPI.getUserAddresses(userId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load addresses')
    }
  }
)

// Async thunk for creating address
export const createAddress = createAsyncThunk(
  'addresses/createAddress',
  async ({ userId, addressData }, { rejectWithValue }) => {
    try {
      const response = await addressAPI.createAddress(userId, addressData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create address')
    }
  }
)

// Async thunk for updating address
export const updateAddress = createAsyncThunk(
  'addresses/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const response = await addressAPI.updateAddress(addressId, addressData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update address')
    }
  }
)

// Async thunk for setting default address
export const setDefaultAddress = createAsyncThunk(
  'addresses/setDefaultAddress',
  async ({ addressId, userId }, { rejectWithValue }) => {
    try {
      const response = await addressAPI.setDefaultAddress(addressId, userId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set default address')
    }
  }
)

// Async thunk for deleting address
export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      await addressAPI.deleteAddress(addressId)
      return addressId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete address')
    }
  }
)

const initialState = {
  addresses: [],
  currentAddress: null,
  isLoading: false,
  error: null
}

const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Get user addresses
      .addCase(getUserAddresses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getUserAddresses.fulfilled, (state, action) => {
        state.isLoading = false
        state.addresses = action.payload
        state.error = null
      })
      .addCase(getUserAddresses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Create address
      .addCase(createAddress.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.isLoading = false
        state.addresses.push(action.payload)
        state.error = null
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.addresses.findIndex(addr => addr.id === action.payload.id)
        if (index !== -1) {
          state.addresses[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Set default address
      .addCase(setDefaultAddress.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.isLoading = false
        // Update all addresses - set new default and unset others
        state.addresses = state.addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === action.payload.id
        }))
        state.error = null
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload)
        state.error = null
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError, setCurrentAddress } = addressSlice.actions
export default addressSlice.reducer
