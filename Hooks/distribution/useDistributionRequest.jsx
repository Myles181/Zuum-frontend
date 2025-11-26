import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Detect iOS devices (including Chrome iOS)
const isIOSDevice = () => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua);
};

// Utility function to get authenticated headers
const getAuthHeaders = () => {
  const headers = {};
  // For iOS devices, try to get token from localStorage as backup
  if (isIOSDevice()) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

export const useDistributionRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setResponseData(null);
  }, []);

  /**
   * Submit a distribution request with enhanced error handling
   * @param {Object} formData - Complete distribution form data
   * @returns {Promise<Object>} Response data
   */
  const submitDistributionRequest = async (formData) => {
    console.groupCollapsed('[Distribution] Submission Started');
    console.log('Form data:', formData);
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResponseData(null);

    try {
      // Validate required files before submission
      if (!formData.coverArt) {
        throw { code: 'MISSING_COVER', message: 'Cover art is required' };
      }

      if (formData.releaseType === 'single' && !formData.audioFile) {
        throw { code: 'MISSING_AUDIO', message: 'Audio file is required for singles' };
      }

      if (formData.releaseType === 'album' && formData.tracks.some(t => !t.audioFile)) {
        throw { code: 'MISSING_TRACKS', message: 'All album tracks require audio files' };
      }

      const submitData = new FormData();
      
      // Add basic form fields
      submitData.append('artistName', formData.artistName);
      submitData.append('songTitle', formData.songTitle);
      submitData.append('genre', formData.genre);
      submitData.append('releaseType', formData.releaseType);
      submitData.append('releaseDate', formData.releaseDate);
      
      // Add cover art
      if (formData.coverArt) {
        submitData.append('coverArt', formData.coverArt);
      }
      
      // Add audio file for singles
      if (formData.releaseType === 'single' && formData.audioFile) {
        submitData.append('audioFile', formData.audioFile);
      }
      
      // Add tracks for albums
      if (formData.releaseType === 'album' && formData.tracks) {
        formData.tracks.forEach((track, index) => {
          if (track.audioFile) {
            submitData.append(`tracks[${index}][audioFile]`, track.audioFile);
          }
          if (track.title) {
            submitData.append(`tracks[${index}][title]`, track.title);
          }
        });
      }

      console.log('Submitting to /user/distribution-request');
      const response = await axios.post('/user/distribution-request', submitData, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      if (response.data.message === "Music Distribution request successful") {
        console.log('Distribution successful:', response.data);
        setSuccess(true);
        setResponseData(response.data);
        return response.data;
      } else {
        throw { 
          code: 'UNEXPECTED_RESPONSE', 
          message: 'Received unexpected success response',
          response 
        };
      }

    } catch (err) {
      let errorMessage = 'Submission failed';
      let errorCode = 'UNKNOWN_ERROR';

      // Handle axios errors
      if (err.response) {
        console.error('Server responded with error:', err.response.data);
        
        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data.message || 'Required fields missing';
            errorCode = 'VALIDATION_ERROR';
            break;
            
          case 406:
            errorMessage = err.response.data.message || 'Invalid file format or metadata';
            errorCode = 'INVALID_FORMAT';
            
            // Special handling for specific 406 messages
            if (err.response.data.message.includes('MP3')) {
              errorCode = 'INVALID_AUDIO_FORMAT';
            } else if (err.response.data.message.includes('cover photo')) {
              errorCode = 'INVALID_COVER_FORMAT';
            }
            break;
            
          case 409:
            errorMessage = 'Insufficient funds for distribution';
            errorCode = 'INSUFFICIENT_FUNDS';
            break;
            
          case 500:
            errorMessage = err.response.data.error || 'Internal server error';
            errorCode = 'SERVER_ERROR';
            break;
            
          default:
            errorMessage = `Error ${err.response.status}: ${err.response.data.message || 'Unknown error'}`;
        }
      } 
      // Handle network errors
      else if (err.request) {
        errorMessage = 'Network error: Could not connect to server';
        errorCode = 'NETWORK_ERROR';
        console.error('No response received:', err.request);
      } 
      // Handle custom validation errors
      else if (err.code) {
        errorMessage = err.message;
        errorCode = err.code;
      }
      // Handle all other errors
      else {
        errorMessage = err.message || 'Unknown error occurred';
        console.error('Unexpected error:', err);
      }

      setError({ message: errorMessage, code: errorCode });
      throw { code: errorCode, message: errorMessage, originalError: err };
      
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  return {
    submitDistributionRequest,
    loading,
    error,
    success,
    responseData,
    reset
  };
}; 