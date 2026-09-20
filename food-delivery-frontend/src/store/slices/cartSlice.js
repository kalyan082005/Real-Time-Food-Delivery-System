import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],                 // Array of cart items
  restaurantId: null,        // ID of restaurant for current cart (single restaurant per order)
  restaurantName: '',        // Name of restaurant for current cart
  subtotal: 0,               // Subtotal before taxes and fees
  deliveryFee: 0,            // Delivery fee for the order
  taxAmount: 0,              // Tax amount for the order
  totalAmount: 0,            // Total amount including all fees
  isOpen: false,             // Cart sidebar open/closed state
  appliedCoupon: null,       // Applied coupon details
  discountAmount: 0,         // Discount amount from coupon
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const { menuItem, quantity = 1, specialInstructions = '' } = action.payload
      
      // Check if cart is empty or from same restaurant
      if (state.items.length === 0) {
        state.restaurantId = menuItem.restaurantId
        state.restaurantName = menuItem.restaurantName
      } else if (state.restaurantId !== menuItem.restaurantId) {
        // Clear cart if different restaurant (single restaurant per order rule)
        state.items = []
        state.restaurantId = menuItem.restaurantId
        state.restaurantName = menuItem.restaurantName
      }
      
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        item => item.menuItem.id === menuItem.id && 
                item.specialInstructions === specialInstructions
      )
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += quantity
      } else {
        // Add new item to cart
        state.items.push({
          id: `${menuItem.id}-${Date.now()}`, // Unique cart item ID
          menuItem,
          quantity,
          specialInstructions
        })
      }
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Remove item from cart
    removeFromCart: (state, action) => {
      const itemId = action.payload
      state.items = state.items.filter(item => item.id !== itemId)
      
      // Clear restaurant info if cart is empty
      if (state.items.length === 0) {
        state.restaurantId = null
        state.restaurantName = ''
      }
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Update item quantity
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload
      const item = state.items.find(item => item.id === itemId)
      
      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items = state.items.filter(item => item.id !== itemId)
        } else {
          item.quantity = quantity
        }
      }
      
      // Clear restaurant info if cart is empty
      if (state.items.length === 0) {
        state.restaurantId = null
        state.restaurantName = ''
      }
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Clear entire cart
    clearCart: (state) => {
      state.items = []
      state.restaurantId = null
      state.restaurantName = ''
      state.subtotal = 0
      state.deliveryFee = 0
      state.taxAmount = 0
      state.totalAmount = 0
      state.appliedCoupon = null
      state.discountAmount = 0
    },
    
    // Toggle cart sidebar
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    
    // Open cart sidebar
    openCart: (state) => {
      state.isOpen = true
    },
    
    // Close cart sidebar
    closeCart: (state) => {
      state.isOpen = false
    },
    
    // Apply coupon
    applyCoupon: (state, action) => {
      const coupon = action.payload
      state.appliedCoupon = coupon
      state.discountAmount = coupon.discountAmount
      
      // Recalculate totals with discount
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Remove coupon
    removeCoupon: (state) => {
      state.appliedCoupon = null
      state.discountAmount = 0
      
      // Recalculate totals without discount
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Set delivery fee (called when restaurant is selected)
    setDeliveryFee: (state, action) => {
      state.deliveryFee = action.payload
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Calculate totals (internal helper)
    calculateTotals: (state) => {
      // Calculate subtotal
      state.subtotal = state.items.reduce((total, item) => {
        return total + (item.menuItem.price * item.quantity)
      }, 0)
      
      // Calculate tax (assuming 8% tax rate)
      const taxRate = 0.08
      state.taxAmount = state.subtotal * taxRate
      
      // Calculate total with delivery fee and discount
      state.totalAmount = state.subtotal + state.taxAmount + state.deliveryFee - state.discountAmount
      
      // Ensure total is not negative
      if (state.totalAmount < 0) {
        state.totalAmount = 0
      }
    },
    
    // Remove unavailable items (for real-time menu updates)
    removeUnavailableItems: (state, action) => {
      const unavailableItemIds = action.payload
      state.items = state.items.filter(item => 
        !unavailableItemIds.includes(item.menuItem.id)
      )
      
      // Clear restaurant info if cart is empty
      if (state.items.length === 0) {
        state.restaurantId = null
        state.restaurantName = ''
      }
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Handle unavailable items (for WebSocket integration)
    handleUnavailableItems: (state, action) => {
      const unavailableItemIds = action.payload
      const originalLength = state.items.length
      
      // Remove unavailable items from cart
      state.items = state.items.filter(item => 
        !unavailableItemIds.includes(item.menuItem.id)
      )
      
      // Clear restaurant info if cart is empty
      if (state.items.length === 0) {
        state.restaurantId = null
        state.restaurantName = ''
      }
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state)
    }
  }
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  applyCoupon,
  removeCoupon,
  setDeliveryFee,
  removeUnavailableItems,
  handleUnavailableItems
} = cartSlice.actions

export default cartSlice.reducer