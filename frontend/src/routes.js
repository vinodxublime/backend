import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Main Pages
import Home from './pages/Home';
import Profile from './pages/Profile';

// Program Pages
import Programs from './pages/Programs';
import ProgramDetails from './pages/ProgramDetails';

const routes = [
  // Public Routes
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },

  // Protected Routes
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/programs',
    element: (
      <ProtectedRoute>
        <Programs />
      </ProtectedRoute>
    ),
  },
  {
    path: '/programs/:id',
    element: (
      <ProtectedRoute>
        <ProgramDetails />
      </ProtectedRoute>
    ),
  },

  // Redirects
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];

export default routes;
