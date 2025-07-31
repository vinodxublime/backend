import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authAPI from '../api/auth';
import * as userAPI from '../api/user';
import api from '../api/index';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  //const [token, setToken] = useState();
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

  useEffect(() => {
    if (token) {
        console.log("🔁 Token found in localStorage:", token);
      getCurrentUser();
     // alert('ddd');
    } else {
      console.log("❌ No token, skipping getCurrentUser");
      setLoading(false);
    //  alert('yyyy');
    }
  }, [token]);

 /* const getCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      
      setUser(response.data.user);
    } catch (error) {
      console.error('Error getting current user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }; */

  const getCurrentUser = async () => {
  try {
    const res = await authAPI.getCurrentUser();
    console.log("👤 getCurrentUser response:", res);
    setUser(res.data);
  } catch (err) {
    console.error("❌ Failed to get current user:", err.message);
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  const login = async (email, password) => {
  try {
    const response = await authAPI.login({ email, password });

    // ✅ Fix: Access response.data
    const { token, refreshToken, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    setToken(token);
    setRefreshToken(refreshToken);
    setUser(user); // ✅ User is now properly stored

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Login failed'
    };
  }
};

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      
      const { token, refreshToken, user } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(token);
      setRefreshToken(refreshToken);
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout API if user is authenticated
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local storage and state regardless of API success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {

    console.log("I am on the auth context");
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to change password'
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword({ email });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to send password reset email'
      };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await authAPI.resetPassword({ token, password });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to reset password'
      };
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const response = await userAPI.uploadAvatar(file);
      setUser(prev => ({
        ...prev,
        avatar: response.avatar
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to upload avatar'
      };
    }
  };

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    uploadAvatar,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};