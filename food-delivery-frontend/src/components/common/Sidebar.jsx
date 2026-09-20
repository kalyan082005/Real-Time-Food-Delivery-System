import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  X, 
  Home, 
  Search, 
  ShoppingCart, 
  Clock, 
  User, 
  Settings,
  Heart,
  Gift,
  HelpCircle,
  Store,
  Truck
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose, user }) => {
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Browse', path: '/restaurants' },
    { icon: ShoppingCart, label: 'My Orders', path: '/orders' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: Clock, label: 'Order History', path: '/order-history' },
    { icon: Gift, label: 'Offers', path: '/offers' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', path: '/help' },
  ]

  // Add role-specific menu items
  const roleSpecificItems = []
  if (user?.role === 'RESTAURANT') {
    roleSpecificItems.push(
      { icon: Store, label: 'Restaurant Dashboard', path: '/restaurant/dashboard' }
    )
  }
  if (user?.role === 'DELIVERY_PARTNER') {
    roleSpecificItems.push(
      { icon: Truck, label: 'Delivery Dashboard', path: '/delivery/dashboard' }
    )
  }

  const allMenuItems = [...menuItems, ...roleSpecificItems]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        md:relative md:translate-x-0 md:shadow-none md:border-r md:border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FoodDelivery</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {allMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>FoodDelivery v1.0</p>
            <p className="mt-1">© 2024 All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar