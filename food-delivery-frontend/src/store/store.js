import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import restaurantReducer from './slices/restaurantSlice'
import cartReducer from './slices/cartSlice'
import orderReducer from './slices/orderSlice'
import notificationReducer from './slices/notificationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,           // User authentication and profile management
    restaurants: restaurantReducer, // Restaurant data and search functionality
    cart: cartReducer,           // Shopping cart management
    orders: orderReducer,        // Order management and tracking
    notifications: notificationReducer, // Real-time notifications
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
})

export default store