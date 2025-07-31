import api, { handleApiError } from './index';

/**
 * User registration
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Promise} - Promise with registration response
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * User login
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise} - Promise with login response
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Verify OTP for email/mobile verification
 * @param {Object} otpData - OTP verification data
 * @param {string} otpData.email - User's email
 * @param {string} otpData.otp - One-time password
 * @returns {Promise} - Promise with verification response
 */
export const verifyOTP = async (otpData) => {
  try {
    const response = await api.post('/auth/verify-otp', otpData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get current user profile
 * @returns {Promise} - Promise with user profile data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} - Promise with updated profile response
 */
export const updateProfile = async (profileData) => {
  try {
    alert('I am here');
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Change user password
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise} - Promise with password change response
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Request password reset
 * @param {Object} emailData - Email data for password reset
 * @param {string} emailData.email - User's email
 * @returns {Promise} - Promise with password reset request response
 */
export const forgotPassword = async (emailData) => {
  try {
    const response = await api.post('/auth/forgot-password', emailData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Reset password with token
 * @param {Object} resetData - Password reset data
 * @param {string} resetData.token - Reset token
 * @param {string} resetData.password - New password
 * @returns {Promise} - Promise with password reset response
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Refresh authentication token
 * @param {Object} refreshData - Refresh token data
 * @param {string} refreshData.refreshToken - Refresh token
 * @returns {Promise} - Promise with new token response
 */
export const refreshToken = async (refreshData) => {
  try {
    const response = await api.post('/auth/refresh-token', refreshData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Logout user
 * @returns {Promise} - Promise with logout response
 */
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};