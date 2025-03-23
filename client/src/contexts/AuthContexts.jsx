import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // Store the auth token
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error messages

  // Check if the user is authenticated (e.g., on app load)
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
    if (storedToken) {
      setToken(storedToken); // Set token if available
    }
    setLoading(false); // Mark loading as complete
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors

    try {
      // Make a POST request to the API
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        credentials
      );

      // Check the response status
      if (response.status === 200) {
        const { token } = response.data; // Extract the JWT token from the response
        setToken(token); // Store the token in state
        localStorage.setItem('authToken', token); // Save the token to localStorage
      }
    } catch (err) {
      // Handle errors based on status code
      if (err.response) {
        const { status } = err.response;

        if (status === 400) {
          setError('Validation errors. Please check your input.');
        } else if (status === 401) {
          setError('Invalid credentials. Please check your email and password.');
        } else if (status === 406) {
          setError('Email is not verified. Please verify your email first.');
        } else if (status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('An unexpected error occurred.');
        }
      } else {
        setError('Network error. Please check your internet connection.');
      }
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  // Logout function
  const logout = () => {
    setToken(null); // Clear the token
    localStorage.removeItem('authToken'); // Remove the token from localStorage
  };

  // Value to be provided by the context
  const value = {
    token,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};