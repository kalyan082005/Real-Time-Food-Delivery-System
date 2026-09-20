import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import { store } from './store'
import { setUserFromToken } from './store/slices/authSlice'
import socketService from './services/socketService'
import { addNotification } from './store/slices/notificationSlice'

// Layout
import Layout from './components/common/Layout'

// Auth components
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'

// Page components
import HomePage from './pages/HomePage'
import RestaurantsPage from './pages/RestaurantsPage'
import RestaurantDetailPage from './pages/RestaurantDetailPage'
import RestaurantMenuPage from './pages/RestaurantMenuPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/SearchPage'

// Role-specific dashboards
import AdminDashboard from './pages/admin/AdminDashboard'
import DeliveryDashboard from './pages/delivery/DeliveryDashboard'
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard'

// Protected Route component with role checking
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const userRole = useSelector((state) => state.auth.user?.role)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />
  }
  
  return children
}

// Public Route component (redirect to home if authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  return !isAuthenticated ? children : <Navigate to="/" />
}

function App() {
  useEffect(() => {
    // Expose store to window for debugging (remove in production)
    window.store = store;
    
    // Check for existing token on app startup
    const token = localStorage.getItem('token')
    if (token) {
      try {
        // Decode JWT token to get user info (in real app, validate with server)
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(atob(base64))
        
        // Check if token is not expired
        if (payload.exp * 1000 > Date.now()) {
          // Set user from token
          store.dispatch(setUserFromToken({
            user: {
              id: payload.sub,
              email: payload.email,
              name: payload.name,
              role: payload.role,
            }
          }))
          
          // Connect to WebSocket
          socketService.connect(token)

          // Subscribe to notifications for this user
          setTimeout(() => {
            socketService.subscribeToNotifications(payload.sub, (notification) => {
              store.dispatch(addNotification({
                title: notification.title,
                message: notification.message,
                type: notification.type,
              }))
            })
          }, 1500)
        } else {
          // Token expired, remove it
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Invalid token:', error)
        localStorage.removeItem('token')
      }
    }

    // Cleanup on app unmount
    return () => {
      socketService.disconnect()
    }
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            } />

            {/* Protected routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="restaurants" element={<RestaurantsPage />} />
              <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
              <Route path="restaurants/:restaurantId/menu" element={<RestaurantMenuPage />} />
              <Route path="search" element={<SearchPage />} />
              
              {/* Protected routes */}
              <Route path="checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="orders/:orderId" element={
                <ProtectedRoute>
                  <OrderTrackingPage />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              {/* Role-specific dashboards */}
              <Route path="admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="delivery" element={
                <ProtectedRoute requiredRole="delivery_partner">
                  <DeliveryDashboard />
                </ProtectedRoute>
              } />
              <Route path="restaurant" element={
                <ProtectedRoute requiredRole="restaurant_owner">
                  <RestaurantDashboard />
                </ProtectedRoute>
              } />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App