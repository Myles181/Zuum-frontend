import { useState } from 'react';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL;

export const useAdminSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const signup = async (signupData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    setOtpSent(false);

    try {
      const response = await axios.post(`${API_URL}/admin/auth/signup`, signupData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setIsSuccess(true);
        setOtpSent(true);
        return response.data;
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Handle different error status codes
          switch (err.response.status) {
            case 400:
              setError('Validation errors: ' + 
                (err.response.data?.errors 
                  ? JSON.stringify(err.response.data.errors) 
                  : 'Invalid input data'));
              break;
            case 406:
              setError('Email already exists');
              break;
            case 500:
              setError('Server error - please try again later');
              break;
            default:
              setError('An unexpected error occurred');
          }
        } else {
          setError('Network error - could not connect to the server');
        }
      } else {
        setError('An unknown error occurred');
      }
      throw err; // Re-throw the error for additional handling if needed
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    signup, 
    isLoading, 
    error, 
    isSuccess, 
    otpSent,
    reset: () => {
      setError(null);
      setIsSuccess(false);
      setOtpSent(false);
    }
  };
};







export const useVerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const verifyEmail = async (verificationData) => {
    setIsLoading(true);
    setError(null);
    setIsVerified(false);

    try {
      const response = await axios.post(`${API_URL}/admin/auth/verify-email`, verificationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setIsVerified(true);
        return response.data;
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Handle different error status codes
          switch (err.response.status) {
            case 400:
              setError('Invalid OTP - please check and try again');
              break;
            case 500:
              setError('Server error - please try again later');
              break;
            default:
              setError('Verification failed - please try again');
          }
        } else {
          setError('Network error - could not connect to the server');
        }
      } else {
        setError('An unknown error occurred during verification');
      }
      throw err; // Re-throw the error for additional handling if needed
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    verifyEmail, 
    isLoading, 
    error, 
    isVerified,
    reset: () => {
      setError(null);
      setIsVerified(false);
    }
  };
};