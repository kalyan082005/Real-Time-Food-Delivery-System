import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User, MapPin, CreditCard, Bell, Shield, LogOut, Edit2, Save, X } from 'lucide-react'
import { updateProfile, logout } from '../store/slices/authSlice'
import { updatePreferences } from '../store/slices/notificationSlice'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state) => state.auth)
  const { preferences } = useSelector((state) => state.notifications)
  
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  })
  
  const [addresses, setAddresses] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [notificationPrefs, setNotificationPrefs] = useState(preferences)

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || ''
      })
    }
  }, [user])

  useEffect(() => {
    setNotificationPrefs(preferences)
  }, [preferences])

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateProfile(profileData)).unwrap()
      setIsEditing(false)
    } catch (error) {
      console.error('Profile update failed:', error)
    }
  }

  const handleNotificationChange = (key, value) => {
    const newPrefs = { ...notificationPrefs, [key]: value }
    setNotificationPrefs(newPrefs)
    dispatch(updatePreferences(newPrefs))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-semibold">Personal Information</h2>
                </div>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="flex items-center space-x-2 bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.name || 'Not provided'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.phone || 'Not provided'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profileData.dateOfBirth 
                        ? new Date(profileData.dateOfBirth).toLocaleDateString()
                        : 'Not provided'
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Addresses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-semibold">Delivery Addresses</h2>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Add New Address
                </button>
              </div>
              
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No saved addresses</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add your delivery addresses for faster checkout
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{address.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {address.street}, {address.city}, {address.state} {address.zipCode}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-primary-600 hover:text-primary-700 text-sm">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-semibold">Payment Methods</h2>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Add New Card
                </button>
              </div>
              
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No saved payment methods</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add your cards for faster and secure payments
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            💳
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              •••• •••• •••• {method.lastFour}
                            </p>
                            <p className="text-sm text-gray-600">
                              Expires {method.expiry}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-primary-600 hover:text-primary-700 text-sm">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold">Notification Preferences</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Order Updates</h3>
                    <p className="text-sm text-gray-600">Get notified about your order status</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationPrefs.orderUpdates}
                      onChange={(e) => handleNotificationChange('orderUpdates', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Promotions & Offers</h3>
                    <p className="text-sm text-gray-600">Receive deals and special offers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationPrefs.promotions}
                      onChange={(e) => handleNotificationChange('promotions', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationPrefs.emailNotifications}
                      onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Push Notifications</h3>
                    <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationPrefs.pushNotifications}
                      onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Account Overview</h2>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-primary-600">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900">{user?.name || 'User'}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Member since</span>
                    <span className="text-gray-900">
                      {user?.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'Recently'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total orders</span>
                    <span className="text-gray-900">{user?.totalOrders || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Account status</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Change Password</span>
                </button>
                
                <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Notification Settings</span>
                </button>
                
                <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Privacy Settings</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage