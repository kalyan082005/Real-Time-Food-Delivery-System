import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { 
  closeCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} from '../../store/slices/cartSlice'

const CartSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { 
    isOpen, 
    items, 
    restaurantName, 
    subtotal, 
    deliveryFee, 
    taxAmount, 
    totalAmount 
  } = useSelector((state) => state.cart)

  const handleClose = () => {
    dispatch(closeCart())
  }

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId))
  }

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId))
    } else {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }))
    }
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const handleCheckout = () => {
    dispatch(closeCart())
    navigate('/checkout')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-4">Add some delicious items to get started</p>
              <button
                onClick={() => {
                  handleClose()
                  navigate('/restaurants')
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Browse Restaurants
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Restaurant Info */}
            {restaurantName && (
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <p className="text-sm text-gray-600">Order from</p>
                <p className="font-medium text-gray-900">{restaurantName}</p>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 bg-gray-50 rounded-lg p-3">
                    <img
                      src={item.menuItem.imageUrl || '/api/placeholder/60/60'}
                      alt={item.menuItem.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {item.menuItem.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        ${item.menuItem.price.toFixed(2)} each
                      </p>
                      
                      {item.specialInstructions && (
                        <p className="text-xs text-gray-500 mt-1">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Clear Cart Button */}
              {items.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="w-full mt-4 text-red-600 hover:text-red-700 text-sm font-medium py-2"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CartSidebar