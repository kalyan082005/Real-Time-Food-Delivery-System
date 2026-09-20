import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  MapPin,
  ChevronDown
} from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import { openCart } from '../../store/slices/cartSlice'
import CartSidebar from '../cart/CartSidebar'
import NotificationDropdown from '../notifications/NotificationDropdown'

const Header = ({ onMenuClick, isAuthenticated, user }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { items: cartItems } = useSelector((state) => state.cart)
  const { unreadCount } = useSelector((state) => state.notifications)
  
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Calculate total items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleLogout = () => {
    dispatch(logout())
    setShowUserMenu(false)
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const isHomePage = location.pathname === '/'

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              {isAuthenticated && (
                <button
                  onClick={onMenuClick}
                  className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold text-gray-900">FoodDelivery</span>
              </Link>
              
              {/* Location selector - only on homepage */}
              {isHomePage && (
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Deliver to</span>
                  <button className="flex items-center space-x-1 text-gray-900 hover:text-primary-600">
                    <span className="font-medium">Current Location</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Center section - Search bar */}
            <div className="flex-1 max-w-lg mx-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for restaurants, dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </form>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <Bell className="h-6 w-6" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {showNotifications && (
                      <NotificationDropdown 
                        onClose={() => setShowNotifications(false)} 
                      />
                    )}
                  </div>

                  {/* Cart */}
                  <button
                    onClick={() => dispatch(openCart())}
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount > 9 ? '9+' : cartItemCount}
                      </span>
                    )}
                  </button>

                  {/* User menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <span className="hidden md:block text-sm font-medium">
                        {user?.name || 'User'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {/* User dropdown menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>My Orders</span>
                        </Link>
                        
                        {/* Role-based dashboard links */}
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        {user?.role === 'restaurant_owner' && (
                          <Link
                            to="/restaurant"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Restaurant Dashboard</span>
                          </Link>
                        )}
                        {user?.role === 'delivery_partner' && (
                          <Link
                            to="/delivery"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Delivery Dashboard</span>
                          </Link>
                        )}
                        
                        <Link
                          to="/settings"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Not authenticated - show login/register buttons */
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowUserMenu(false)
            setShowNotifications(false)
          }}
        />
      )}
    </>
  )
}

export default Header