import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isGuest, setIsGuest] = useState(localStorage.getItem('isGuest') === 'true');
  const [loading, setLoading] = useState(true);

  // Check if token is still valid on mount
  useEffect(() => {
    if (isGuest) {
      // Guest mode - no token validation needed
      setLoading(false);
    } else if (token) {
      // Add token to API default header
      const timer = setTimeout(async () => {
        try {
          const response = await authAPI.me();
          setUser(response.data.user);
          setLoading(false);
        } catch (error) {
          // Token is invalid or expired
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          setLoading(false);
        }
      }, 0);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [token, isGuest]);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      setIsGuest(false);
      localStorage.setItem('token', newToken);
      localStorage.removeItem('isGuest');
      
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
      setIsGuest(false);
      localStorage.setItem('token', newToken);
      localStorage.removeItem('isGuest');
      
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const loginAsGuest = () => {
    setToken(null);
    setUser(null);
    setIsGuest(true);
    localStorage.removeItem('token');
    localStorage.setItem('isGuest', 'true');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('token');
    localStorage.removeItem('isGuest');
  };

  const isLoggedIn = (!!user && !!token) || isGuest;
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
        loginAsGuest,
        isLoggedIn,
        isAdmin,
        isGuest
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
