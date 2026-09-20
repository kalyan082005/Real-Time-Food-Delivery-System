import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderDetails } from '../store/slices/orderSlice';
import { addNotification } from '../store/slices/notificationSlice';
import socketService from '../services/socketService';
import { store } from '../store';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { currentOrder, loading, error } = useSelector((state) => state.orders);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [localNotifications, setLocalNotifications] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  // Subscribe to real-time order updates via WebSocket
  useEffect(() => {
    if (!orderId) return;

    const subscribe = () => {
      socketService.subscribeToOrder(orderId, (update) => {
        console.log('Real-time order update:', update);
        dispatch(fetchOrderDetails(orderId));
      });
    };

    if (socketService.isSocketConnected()) {
      subscribe();
    } else {
      const { token } = store.getState().auth;
      socketService.connect(token);
      // Wait briefly for connection then subscribe
      const timer = setTimeout(subscribe, 1500);
      return () => {
        clearTimeout(timer);
        socketService.unsubscribeFromOrder(orderId);
      };
    }

    return () => {
      socketService.unsubscribeFromOrder(orderId);
    };
  }, [orderId, dispatch]);

  // Subscribe to live delivery location
  useEffect(() => {
    if (!orderId) return;
    const subscribe = () => {
      socketService.subscribeToDelivery(orderId, (location) => {
        setDeliveryLocation(location);
      });
    };
    if (socketService.isSocketConnected()) {
      subscribe();
    } else {
      const timer = setTimeout(subscribe, 1500);
      return () => {
        clearTimeout(timer);
        socketService.unsubscribeFromDelivery(orderId);
      };
    }
    return () => socketService.unsubscribeFromDelivery(orderId);
  }, [orderId]);

  // Subscribe to notifications for this order's user
  useEffect(() => {
    if (!user?.id) return;
    const subscribe = () => {
      socketService.subscribeToNotifications(user.id, (notification) => {
        // Add to local list for inline display on this page
        setLocalNotifications(prev => [notification, ...prev].slice(0, 5));
        // Also dispatch to global Redux store
        dispatch(addNotification({
          title: notification.title,
          message: notification.message,
          type: notification.type,
        }));
      });
    };
    if (socketService.isSocketConnected()) {
      subscribe();
    } else {
      const timer = setTimeout(subscribe, 1500);
      return () => {
        clearTimeout(timer);
        socketService.unsubscribeFromNotifications(user.id);
      };
    }
    return () => socketService.unsubscribeFromNotifications(user.id);
  }, [user?.id, dispatch]);
  
  // Initialize Leaflet map always (default to New York if no location yet)
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const initMap = () => {
      if (!mapRef.current) return;
      const defaultLat = 40.7128;
      const defaultLng = -74.0060;

      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      mapInstanceRef.current = map;
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMap, 100);
    return () => clearTimeout(timer);
  }, [currentOrder]); // re-run when order loads so mapRef.current is available

  // Update marker when deliveryLocation changes
  useEffect(() => {
    if (!deliveryLocation || !mapInstanceRef.current) return;
    const { latitude, longitude } = deliveryLocation;
    if (!latitude || !longitude) return;

    if (!markerRef.current) {
      markerRef.current = L.marker([latitude, longitude])
        .addTo(mapInstanceRef.current)
        .bindPopup('🚗 Delivery Partner')
        .openPopup();
    } else {
      markerRef.current.setLatLng([latitude, longitude]);
    }
    mapInstanceRef.current.setView([latitude, longitude], 15);
  }, [deliveryLocation]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }
  
  if (!currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 text-orange-500 hover:underline"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }
  
  const orderStatuses = [
    { key: 'PENDING', label: 'Order Placed', icon: '📝' },
    { key: 'CONFIRMED', label: 'Confirmed', icon: '✅' },
    { key: 'PREPARING', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'READY', label: 'Ready for Pickup', icon: '📦' },
    { key: 'PICKED_UP', label: 'Out for Delivery', icon: '🚗' },
    { key: 'DELIVERED', label: 'Delivered', icon: '🎉' },
  ];
  
  const currentStatusIndex = orderStatuses.findIndex(s => s.key === currentOrder.status);
  const isCancelled = currentOrder.status === 'CANCELLED';
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/orders')}
        className="mb-6 text-orange-500 hover:underline flex items-center"
      >
        ← Back to Orders
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Tracking */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">Order #{currentOrder.id.substring(0, 8)}</h1>
            <p className="text-gray-600">Placed on {formatDate(currentOrder.createdAt)}</p>
          </div>
          
          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Order Status</h2>
            
            {isCancelled ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-2xl font-bold text-red-600 mb-2">Order Cancelled</h3>
                <p className="text-gray-600">This order has been cancelled</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orderStatuses.map((status, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  
                  return (
                    <div key={status.key} className="flex items-center">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        isCompleted ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {status.icon}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className={`font-semibold ${isCurrent ? 'text-orange-500' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                          {status.label}
                        </p>
                        {isCurrent && (
                          <p className="text-sm text-gray-600">In progress...</p>
                        )}
                      </div>
                      {isCompleted && (
                        <div className="text-green-600">✓</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Live Delivery Location Map */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">🚗 Live Delivery Location</h2>
            {deliveryLocation ? (
              <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                <span>📍</span>
                <span>
                  Lat: {Number(deliveryLocation.latitude).toFixed(4)}, Lng: {Number(deliveryLocation.longitude).toFixed(4)}
                </span>
                <span className="ml-auto text-xs text-gray-400">
                  {deliveryLocation.timestamp ? new Date(deliveryLocation.timestamp).toLocaleTimeString() : 'just now'}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-3">Waiting for delivery partner location...</p>
            )}
            <div ref={mapRef} style={{ height: '300px', borderRadius: '8px', zIndex: 0 }} />
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {currentOrder.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.menuItem?.name || 'Item'}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    {item.specialInstructions && (
                      <p className="text-sm text-gray-500 italic">Note: {item.specialInstructions}</p>
                    )}
                  </div>
                  <p className="font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">

          {/* Live Notifications */}
          {localNotifications.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">🔔 Notifications</h2>
              <div className="space-y-3">
                {localNotifications.map((n, i) => (
                  <div key={i} className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${(currentOrder.totalAmount - (currentOrder.deliveryFee || 0) - (currentOrder.taxAmount || 0)).toFixed(2)}</span>
              </div>
              {currentOrder.deliveryFee && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${currentOrder.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              {currentOrder.taxAmount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${currentOrder.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${currentOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Restaurant</p>
                <p className="font-medium">{currentOrder.restaurant?.name || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Delivery Address</p>
                <p className="font-medium">{currentOrder.deliveryAddress || 'N/A'}</p>
              </div>
              
              {currentOrder.estimatedDeliveryTime && (
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-medium">{formatDate(currentOrder.estimatedDeliveryTime)}</p>
                </div>
              )}
              
              {currentOrder.actualDeliveryTime && (
                <div>
                  <p className="text-sm text-gray-600">Delivered At</p>
                  <p className="font-medium text-green-600">{formatDate(currentOrder.actualDeliveryTime)}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Special Instructions */}
          {currentOrder.specialInstructions && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
              <p className="text-gray-700">{currentOrder.specialInstructions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
