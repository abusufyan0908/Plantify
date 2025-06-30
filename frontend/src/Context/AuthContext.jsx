import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Check session status and handle auto-logout
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/verify`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          const userData = JSON.parse(localStorage.getItem('user'));
          setUser(userData);
          
          // Set session timeout (1 hour)
          const timeout = setTimeout(() => {
            handleLogout('Session expired. Please login again.');
          }, 3600000); // 1 hour in milliseconds
          
          setSessionTimeout(timeout);
        } else {
          handleLogout('Session expired. Please login again.');
        }
      } catch (error) {
        console.error('Session check error:', error);
        handleLogout('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Cleanup function
    return () => {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
    };
  }, []);

  const handleLogout = (message = 'You have been logged out successfully!') => {
    // Clear session timeout
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset user state
    setUser(null);
    
    // Show message
    toast.info(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleLogin = (userData) => {
    const userWithGardenerStatus = {
      ...userData,
      isGardener: userData.isGardener || false,
      gardenerId: userData.gardenerId || null
    };
    setUser(userWithGardenerStatus);
    localStorage.setItem('user', JSON.stringify(userWithGardenerStatus));
  };

  const value = {
    user,
    setUser,
    loading,
    handleLogout,
    handleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
