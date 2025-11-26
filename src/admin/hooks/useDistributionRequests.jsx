import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_PAGE_SIZE = 25;

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Custom hook for handling distribution requests API operations
 */
export const useDistributionRequests = () => {
  // Data states
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [markReadSuccess, setMarkReadSuccess] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    totalPages: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });

  /**
   * Fetch all distribution requests
   */
  const fetchRequests = useCallback(async (readFilter = null, page = 1, limit = DEFAULT_PAGE_SIZE) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = { page, limit };
      if (readFilter !== null) {
        params.read = readFilter;
      }

      const response = await axios.get(`/admin/distribution-requests`, {
        withCredentials: true,
        params
      });

      if (response.status === 200) {
        // Handle different possible response formats
        let requestsData = [];
        if (response.data) {
          if (Array.isArray(response.data)) {
            requestsData = response.data;
          } else if (response.data.requests && Array.isArray(response.data.requests)) {
            requestsData = response.data.requests;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            requestsData = response.data.data;
          } else if (response.data.results && Array.isArray(response.data.results)) {
            requestsData = response.data.results;
          }
        }
        
        setRequests(requestsData);
        
        const apiPagination = response.data?.pagination || response.data?.meta;
        const total = apiPagination?.total ?? apiPagination?.total_count ?? requestsData.length ?? 0;
        const totalPages = apiPagination?.totalPages || apiPagination?.last_page || Math.max(1, Math.ceil((total || 0) / limit) || 1);

        setPagination({
          currentPage: apiPagination?.currentPage || apiPagination?.current_page || page,
          total,
          totalPages,
          pageSize: apiPagination?.pageSize || apiPagination?.per_page || limit
        });
      } else {
        // Default pagination if none provided
        setRequests([]);
        setPagination({
          currentPage: page,
          total: 0,
          totalPages: 1,
          pageSize: limit
        });
      }
    } catch (err) {
      console.error('Distribution requests fetch error:', err);
      if (err.response) {
        setError(err.response.data?.message || 'Failed to fetch distribution requests');
      } else {
        setError('Network error - please try again');
      }
      
      // If API is not available, use mock data for development
      if (err.response?.status === 404 || err.code === 'ERR_NETWORK') {
        console.log('API not available, using mock data for development');
        const mockRequests = [
          {
            id: 1,
            artistName: "MC Flow",
            email: "mcflow@email.com",
            songTitle: "Summer Vibes",
            distributionType: "Digital",
            platforms: ["Spotify", "Apple Music", "YouTube Music"],
            message: "Looking to distribute my latest track across all major platforms. This is a hip-hop track with summer vibes.",
            read: false,
            submittedAt: "2025-06-15T10:30:00Z",
            genre: "Hip Hop",
            releaseDate: "2025-07-01",
            contactPhone: "+1234567890"
          },
          {
            id: 2,
            artistName: "Sarah Melody",
            email: "sarah.melody@email.com",
            songTitle: "Midnight Dreams",
            distributionType: "Physical + Digital",
            platforms: ["All Major Platforms", "Vinyl", "CD"],
            message: "I need help distributing my indie pop album both digitally and physically.",
            read: true,
            submittedAt: "2025-06-14T15:45:00Z",
            genre: "Indie Pop",
            releaseDate: "2025-08-15",
            contactPhone: "+9876543210"
          },
          {
            id: 3,
            artistName: "Electric Beats",
            email: "electric@email.com",
            songTitle: "Neon Lights",
            distributionType: "Digital",
            platforms: ["Spotify", "SoundCloud", "Bandcamp"],
            message: "Electronic music producer seeking distribution for my latest EP.",
            read: false,
            submittedAt: "2025-06-13T09:20:00Z",
            genre: "Electronic",
            releaseDate: "2025-06-30",
            contactPhone: "+5555555555"
          }
        ];
        
        setRequests(mockRequests);
        setPagination({
          currentPage: 1,
          total: mockRequests.length,
          totalPages: 1,
          pageSize: limit
        });
        setError('Using demo data - API not available');
      } else {
        // Set empty array to prevent filter errors
        setRequests([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mark a distribution request as read or unread
   */
  const markRequestAsRead = useCallback(async (distributionId, readStatus) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/admin/distribution-requests/read`,
        {
          distributionId,
          read: readStatus
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.status === 200) {
        setMarkReadSuccess(true);
        
        // Update the local state to reflect the change
        setRequests(prev => prev.map(req => 
          req.id === distributionId ? { ...req, read: readStatus } : req
        ));
        
        // Clear success message after 3 seconds
        setTimeout(() => setMarkReadSuccess(false), 3000);
        
        return true;
      }
      return false;
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('Required fields missing');
            break;
          case 404:
            setError('Distribution request does not exist');
            break;
          case 500:
            setError('Server error - please try again later');
            break;
          default:
            setError(err.response.data?.message || 'Failed to update request status');
        }
      } else {
        setError('Network error - please try again');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle API errors with appropriate messages
   */
  const handleApiError = useCallback((err) => {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        switch (err.response.status) {
          case 400: setError('Validation error: Invalid request'); break;
          case 401: setError('Unauthorized - Please login again'); break;
          case 403: setError('Forbidden - You lack necessary permissions'); break;
          case 404: setError('Distribution request not found'); break;
          case 500: setError('Server error - Please try again later'); break;
          default: setError('Failed to fetch distribution requests');
        }
      } else {
        setError('Network error - Could not connect to server');
      }
    } else {
      setError('An unexpected error occurred');
    }
  }, []);

  /**
   * Reset any API errors
   */
  const resetError = useCallback(() => setError(null), []);

  // Initial fetch when hook is first used
  useEffect(() => {
    fetchRequests(null, 1, DEFAULT_PAGE_SIZE);
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    error,
    pagination,
    markReadSuccess,
    fetchRequests,
    markRequestAsRead,
    resetError
  };
};