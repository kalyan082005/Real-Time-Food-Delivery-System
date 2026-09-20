import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import restaurantSlice from './slices/restaurantSlice'
import cartSlice from './slices/cartSlice'
import orderSlice from './slices/orderSlice'
import notificationSlice from './slices/notificationSlice'
import addressSlice from './slices/addressSlice'
import menuSlice from './slices/menuSlice'

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('cart');
    if (!saved) return undefined;
    const parsed = JSON.parse(saved);
    // Ensure all numeric fields are valid numbers
    return {
      ...parsed,
      subtotal: Number(parsed.subtotal) || 0,
      deliveryFee: Number(parsed.deliveryFee) || 0,
      taxAmount: Number(parsed.taxAmount) || 0,
      totalAmount: Number(parsed.totalAmount) || 0,
      discountAmount: Number(parsed.discountAmount) || 0,
      items: parsed.items || [],
    };
  } catch { return undefined; }
};

const preloadedState = {
  cart: loadCartFromStorage(),
};

// Configure Redux store with all slices
export const store = configureStore({
  reducer: {
    auth: authSlice,
    restaurants: restaurantSlice,
    cart: cartSlice,
    orders: orderSlice,
    notifications: notificationSlice,
    addresses: addressSlice,
    menu: menuSlice,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

// Save cart to localStorage on every state change
store.subscribe(() => {
  try {
    localStorage.setItem('cart', JSON.stringify(store.getState().cart));
  } catch {}
});

export default store