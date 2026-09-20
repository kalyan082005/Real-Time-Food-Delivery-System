import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import NotificationToast from './NotificationToast'
import { useSelector } from 'react-redux'

const Layout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header 
        onMenuClick={() => setSidebarOpen(true)} 
        isAuthenticated={isAuthenticated}
        user={user}
      />
      
      <div className="flex flex-1">
        {/* Sidebar - only show for authenticated users */}
        {isAuthenticated && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            user={user}
          />
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full">
            <Outlet /> {/* This renders the current page component */}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Global notification toasts */}
      <NotificationToast />
    </div>
  )
}

export default Layout