import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { store } from '../store'
import { setConnectionStatus } from '../store/slices/notificationSlice'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8088/ws'

class SocketService {
  constructor() {
    this.client = null
    this.isConnected = false
    this.subscriptions = {}
  }

  connect(token) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected')
        this.isConnected = true
        store.dispatch(setConnectionStatus(true))
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected')
        this.isConnected = false
        store.dispatch(setConnectionStatus(false))
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame)
        this.isConnected = false
        store.dispatch(setConnectionStatus(false))
      },
    })

    this.client.activate()
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate()
      this.client = null
      this.isConnected = false
      this.subscriptions = {}
      store.dispatch(setConnectionStatus(false))
    }
  }

  subscribeToOrder(orderId, callback) {
    if (!this.client || !this.isConnected) {
      console.warn('WebSocket not connected, cannot subscribe to order:', orderId)
      return
    }
    const topic = `/topic/orders/${orderId}`
    if (this.subscriptions[topic]) {
      this.subscriptions[topic].unsubscribe()
    }
    this.subscriptions[topic] = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body)
        callback(data)
      } catch (e) {
        console.error('Failed to parse order update:', e)
      }
    })
  }

  unsubscribeFromOrder(orderId) {
    const topic = `/topic/orders/${orderId}`
    if (this.subscriptions[topic]) {
      this.subscriptions[topic].unsubscribe()
      delete this.subscriptions[topic]
    }
  }

  subscribeToDelivery(orderId, callback) {
    if (!this.client || !this.isConnected) {
      console.warn('WebSocket not connected, cannot subscribe to delivery:', orderId)
      return
    }
    const topic = `/topic/delivery/${orderId}`
    if (this.subscriptions[topic]) {
      this.subscriptions[topic].unsubscribe()
    }
    this.subscriptions[topic] = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body)
        callback(data)
      } catch (e) {
        console.error('Failed to parse delivery location:', e)
      }
    })
  }

  unsubscribeFromDelivery(orderId) {
    const topic = `/topic/delivery/${orderId}`
    if (this.subscriptions[topic]) {
      this.subscriptions[topic].unsubscribe()
      delete this.subscriptions[topic]
    }
  }

  subscribeToNotifications(userId, callback) {
    if (!this.client || !this.isConnected) {
      console.warn('WebSocket not connected, cannot subscribe to notifications')
      return
    }
    const topic = `/topic/notifications/${userId}`
    if (this.subscriptions[topic]) {
      this.subscriptions[topic].unsubscribe()
    }
    this.subscriptions[topic] = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body)
        callback(data)
      } catch (e) {
        console.error('Failed to parse notification:', e)
      }
    })
  }

  unsubscribeFromNotifications(userId) {
    const topic = `/topic/notifications/${userId}`
    if (this.subscriptions[topic]) {
      this.subscriptions[topic].unsubscribe()
      delete this.subscriptions[topic]
    }
  }

  isSocketConnected() {
    return this.isConnected
  }
}

const socketService = new SocketService()
export default socketService
