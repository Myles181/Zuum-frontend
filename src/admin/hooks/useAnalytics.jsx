import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Admin hook for managing profile analytics
 *
 * Endpoints:
 * - POST   /api/admin/users/analytics           → create analytics for a profile
 * - GET    /api/admin/users/analytics/{profileId} → get analytics for a specific profile
 * - PUT    /api/admin/users/analytics/{profileId} → update analytics for a profile
 * - DELETE /api/admin/users/analytics/{profileId} → delete analytics for a profile
 */
export const useProfileAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [currentAnalytics, setCurrentAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Create analytics for a profile
   * @param {Object} analyticsData
   * @param {number} analyticsData.profileId - Profile ID (required)
   * @param {number} analyticsData.total_streams - Total streams count
   * @param {number} analyticsData.revenue - Total revenue in dollars
   * @param {number} analyticsData.listeners - Total listeners count
   * @param {number} analyticsData.engagement - Engagement percentage (0-100)
   * @param {number[]} analyticsData.top_songs - Array of top song IDs
   * @param {Object[]} analyticsData.top_countries - Array of top country data
   * @param {string} analyticsData.top_countries[].name - Country name
   * @param {string} analyticsData.top_countries[].streams - Stream count for country
   * @param {number} analyticsData.top_countries[].percentage - Percentage of total streams
   * @param {string} analyticsData.top_countries[].flag - Country flag code (ISO 3166-1 alpha-2)
   */
  const createAnalytics = useCallback(async (analyticsData) => {
    if (!analyticsData.profileId) {
      setError('Profile ID is required');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/admin/users/analytics', analyticsData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      const createdAnalytics = response.data?.data || response.data;

      // Add the new analytics to the local state
      setAnalytics(prev => [...prev, createdAnalytics]);
      setCurrentAnalytics(createdAnalytics);

      setSuccess('Profile analytics created successfully');
      setTimeout(() => setSuccess(null), 3000);

      return createdAnalytics;
    } catch (err) {
      console.error('Create analytics error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            if (err.response.data?.message?.includes('already exists')) {
              setError('Analytics for this profile already exist');
            } else {
              setError(err.response.data?.message || 'Bad request - profileId required');
            }
            break;
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 404:
            setError('Profile not found');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(
              err.response.data?.message ||
              'Failed to create profile analytics'
            );
        }
      } else {
        setError('Network error – please check your connection');
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get analytics for a specific profile
   * @param {number|string} profileId - Profile ID (required)
   */
  const getProfileAnalytics = useCallback(async (profileId) => {
    if (!profileId) {
      setError('Profile ID is required');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.get(`/admin/users/analytics/${profileId}`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      const profileAnalytics = response.data?.data || response.data;
      
      // Set current analytics
      setCurrentAnalytics(profileAnalytics);

      return profileAnalytics;
    } catch (err) {
      console.error('Get profile analytics error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 404:
            setError('Analytics not found for this profile');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(
              err.response.data?.message ||
              'Failed to fetch profile analytics'
            );
        }
      } else {
        setError('Network error – please check your connection');
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update analytics for a profile
   * @param {number|string} profileId - Profile ID (required)
   * @param {Object} analyticsData
   * @param {number} [analyticsData.total_streams] - Total streams count
   * @param {number} [analyticsData.revenue] - Total revenue in dollars
   * @param {number} [analyticsData.listeners] - Total listeners count
   * @param {number} [analyticsData.engagement] - Engagement percentage (0-100)
   * @param {number[]} [analyticsData.top_songs] - Array of top song IDs
   * @param {Object[]} [analyticsData.top_countries] - Array of top country data
   */
  const updateAnalytics = useCallback(async (profileId, analyticsData) => {
    if (!profileId) {
      setError('Profile ID is required');
      return null;
    }

    if (!analyticsData.total_streams && 
        !analyticsData.revenue && 
        !analyticsData.listeners && 
        !analyticsData.engagement && 
        !analyticsData.top_songs && 
        !analyticsData.top_countries) {
      setError('At least one field is required to update');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put(`/admin/users/analytics/${profileId}`, analyticsData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      const updatedAnalytics = response.data?.data || response.data;

      // Update analytics in local state
      setAnalytics(prev =>
        prev.map(item =>
          item.profileid === Number(profileId) || item.profileId === Number(profileId)
            ? { ...item, ...updatedAnalytics }
            : item
        )
      );

      // Update current analytics if it's the one being updated
      if (currentAnalytics && 
          (currentAnalytics.profileid === Number(profileId) || 
           currentAnalytics.profileId === Number(profileId))) {
        setCurrentAnalytics(prev => ({ ...prev, ...updatedAnalytics }));
      }

      setSuccess('Profile analytics updated successfully');
      setTimeout(() => setSuccess(null), 3000);

      return updatedAnalytics;
    } catch (err) {
      console.error('Update analytics error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data?.message || 'No fields to update');
            break;
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 404:
            setError('Analytics not found for this profile');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(
              err.response.data?.message ||
              'Failed to update profile analytics'
            );
        }
      } else {
        setError('Network error – please check your connection');
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentAnalytics]);

  /**
   * Delete analytics for a profile
   * @param {number|string} profileId - Profile ID (required)
   */
  const deleteAnalytics = useCallback(async (profileId) => {
    if (!profileId) {
      setError('Profile ID is required');
      return false;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.delete(`/admin/users/analytics/${profileId}`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      // Remove analytics from local state
      setAnalytics(prev =>
        prev.filter(
          item => item.profileid !== Number(profileId) && item.profileId !== Number(profileId)
        )
      );

      // Clear current analytics if it's the one being deleted
      if (currentAnalytics && 
          (currentAnalytics.profileid === Number(profileId) || 
           currentAnalytics.profileId === Number(profileId))) {
        setCurrentAnalytics(null);
      }

      setSuccess('Profile analytics deleted successfully');
      setTimeout(() => setSuccess(null), 3000);

      return true;
    } catch (err) {
      console.error('Delete analytics error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 404:
            setError('Analytics not found for this profile');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(
              err.response.data?.message ||
              'Failed to delete profile analytics'
            );
        }
      } else {
        setError('Network error – please check your connection');
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentAnalytics]);

  /**
   * Fetch all analytics (if your API supports it - not in docs but useful)
   * Note: This endpoint is not in your documentation, so it's commented out
   * You would need to create this endpoint on your backend
   */
  // const fetchAllAnalytics = useCallback(async (options = {}) => {
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const params = {
  //       limit: options.limit ?? 20,
  //       offset: options.offset ?? 0,
  //     };

  //     const response = await axios.get('/admin/users/analytics', {
  //       withCredentials: true,
  //       headers: { 'Content-Type': 'application/json' },
  //       params,
  //     });

  //     const data = response.data?.data || response.data || [];
  //     const analyticsList = Array.isArray(data) ? data : [];

  //     setAnalytics(analyticsList);
  //     return analyticsList;
  //   } catch (err) {
  //     console.error('Fetch all analytics error:', err);
  //     // Error handling similar to other methods
  //     return [];
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  /** Reset error state */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  /** Reset success state */
  const resetSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  /** Clear current analytics */
  const clearCurrentAnalytics = useCallback(() => {
    setCurrentAnalytics(null);
  }, []);

  /** Clear all analytics state */
  const clearAnalytics = useCallback(() => {
    setAnalytics([]);
    setCurrentAnalytics(null);
    setError(null);
    setSuccess(null);
  }, []);

  /**
   * Format analytics data for display
   */
  const formatAnalyticsData = useCallback((analyticsData) => {
    if (!analyticsData) return null;
    
    const formatNumber = (num) => 
      new Intl.NumberFormat('en-US').format(num || 0);
    
    const formatCurrency = (amount) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(amount || 0);

    return {
      ...analyticsData,
      formattedRevenue: formatCurrency(analyticsData.revenue),
      formattedStreams: formatNumber(analyticsData.total_streams),
      formattedListeners: formatNumber(analyticsData.listeners),
      formattedEngagement: `${parseFloat(analyticsData.engagement || 0).toFixed(1)}%`,
      
      // Calculate derived metrics
      avgStreamsPerListener: analyticsData.listeners > 0 
        ? (analyticsData.total_streams / analyticsData.listeners).toFixed(1)
        : 0,
        
      revenuePerStream: analyticsData.total_streams > 0
        ? parseFloat(analyticsData.revenue / analyticsData.total_streams).toFixed(4)
        : 0,
        
      revenuePerListener: analyticsData.listeners > 0
        ? parseFloat(analyticsData.revenue / analyticsData.listeners).toFixed(2)
        : 0,
    };
  }, []);

  /**
   * Validate analytics data before submission
   */
  const validateAnalyticsData = useCallback((analyticsData, isUpdate = false) => {
    const errors = {};

    if (!isUpdate && !analyticsData.profileId) {
      errors.profileId = 'Profile ID is required';
    }

    if (analyticsData.engagement !== undefined) {
      const engagement = parseFloat(analyticsData.engagement);
      if (isNaN(engagement) || engagement < 0 || engagement > 100) {
        errors.engagement = 'Engagement must be a number between 0 and 100';
      }
    }

    if (analyticsData.revenue !== undefined) {
      const revenue = parseFloat(analyticsData.revenue);
      if (isNaN(revenue) || revenue < 0) {
        errors.revenue = 'Revenue must be a positive number';
      }
    }

    if (analyticsData.total_streams !== undefined) {
      const streams = parseInt(analyticsData.total_streams);
      if (isNaN(streams) || streams < 0) {
        errors.total_streams = 'Total streams must be a positive integer';
      }
    }

    if (analyticsData.listeners !== undefined) {
      const listeners = parseInt(analyticsData.listeners);
      if (isNaN(listeners) || listeners < 0) {
        errors.listeners = 'Listeners must be a positive integer';
      }
    }

    if (analyticsData.top_countries && !Array.isArray(analyticsData.top_countries)) {
      errors.top_countries = 'Top countries must be an array';
    } else if (Array.isArray(analyticsData.top_countries)) {
      analyticsData.top_countries.forEach((country, index) => {
        if (!country.name) {
          errors[`top_countries.${index}.name`] = 'Country name is required';
        }
        if (country.percentage && (country.percentage < 0 || country.percentage > 100)) {
          errors[`top_countries.${index}.percentage`] = 'Percentage must be between 0 and 100';
        }
      });
    }

    if (analyticsData.top_songs && !Array.isArray(analyticsData.top_songs)) {
      errors.top_songs = 'Top songs must be an array';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, []);

  /**
   * Generate mock analytics data for testing
   */
  const generateMockAnalytics = useCallback((profileId) => {
    const mockStreams = Math.floor(Math.random() * 1000000) + 10000;
    const mockRevenue = parseFloat((mockStreams * 0.003).toFixed(2));
    const mockListeners = Math.floor(Math.random() * 50000) + 1000;
    const mockEngagement = parseFloat((Math.random() * 50 + 30).toFixed(1));

    const countries = [
      { name: 'United States', flag: 'US' },
      { name: 'United Kingdom', flag: 'GB' },
      { name: 'Canada', flag: 'CA' },
      { name: 'Australia', flag: 'AU' },
      { name: 'Germany', flag: 'DE' },
      { name: 'France', flag: 'FR' },
      { name: 'Japan', flag: 'JP' },
      { name: 'Brazil', flag: 'BR' },
    ];

    const selectedCountries = countries
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 4) + 2);
    
    let totalPercentage = 0;
    const topCountries = selectedCountries.map((country, index) => {
      const streams = Math.floor(Math.random() * 100000) + 5000;
      const percentage = Math.floor(Math.random() * 30) + 15;
      totalPercentage += percentage;
      
      return {
        ...country,
        streams: streams.toString(),
        percentage: index === selectedCountries.length - 1 
          ? 100 - (totalPercentage - percentage) 
          : percentage,
      };
    });

    return {
      profileId,
      total_streams: mockStreams,
      revenue: mockRevenue,
      listeners: mockListeners,
      engagement: mockEngagement,
      top_songs: Array.from({ length: 4 }, (_, i) => i + 1),
      top_countries: topCountries,
    };
  }, []);

  return {
    // State
    analytics,
    currentAnalytics,
    isLoading,
    error,
    success,
    
    // CRUD Operations
    createAnalytics,
    getProfileAnalytics,
    updateAnalytics,
    deleteAnalytics,
    // fetchAllAnalytics, // Uncomment when backend endpoint is available
    
    // Utility Functions
    formatAnalyticsData,
    validateAnalyticsData,
    generateMockAnalytics,
    
    // State Management
    resetError,
    resetSuccess,
    clearCurrentAnalytics,
    clearAnalytics,
  };
};

// Export a simpler version if you don't need all the utilities
export const useProfileAnalyticsSimple = () => {
  const {
    analytics,
    currentAnalytics,
    isLoading,
    error,
    success,
    createAnalytics,
    getProfileAnalytics,
    updateAnalytics,
    deleteAnalytics,
    resetError,
    resetSuccess,
    clearCurrentAnalytics,
    clearAnalytics,
  } = useProfileAnalytics();

  return {
    analytics,
    currentAnalytics,
    isLoading,
    error,
    success,
    createAnalytics,
    getProfileAnalytics,
    updateAnalytics,
    deleteAnalytics,
    resetError,
    resetSuccess,
    clearCurrentAnalytics,
    clearAnalytics,
  };
};