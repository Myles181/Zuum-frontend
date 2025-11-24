import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Custom hook for handling beat purchases API operations
 */
export const useBeatPurchases = () => {
  // Data states
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    totalPages: 0
  });

  /**
   * Fetch recent beat purchases with pagination and filtering
   */
  const fetchPurchases = useCallback(async (page = 1, limit = 10, sendEmailFilter = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit
      };
      
      if (sendEmailFilter !== null) {
        params.send_email = sendEmailFilter;
      }

      console.log('Fetching beat purchases from:', `${API_URL}/admin/beat/recent-purchases`);
      console.log('API_URL:', API_URL);
      console.log('Params:', params);

      const response = await axios.get(`${API_URL}/admin/beat/recent-purchases`, {
        withCredentials: true,
        params
      });

      console.log('Beat purchases response:', response.data);

      if (response.status === 200) {
        // Handle different possible response formats
        let purchasesData = [];
        if (response.data) {
          if (Array.isArray(response.data)) {
            purchasesData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            purchasesData = response.data.data;
          } else if (response.data.purchases && Array.isArray(response.data.purchases)) {
            purchasesData = response.data.purchases;
          } else if (response.data.results && Array.isArray(response.data.results)) {
            purchasesData = response.data.results;
          }
        }
        
        console.log('Processed purchases data:', purchasesData);
        
        // Transform the data to match our expected format
        const transformedPurchases = purchasesData.map(purchase => ({
          id: purchase.id,
          beat_title: purchase.beat_name,
          artist_name: `${purchase.firstname} ${purchase.lastname}`,
          customer_name: purchase.customer_name,
          customer_email: purchase.customer_email,
          license_type: purchase.license_type || 'Standard',
          purchase_amount: purchase.amount_paid / 100, // Convert from cents to dollars
          purchase_date: purchase.purchase_date,
          send_email: purchase.send_email,
          license_uploaded: purchase.license !== null,
          status: purchase.status,
          delivered: purchase.delivered,
          license_status: purchase.license_status
        }));
        
        setPurchases(transformedPurchases);
        
        // Handle pagination data
        if (response.data && response.data.pagination) {
          setPagination({
            currentPage: response.data.pagination.page || 1,
            total: response.data.pagination.total || transformedPurchases.length,
            totalPages: response.data.pagination.has_more ? response.data.pagination.page + 1 : response.data.pagination.page
          });
        } else if (response.data && response.data.meta) {
          setPagination({
            currentPage: response.data.meta.current_page || 1,
            total: response.data.meta.total || transformedPurchases.length,
            totalPages: response.data.meta.last_page || 1
          });
        } else {
          // Default pagination if none provided
          setPagination({
            currentPage: page,
            total: transformedPurchases.length,
            totalPages: 1
          });
        }
      }
    } catch (err) {
      console.error('Beat purchases fetch error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // If API is not available, use mock data for development
      if (err.response?.status === 404 || err.code === 'ERR_NETWORK') {
        console.log('API not available, using mock data for development');
        const mockPurchases = [
          {
            id: 'BP001',
            beat_title: 'Summer Vibes',
            artist_name: 'DJ Producer',
            customer_name: 'John Doe',
            customer_email: 'john@example.com',
            license_type: 'Premium',
            purchase_amount: 29.99,
            purchase_date: '2024-06-15T10:30:00Z',
            send_email: false,
            license_uploaded: false,
            status: 'pending'
          },
          {
            id: 'BP002',
            beat_title: 'Dark Nights',
            artist_name: 'Beat Master',
            customer_name: 'Jane Smith',
            customer_email: 'jane@example.com',
            license_type: 'Basic',
            purchase_amount: 19.99,
            purchase_date: '2024-06-14T15:45:00Z',
            send_email: true,
            license_uploaded: true,
            status: 'completed'
          },
          {
            id: 'BP003',
            beat_title: 'Trap Energy',
            artist_name: 'Sound Wave',
            customer_name: 'Mike Johnson',
            customer_email: 'mike@example.com',
            license_type: 'Exclusive',
            purchase_amount: 199.99,
            purchase_date: '2024-06-13T09:15:00Z',
            send_email: false,
            license_uploaded: true,
            status: 'pending'
          }
        ];
        
        setPurchases(mockPurchases);
        setPagination({
          currentPage: 1,
          total: mockPurchases.length,
          totalPages: 1
        });
        setError('Using demo data - API not available');
      } else {
        if (err.response) {
          setError(err.response.data?.message || 'Failed to fetch beat purchases');
        } else {
          setError('Network error - please try again');
        }
        // Set empty array to prevent filter errors
        setPurchases([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update beat purchase license with file upload
   */
  const updatePurchaseLicense = useCallback(async (beatPurchaseId, licenseFile, sendEmail) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('beat_purchase_id', beatPurchaseId);
      formData.append('send_email', sendEmail);
      formData.append('license', licenseFile);

      const response = await axios.post(
        `${API_URL}/admin/beat/update-purchase`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        setUploadSuccess(true);
        
        // Update the local state to reflect the change
        setPurchases(prev => prev.map(p => 
          p.id === beatPurchaseId 
            ? { ...p, license_uploaded: true, send_email: sendEmail, license_status: 'Uploaded' }
            : p
        ));
        
        // Clear success message after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
        
        return true;
      }
      return false;
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('Beat purchase ID is required');
            break;
          case 404:
            setError('Beat Purchase ID not found');
            break;
          case 406:
            setError('License must be a PDF file');
            break;
          case 500:
            setError('License upload or server error');
            break;
          default:
            setError(err.response.data?.message || 'Failed to upload license');
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
          case 404: setError('Beat purchase not found'); break;
          case 406: setError('Invalid file format'); break;
          case 500: setError('Server error - Please try again later'); break;
          default: setError('Failed to fetch beat purchases');
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
    fetchPurchases();
  }, [fetchPurchases]);

  return {
    purchases,
    isLoading,
    error,
    pagination,
    uploadSuccess,
    fetchPurchases,
    updatePurchaseLicense,
    resetError
  };
}; 