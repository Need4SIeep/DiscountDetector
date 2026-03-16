import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Check if token is still valid on mount
  useEffect(() => {
    if (token) {
      // Add token to API default header
      const timer = setTimeout(async () => {
        try {
          const response = await authAPI.me();
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid or expired
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      }, 0);

      return () => clearTimeout(timer);
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (username, password) => {
    try {
      const response = await authAPI.register(username, password);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const isLoggedIn = !!user && !!token;
  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        loading, 
        login, 
        register, 
        logout, 
        isLoggedIn,
        isAdmin 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
