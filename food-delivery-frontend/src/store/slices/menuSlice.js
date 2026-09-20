import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import restaurantAPI from '../../services/restaurantAPI'

// Async thunks
export const fetchRestaurantMenu = createAsyncThunk(
  'menu/fetchRestaurantMenu',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.getRestaurantMenu(restaurantId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch menu')
    }
  }
)

export const addMenuItem = createAsyncThunk(
  'menu/addMenuItem',
  async ({ restaurantId, menuItemData }, { rejectWithValue }) => {
    try {
      const response = await restaurantAPI.addMenuItem(restaurantId, menuItemData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add menu item')
    }
  }
)

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentRestaurantId: null
  },
  reducers: {
    clearMenu: (state) => {
      state.items = []
      state.currentRestaurantId = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch restaurant menu
      .addCase(fetchRestaurantMenu.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRestaurantMenu.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchRestaurantMenu.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Add menu item
      .addCase(addMenuItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
        state.error = null
      })
      .addCase(addMenuItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearMenu } = menuSlice.actions
export default menuSlice.reducer
