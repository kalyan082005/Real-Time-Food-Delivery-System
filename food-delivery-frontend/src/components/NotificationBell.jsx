import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNotification, markAllAsRead } from '../store/slices/notificationSlice';
import socketService from '../services/socketService';
import { store } from '../store';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const subscribe = () => {
      socketService.subscribeToNotifications(user.id, (notification) => {
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
      socketService.connect(token);
      const timer = setTimeout(subscribe, 1500);
      return () => {
        clearTimeout(timer);
        socketService.unsubscribeFromNotifications(user.id);
      };
    }

    return () => socketService.unsubscribeFromNotifications(user.id);
  }, [user?.id, token, dispatch]);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-orange-500 focus:outline-none"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <span className="font-semibold text-gray-800">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={() => dispatch(markAllAsRead())}
                className="text-xs text-orange-500 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-6 text-sm">No notifications yet</p>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b last:border-b-0 ${!n.isRead ? 'bg-orange-50' : ''}`}
                >
                  <p className="font-medium text-sm text-gray-800">{n.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
