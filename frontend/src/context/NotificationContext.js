import React, { createContext, useContext, useState, useEffect } from 'react';
import * as userAPI from '../api/user';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    sms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  
  // Fetch user notifications
  const fetchNotifications = async (params = {}) => {
    if (!user) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await userAPI.getNotifications(params);
      setNotifications(response.notifications);
      
      // Count unread notifications
      const unread = response.notifications.filter(notification => !notification.read).length;
      setUnreadCount(unread);
      
      return response.notifications;
    } catch (error) {
      setError(error.message || 'Failed to fetch notifications');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    if (!user) return { success: false };
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await userAPI.markNotificationRead(notificationId);
      
      // Update notifications list
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Failed to mark notification as read');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return { success: false };
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await userAPI.markAllNotificationsRead();
      
      // Update notifications list
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Update unread count
      setUnreadCount(0);
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Failed to mark all notifications as read');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch notification preferences
  const fetchNotificationPreferences = async () => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await userAPI.getNotificationPreferences();
      setPreferences(response.preferences);
      return response.preferences;
    } catch (error) {
      setError(error.message || 'Failed to fetch notification preferences');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update notification preferences
  const updateNotificationPreferences = async (newPreferences) => {
    if (!user) return { success: false };
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await userAPI.updateNotificationPreferences(newPreferences);
      setPreferences(response.preferences);
      return { success: true };
    } catch (error) {
      setError(error.message || 'Failed to update notification preferences');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Add a local notification (not persisted to backend)
  const addLocalNotification = (notification) => {
    const newNotification = {
      _id: `local-${Date.now()}`,
      title: notification.title,
      message: notification.message,
      type: notification.type || 'info',
      read: false,
      createdAt: new Date().toISOString(),
      local: true
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    return newNotification;
  };
  
  // Load notifications when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchNotificationPreferences();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setPreferences({
        email: true,
        push: true,
        sms: false
      });
    }
  }, [user]);
  
  const value = {
    notifications,
    unreadCount,
    preferences,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    fetchNotificationPreferences,
    updateNotificationPreferences,
    addLocalNotification
  };
  
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};