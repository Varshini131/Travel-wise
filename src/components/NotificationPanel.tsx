import React, { useState } from 'react';
import { X, MapPin, Utensils, Calendar, Bell, Check } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'food',
      title: 'New Restaurant Recommendation',
      message: 'Trishna Restaurant in Fort matches your seafood preferences',
      time: '2 minutes ago',
      unread: true,
      icon: Utensils,
      color: 'orange'
    },
    {
      id: 2,
      type: 'attraction',
      title: 'Popular Attraction Nearby',
      message: 'Gateway of India is trending among travelers like you',
      time: '15 minutes ago',
      unread: true,
      icon: MapPin,
      color: 'cyan'
    },
    {
      id: 3,
      type: 'weather',
      title: 'Weather Update',
      message: 'Perfect weather for city exploration today - 28°C',
      time: '1 hour ago',
      unread: false,
      icon: Calendar,
      color: 'purple'
    },
    {
      id: 4,
      type: 'plan',
      title: 'Trip Progress Update',
      message: 'Your Mumbai itinerary is 65% complete',
      time: '2 hours ago',
      unread: false,
      icon: Calendar,
      color: 'teal'
    },
    {
      id: 5,
      type: 'food',
      title: 'Local Food Festival',
      message: 'Mumbai Street Food Festival happening this weekend',
      time: '1 day ago',
      unread: false,
      icon: Utensils,
      color: 'orange'
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-6 h-6" />
                <h2 className="text-xl font-bold">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-white/80 hover:text-white flex items-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              const colorClasses = {
                orange: 'bg-orange-100 text-orange-600',
                cyan: 'bg-cyan-100 text-cyan-600',
                purple: 'bg-purple-100 text-purple-600',
                teal: 'bg-teal-100 text-teal-600'
              };

              return (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    notification.unread ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      colorClasses[notification.color as keyof typeof colorClasses]
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {notification.title}
                        </h3>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full text-center text-purple-600 hover:text-purple-700 font-medium text-sm">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;