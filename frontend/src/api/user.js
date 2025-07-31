import api, { handleApiError } from './index';

/**
 * Get user dashboard data
 * @returns {Promise} - Promise with user dashboard data
 */
export const getUserDashboard = async () => {
  try {
    const response = await api.get('/user/dashboard');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update user language preference
 * @param {Object} languageData - Language preference data
 * @param {string} languageData.language - Language code (e.g., 'en', 'es', 'fr')
 * @returns {Promise} - Promise with updated preference response
 */
export const updateLanguagePreference = async (languageData) => {
  try {
    const response = await api.patch('/user/language', languageData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get user notification preferences
 * @returns {Promise} - Promise with notification preferences data
 */
export const getNotificationPreferences = async () => {
  try {
    const response = await api.get('/user/preferences/notifications');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update user notification preferences
 * @param {Object} preferencesData - Notification preferences data
 * @param {boolean} preferencesData.email - Email notification preference
 * @param {boolean} preferencesData.push - Push notification preference
 * @param {boolean} preferencesData.sms - SMS notification preference
 * @returns {Promise} - Promise with updated preferences response
 */
export const updateNotificationPreferences = async (preferencesData) => {
  try {
    const response = await api.patch('/user/preferences/notifications', preferencesData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get user progress data
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @returns {Promise} - Promise with user progress data
 */
export const getUserProgress = async (params = {}) => {
  try {
    const response = await api.get('/user/progress', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get user statistics
 * @returns {Promise} - Promise with user statistics data
 */
export const getUserStats = async () => {
  try {
    const response = await api.get('/user/stats');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Upload user avatar
 * @param {File} avatarFile - Avatar image file
 * @returns {Promise} - Promise with avatar upload response
 */
export const uploadAvatar = async (avatarFile) => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const response = await api.post('/auth/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete user avatar
 * @returns {Promise} - Promise with avatar deletion response
 */
export const deleteAvatar = async () => {
  try {
    const response = await api.delete('/auth/profile/avatar');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get user notifications
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @param {boolean} params.unread - Filter by unread status
 * @returns {Promise} - Promise with notifications data
 */
export const getNotifications = async (params = {}) => {
  try {
    const response = await api.get('/notifications', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise} - Promise with response data
 */
export const markNotificationRead = async (notificationId) => {
  try {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise} - Promise with response data
 */
export const markAllNotificationsRead = async () => {
  try {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};