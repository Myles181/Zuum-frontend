import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

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

/**
 * Custom hook for user distribution requests
 * Handles creating, updating, and fetching distribution requests
 */
export const useUserDistributionRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  /**
   * Reset error and success states
   */
  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setResponseData(null);
  }, []);

  /**
   * Create a new distribution request
   * @param {Object} formData - Distribution request data
   * @param {string} formData.caption - Song/track caption
   * @param {string} formData.description - Description of the music
   * @param {string} formData.genre - Music genre
   * @param {Object} formData.social_links - Social media links object
   * @param {File} formData.audio_upload - Audio file (MP3)
   * @param {File} formData.cover_photo - Cover photo image
   * @returns {Promise<Object>} Response data
   */
  const createDistributionRequest = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResponseData(null);

    try {
      // Validate required fields
      if (!formData.audio_upload) {
        throw { code: 'MISSING_AUDIO', message: 'Audio upload is required' };
      }

      if (!formData.cover_photo) {
        throw { code: 'MISSING_COVER', message: 'Cover photo is required' };
      }

      if (!formData.caption) {
        throw { code: 'MISSING_CAPTION', message: 'Caption is required' };
      }

      if (!formData.description) {
        throw { code: 'MISSING_DESCRIPTION', message: 'Description is required' };
      }

      if (!formData.genre) {
        throw { code: 'MISSING_GENRE', message: 'Genre is required' };
      }

      // Validate social_links format
      if (!formData.social_links || typeof formData.social_links !== 'object') {
        throw { code: 'INVALID_SOCIAL_LINKS', message: 'Social links must be a valid object' };
      }

      const requiredSocialLinks = ['spotify', 'apple_music', 'boomplay', 'audio_mark'];
      const missingLinks = requiredSocialLinks.filter(link => !formData.social_links[link]);
      
      if (missingLinks.length > 0) {
        throw { 
          code: 'MISSING_SOCIAL_LINKS', 
          message: `Missing required social links: ${missingLinks.join(', ')}` 
        };
      }

      // Create FormData for multipart/form-data
      const submitData = new FormData();
      
      // Add text fields
      submitData.append('caption', formData.caption);
      submitData.append('description', formData.description);
      submitData.append('genre', formData.genre);
      
      // Add social_links as JSON string
      submitData.append('social_links', JSON.stringify(formData.social_links));
      
      // Add files
      submitData.append('audio_upload', formData.audio_upload);
      submitData.append('cover_photo', formData.cover_photo);
      
      // Create details object with all form data (excluding files which are sent separately)
      const details = {
        ...formData,
        // Remove file objects from details as they're sent separately
        audio_upload: undefined,
        cover_photo: undefined,
        audioFile: undefined,
        coverArt: undefined,
        // Remove tracks audio files but keep track metadata
        tracks: formData.tracks ? formData.tracks.map(track => ({
          ...track,
          audioFile: undefined
        })) : undefined
      };
      
      // Remove undefined values from details
      Object.keys(details).forEach(key => {
        if (details[key] === undefined) {
          delete details[key];
        }
      });
      
      // Add all form data in details object
      submitData.append('details', JSON.stringify(details));

      const response = await axios.post('/user/distribution-request', submitData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.status === 200 && response.data.message === "Music Distribution request successful") {
        setSuccess(true);
        setResponseData(response.data);
        return response.data;
      } else {
        throw { 
          code: 'UNEXPECTED_RESPONSE', 
          message: 'Received unexpected response',
          response 
        };
      }

    } catch (err) {
      let errorMessage = 'Failed to create distribution request';
      let errorCode = 'UNKNOWN_ERROR';

      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data.message || 'Required fields missing';
            errorCode = 'VALIDATION_ERROR';
            break;
            
          case 406:
            errorMessage = err.response.data.message || 'Invalid file format';
            errorCode = 'INVALID_FORMAT';
            
            if (err.response.data.message?.includes('MP3')) {
              errorCode = 'INVALID_AUDIO_FORMAT';
            } else if (err.response.data.message?.includes('cover photo')) {
              errorCode = 'INVALID_COVER_FORMAT';
            }
            break;
            
          case 409:
            errorMessage = 'Insufficient funds';
            errorCode = 'INSUFFICIENT_FUNDS';
            break;
            
          case 500:
            errorMessage = err.response.data.error || 'Internal server error';
            errorCode = 'SERVER_ERROR';
            break;
            
          default:
            errorMessage = err.response.data.message || `Error ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage = 'Network error: Could not connect to server';
        errorCode = 'NETWORK_ERROR';
      } else if (err.code) {
        errorMessage = err.message;
        errorCode = err.code;
      } else {
        errorMessage = err.message || 'Unknown error occurred';
      }

      setError({ message: errorMessage, code: errorCode });
      throw { code: errorCode, message: errorMessage, originalError: err };
      
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing distribution request
   * @param {string} requestId - The ID of the request to update
   * @param {Object} formData - Updated distribution request data (same structure as create)
   * @returns {Promise<Object>} Response data
   */
  const updateDistributionRequest = useCallback(async (requestId, formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResponseData(null);

    try {
      if (!requestId) {
        throw { code: 'MISSING_REQUEST_ID', message: 'Request ID is required' };
      }

      // Create FormData for multipart/form-data
      const submitData = new FormData();
      
      // Add text fields (only if provided)
      if (formData.caption) {
        submitData.append('caption', formData.caption);
      }
      if (formData.description) {
        submitData.append('description', formData.description);
      }
      if (formData.genre) {
        submitData.append('genre', formData.genre);
      }
      
      // Add social_links if provided
      if (formData.social_links && typeof formData.social_links === 'object') {
        submitData.append('social_links', JSON.stringify(formData.social_links));
      }
      
      // Add files only if provided
      if (formData.audio_upload) {
        submitData.append('audio_upload', formData.audio_upload);
      }
      if (formData.cover_photo) {
        submitData.append('cover_photo', formData.cover_photo);
      }

      const response = await axios.put(`/user/distribution-request/${requestId}`, submitData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.status === 200 && response.data.message === "Music Distribution request successful") {
        setSuccess(true);
        setResponseData(response.data);
        return response.data;
      } else {
        throw { 
          code: 'UNEXPECTED_RESPONSE', 
          message: 'Received unexpected response',
          response 
        };
      }

    } catch (err) {
      let errorMessage = 'Failed to update distribution request';
      let errorCode = 'UNKNOWN_ERROR';

      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data.message || 'Required fields missing';
            errorCode = 'VALIDATION_ERROR';
            break;
            
          case 406:
            errorMessage = err.response.data.message || 'Invalid file format';
            errorCode = 'INVALID_FORMAT';
            break;
            
          case 409:
            errorMessage = 'Insufficient funds';
            errorCode = 'INSUFFICIENT_FUNDS';
            break;
            
          case 500:
            errorMessage = err.response.data.error || 'Internal server error';
            errorCode = 'SERVER_ERROR';
            break;
            
          default:
            errorMessage = err.response.data.message || `Error ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage = 'Network error: Could not connect to server';
        errorCode = 'NETWORK_ERROR';
      } else if (err.code) {
        errorMessage = err.message;
        errorCode = err.code;
      } else {
        errorMessage = err.message || 'Unknown error occurred';
      }

      setError({ message: errorMessage, code: errorCode });
      throw { code: errorCode, message: errorMessage, originalError: err };
      
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all distribution requests for the current user
   * @returns {Promise<Array>} Array of distribution requests
   */
  const fetchDistributionRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    setError(null);

    try {
      const response = await axios.get('/user/distribution-requests', {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      if (response.status === 200) {
        // Handle different possible response formats
        let requestsData = [];
        if (Array.isArray(response.data)) {
          requestsData = response.data;
        } else if (response.data.requests && Array.isArray(response.data.requests)) {
          requestsData = response.data.requests;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          requestsData = response.data.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          requestsData = response.data.results;
        }

        setRequests(requestsData);
        return requestsData;
      } else {
        throw { 
          code: 'UNEXPECTED_RESPONSE', 
          message: 'Received unexpected response',
          response 
        };
      }

    } catch (err) {
      let errorMessage = 'Failed to fetch distribution requests';
      let errorCode = 'UNKNOWN_ERROR';

      if (err.response) {
        switch (err.response.status) {
          case 500:
            errorMessage = err.response.data.error || 'Server error';
            errorCode = 'SERVER_ERROR';
            break;
            
          default:
            errorMessage = err.response.data.message || `Error ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage = 'Network error: Could not connect to server';
        errorCode = 'NETWORK_ERROR';
      } else if (err.code) {
        errorMessage = err.message;
        errorCode = err.code;
      } else {
        errorMessage = err.message || 'Unknown error occurred';
      }

      setError({ message: errorMessage, code: errorCode });
      throw { code: errorCode, message: errorMessage, originalError: err };
      
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  return {
    // Create request
    createDistributionRequest,
    
    // Update request
    updateDistributionRequest,
    
    // Fetch requests
    fetchDistributionRequests,
    requests,
    isLoadingRequests,
    
    // State
    loading,
    error,
    success,
    responseData,
    
    // Utilities
    reset,
  };
};

