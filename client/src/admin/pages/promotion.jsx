import { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Search,
  AlertCircle,
  Edit
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';

// Mock hook for demonstration - replace with your actual API hook
const usePromotions = () => {
  const [promotions, setPromotions] = useState([
    {
      id: 'PROM001',
      title: 'Summer Chart Boost',
      category: 'chart',
      status: 'active',
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      budget: 499.99,
      created_at: '2024-06-15T10:30:00Z',
      start_date: '2024-06-16T00:00:00Z',
      end_date: '2024-07-16T23:59:59Z'
    },
    {
      id: 'PROM002',
      title: 'TikTok Viral Campaign',
      category: 'tiktok',
      status: 'pending',
      customer_name: 'Jane Smith',
      customer_email: 'jane@example.com',
      budget: 299.99,
      created_at: '2024-06-14T15:45:00Z',
      start_date: '2024-06-17T00:00:00Z',
      end_date: '2024-07-01T23:59:59Z'
    },
    {
      id: 'PROM003',
      title: 'Radio Airplay',
      category: 'radio',
      status: 'completed',
      customer_name: 'Mike Johnson',
      customer_email: 'mike@example.com',
      budget: 999.99,
      created_at: '2024-06-13T09:15:00Z',
      start_date: '2024-06-01T00:00:00Z',
      end_date: '2024-06-10T23:59:59Z'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 3,
    limit: 10,
    offset: 0
  });

  const fetchPromotions = async (page = 1, statusFilter = null, categoryFilter = null) => {
    setIsLoading(true);
    try {
      // Simulate API call to /api/admin/promotions
      const offset = (page - 1) * pagination.limit;
      let filtered = promotions;
      if (statusFilter && statusFilter !== 'all') {
        filtered = filtered.filter(p => p.status === statusFilter);
      }
      if (categoryFilter && categoryFilter !== 'all') {
        filtered = filtered.filter(p => p.category === categoryFilter);
      }
      setPagination(prev => ({ ...prev, currentPage: page, offset, total: filtered.length }));
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch promotions');
      setIsLoading(false);
    }
  };

  const updatePromotionStatus = async (promotionId, category, status) => {
    setIsLoading(true);
    try {
      // Simulate API call to PUT /api/admin/promotions
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPromotions(prev => prev.map(p => 
        p.id === promotionId ? { ...p, category, status } : p
      ));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Failed to update promotion status');
      setIsLoading(false);
      return false;
    }
  };

  const resetError = () => setError(null);

  return {
    promotions,
    isLoading,
    error,
    pagination,
    updateSuccess,
    fetchPromotions,
    updatePromotionStatus,
    resetError
  };
};

const AdminPromotionsPage = () => {
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [promotionToUpdate, setPromotionToUpdate] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Update form states
  const [newStatus, setNewStatus] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const { 
    promotions, 
    isLoading, 
    error, 
    pagination, 
    updateSuccess,
    fetchPromotions,
    updatePromotionStatus,
    resetError 
  } = usePromotions();

  // Fetch promotions on page or filter change
  useEffect(() => {
    fetchPromotions(currentPage, statusFilter, categoryFilter);
  }, [currentPage, statusFilter, categoryFilter]);

  // Handle view promotion details
  const handleViewPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setIsViewModalOpen(true);
  };

  // Handle update modal
  const handleUpdateClick = (promotion) => {
    setPromotionToUpdate(promotion);
    setNewStatus(promotion.status);
    setNewCategory(promotion.category);
    setIsUpdateModalOpen(true);
  };

  // Handle status update
  const handleUpdateSubmit = async () => {
    if (!promotionToUpdate || !newStatus || !newCategory) return;
    
    const success = await updatePromotionStatus(
      promotionToUpdate.id,
      newCategory,
      newStatus
    );
    
    if (success) {
      setIsUpdateModalOpen(false);
    }
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Filter promotions based on search term
  const filteredPromotions = promotions.filter(promotion => {
    const searchLower = searchTerm.toLowerCase();
    return (
      promotion.id?.toLowerCase().includes(searchLower) ||
      promotion.title?.toLowerCase().includes(searchLower) ||
      promotion.customer_name?.toLowerCase().includes(searchLower) ||
      promotion.customer_email?.toLowerCase().includes(searchLower)
    );
  });

  const handlePageChange = (pageId) => {
    console.log('Navigate to:', pageId);
  };

  // Stats calculations
  const totalPromotions = promotions.length;
  const activePromotions = promotions.filter(p => p.status === 'active').length;
  const pendingPromotions = promotions.filter(p => p.status === 'pending').length;

  // Available filter options from API spec
  const statusOptions = [
    'all', 'active', 'pending', 'expired', 'deleted', 'success', 'failed', 
    'cancelled', 'completed', 'incomplete', 'incomplete_expired', 'incomplete_cancelled'
  ];
  const categoryOptions = [
    'all', 'national', 'international', 'tv', 'radio', 'chart', 
    'digital', 'playlist', 'tiktok', 'youtube'
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        currentPage="promotion"
        onPageChange={handlePageChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
      }`}>
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
            {/* Header section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900">Promotion Management</h1>
                  <p className="mt-2 text-gray-600">Manage promotional campaigns and their statuses</p>
                </div>
                
                {/* Search bar and filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] sm:text-sm transition duration-150 ease-in-out"
                      placeholder="Search promotions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] transition duration-150 ease-in-out"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                  </select>
                  
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] transition duration-150 ease-in-out"
                  >
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>{category === 'all' ? 'All Categories' : category.replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Megaphone className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Promotions</p>
                    <p className="text-2xl font-bold text-gray-900">{totalPromotions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Promotions</p>
                    <p className="text-2xl font-bold text-gray-900">{activePromotions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Promotions</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingPromotions}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Error notification */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={resetError}
                      className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Success notification */}
            {updateSuccess && (
              <div className="fixed top-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-lg z-50 animate-fade-in-out">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Promotion status updated successfully!</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Main content */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promotion ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promotion & Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d7a63]"></div>
                            <span className="ml-3 text-gray-600">Loading promotions...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredPromotions.length > 0 ? (
                      filteredPromotions.map((promotion) => (
                        <tr 
                          key={promotion.id} 
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {promotion.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center">
                                <Megaphone className="h-4 w-4 text-[#2d7a63]" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{promotion.title}</div>
                                <div className="text-xs text-gray-400">{promotion.customer_name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {promotion.category.replace(/\b\w/g, c => c.toUpperCase())}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                            ${promotion.budget}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              promotion.status === 'active' ? 'bg-green-100 text-green-800' :
                              promotion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              promotion.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {promotion.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewPromotion(promotion)}
                              className="inline-flex items-center text-[#2d7a63] hover:text-[#245a4f] mr-4 transition duration-150"
                            >
                              <Eye size={16} className="mr-1" /> 
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() => handleUpdateClick(promotion)}
                              className="inline-flex items-center text-blue-600 hover:text-blue-900 transition duration-150"
                            >
                              <Edit size={16} className="mr-1" /> 
                              <span className="hidden sm:inline">Update</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                          {searchTerm ? 'No promotions found matching your search' : 'No promotions found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination controls */}
              {promotions.length > 0 && !searchTerm && (
                <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                    Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                    <span className="font-medium">{pagination.totalPages}</span> (Total:{' '}
                    <span className="font-medium">{pagination.total}</span> promotions)
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={goToPrevPage}
                      disabled={pagination.currentPage === 1}
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md 
                        ${pagination.currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Previous
                    </button>
                    <button
                      onClick={goToNextPage}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md 
                        ${pagination.currentPage === pagination.totalPages 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      Next
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* View Promotion Modal */}
      {isViewModalOpen && selectedPromotion && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Promotion Details</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d7a63] p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="h-20 w-20 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center">
                  <Megaphone className="h-10 w-10 text-[#2d7a63]" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{selectedPromotion.title}</h3>
                <p className="mt-1 text-sm text-gray-500">by {selectedPromotion.customer_name}</p>
                <span className={`mt-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  selectedPromotion.status === 'active' ? 'bg-green-100 text-green-800' :
                  selectedPromotion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedPromotion.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedPromotion.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion ID</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedPromotion.id}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedPromotion.category.replace(/\b\w/g, c => c.toUpperCase())}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedPromotion.customer_name}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedPromotion.customer_email}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</h4>
                  <p className="mt-1 text-sm text-gray-900">${selectedPromotion.budget}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedPromotion.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedPromotion.start_date).toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedPromotion.end_date).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-[#2d7a63] text-white rounded-md hover:bg-[#245a4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d7a63] transition duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Status Modal */}
      {isUpdateModalOpen && promotionToUpdate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Update Promotion Status</h2>
              <button 
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d7a63] p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Megaphone className="h-5 w-5 text-[#2d7a63]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{promotionToUpdate.title}</p>
                    <p className="text-sm text-gray-500">by {promotionToUpdate.customer_name}</p>
                    <p className="text-xs text-gray-400">Promotion ID: {promotionToUpdate.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] transition duration-150 ease-in-out"
                  >
                    {statusOptions.filter(s => s !== 'all').map(status => (
                      <option key={status} value={status}>{status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] transition duration-150 ease-in-out"
                  >
                    {categoryOptions.filter(c => c !== 'all').map(category => (
                      <option key={category} value={category}>{category.replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d7a63] transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                disabled={isLoading}
                className={`px-4 py-2 bg-[#2d7a63] text-white rounded-md hover:bg-[#245a4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d7a63] transition duration-150 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </span>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromotionsPage;