import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authAPI from '../../services/authAPI'

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials) // Call login API
      // Backend returns { success, message, data: { user, token } }
      const { user, token } = response.data.data || response.data
      localStorage.setItem('token', token) // Store JWT token
      return { user, token } // Return user data and token
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed') // Handle login errors
    }
  }
)

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData) // Call registration API
      return response.data // Return registration response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed') // Handle registration errors
    }
  }
)

// Async thunk for updating user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData) // Call profile update API
      return response.data // Return updated user data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed') // Handle update errors
    }
  }
)

// Async thunk for loading user from token
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') // Get token from localStorage
      if (!token) {
        throw new Error('No token found') // No token available
      }
      const response = await authAPI.getCurrentUser() // Get current user data
      return response.data // Return user data
    } catch (error) {
      localStorage.removeItem('token') // Remove invalid token
      return rejectWithValue('Session expired') // Handle token validation errors
    }
  }
)

// Try to decode user from stored token on startup
const getInitialUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    if (payload.exp * 1000 > Date.now()) {
      return { id: payload.sub || payload.userId, email: payload.email, role: payload.role };
    }
    localStorage.removeItem('token');
    return null;
  } catch { return null; }
};

const initialState = {
  user: getInitialUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!getInitialUser(),
  isLoading: false,
  error: null,
  registrationSuccess: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear any auth errors
    clearError: (state) => {
      state.error = null
    },
    // Clear registration success flag
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false
    },
    // Logout user and clear all auth data
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token') // Remove token from localStorage
    },
    // Set authentication from stored token (for app initialization)
    setAuthFromToken: (state) => {
      const token = localStorage.getItem('token')
      if (token) {
        state.token = token
        // Note: User data will be loaded via loadUser thunk
      }
    },
    // Set user data from token (for app initialization)
    setUserFromToken: (state, action) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Login user cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
      // Register user cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.registrationSuccess = false
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
        state.registrationSuccess = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.registrationSuccess = false
      })
      
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Load user cases
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearRegistrationSuccess, logout, setAuthFromToken, setUserFromToken } = authSlice.actions
export default authSlice.reducer