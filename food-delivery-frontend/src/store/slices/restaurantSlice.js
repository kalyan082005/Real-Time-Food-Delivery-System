import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import restaurantAPI from '../../services/restaurantAPI'

// Async thunk for getting all restaurants
export const getAllRestaurants = createAsyncThunk(
  'restaurants/getAllRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.getAllRestaurants() // Get all restaurants
      return response.data // Return restaurants
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load restaurants')
    }
  }
)

// Async thunk for searching restaurants
export const searchRestaurants = createAsyncThunk(
  'restaurants/searchRestaurants',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.searchRestaurants(searchParams) // Call restaurant search API
      return response.data // Return search results
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed') // Handle search errors
    }
  }
)

// Async thunk for getting restaurant details
export const getRestaurantDetails = createAsyncThunk(
  'restaurants/getRestaurantDetails',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.getRestaurantById(restaurantId) // Get restaurant details
      return response.data // Return restaurant data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load restaurant') // Handle fetch errors
    }
  }
)

// Async thunk for getting restaurant menu
export const getRestaurantMenu = createAsyncThunk(
  'restaurants/getRestaurantMenu',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.getRestaurantMenu(restaurantId) // Get restaurant menu
      return { restaurantId, menu: response.data } // Return restaurant ID and menu data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load menu') // Handle menu fetch errors
    }
  }
)

// Async thunk for getting featured restaurants
export const getFeaturedRestaurants = createAsyncThunk(
  'restaurants/getFeaturedRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.getFeaturedRestaurants() // Get featured restaurants
      return response.data // Return featured restaurants
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load featured restaurants') // Handle fetch errors
    }
  }
)

const initialState = {
  restaurants: [],           // List of restaurants from search
  featuredRestaurants: [],   // Featured restaurants for home page
  currentRestaurant: null,   // Currently selected restaurant details
  currentMenu: [],           // Menu items for current restaurant
  searchFilters: {           // Current search filters
    location: '',
    cuisine: '',
    priceRange: '',
    rating: '',
    deliveryTime: ''
  },
  isLoading: false,          // Loading state for restaurant operations
  isMenuLoading: false,      // Loading state specifically for menu
  error: null,               // Error message for restaurant operations
  hasSearched: false,        // Flag to track if user has performed a search
  totalResults: 0,           // Total number of search results
  currentPage: 1,            // Current page for pagination
}

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    // Update search filters
    updateSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload }
    },
    // Clear search results
    clearSearchResults: (state) => {
      state.restaurants = []
      state.hasSearched = false
      state.totalResults = 0
      state.currentPage = 1
    },
    // Clear current restaurant data
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null
      state.currentMenu = []
    },
    // Clear any restaurant errors
    clearError: (state) => {
      state.error = null
    },
    // Set current page for pagination
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    // Update menu item availability (for real-time updates)
    updateMenuItemAvailability: (state, action) => {
      const { itemId, isAvailable } = action.payload
      const menuItem = state.currentMenu.find(item => item.id === itemId)
      if (menuItem) {
        menuItem.isAvailable = isAvailable // Update availability status
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all restaurants cases
      .addCase(getAllRestaurants.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllRestaurants.fulfilled, (state, action) => {
        state.isLoading = false
        state.restaurants = Array.isArray(action.payload) ? action.payload : []
        state.totalResults = action.payload.length
        state.hasSearched = true
        state.error = null
      })
      .addCase(getAllRestaurants.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.hasSearched = true
      })
      
      // Search restaurants cases
      .addCase(searchRestaurants.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(searchRestaurants.fulfilled, (state, action) => {
        state.isLoading = false
        state.restaurants = Array.isArray(action.payload) ? action.payload : []
        state.totalResults = action.payload.length
        state.hasSearched = true
        state.error = null
      })
      .addCase(searchRestaurants.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.hasSearched = true
      })
      
      // Get restaurant details cases
      .addCase(getRestaurantDetails.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getRestaurantDetails.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentRestaurant = action.payload
        state.error = null
      })
      .addCase(getRestaurantDetails.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Get restaurant menu cases
      .addCase(getRestaurantMenu.pending, (state) => {
        state.isMenuLoading = true
        state.error = null
      })
      .addCase(getRestaurantMenu.fulfilled, (state, action) => {
        state.isMenuLoading = false
        state.currentMenu = action.payload.menu
        state.error = null
      })
      .addCase(getRestaurantMenu.rejected, (state, action) => {
        state.isMenuLoading = false
        state.error = action.payload
      })
      
      // Get featured restaurants cases
      .addCase(getFeaturedRestaurants.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getFeaturedRestaurants.fulfilled, (state, action) => {
        state.isLoading = false
        state.featuredRestaurants = action.payload
        state.error = null
      })
      .addCase(getFeaturedRestaurants.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { 
  updateSearchFilters, 
  clearSearchResults, 
  clearCurrentRestaurant, 
  clearError, 
  setCurrentPage,
  updateMenuItemAvailability 
} = restaurantSlice.actions

export default restaurantSlice.reducer