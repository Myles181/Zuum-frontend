import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Search,
  AlertCircle,
  Edit,
  Menu,
  Filter,
  TrendingUp,
  Calendar
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { usePromotions } from '../hooks/usePromotions';

const AdminPromotionsPage = () => {
  const navigate = useNavigate();
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  // Modal states
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Use the real API hook
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

  // Filter promotions based on search term and filters
  const filteredPromotions = Array.isArray(promotions) ? promotions.filter(promotion => {
    const matchesSearch = searchTerm === '' || 
      promotion.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.id?.toString().includes(searchTerm);
    
    const matchesStatusFilter = statusFilter === 'all' || promotion.status === statusFilter;
    const matchesCategoryFilter = categoryFilter === 'all' || promotion.category === categoryFilter;
    
    return matchesSearch && matchesStatusFilter && matchesCategoryFilter;
  }) : [];

  // Calculate stats from real data
  const totalPromotions = Array.isArray(promotions) ? promotions.length : 0;
  const activePromotions = Array.isArray(promotions) ? promotions.filter(p => p.status === 'active').length : 0;
  const pendingPromotions = Array.isArray(promotions) ? promotions.filter(p => p.status === 'pending').length : 0;

  console.log('Raw promotions data:', promotions);
  console.log('Filtered promotions:', filteredPromotions);
  console.log('Total promotions:', totalPromotions);

  // Handle view promotion details
  const handleViewPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setIsViewModalOpen(true);
  };

  // Handle update promotion status
  const handleUpdateClick = (promotion) => {
    setSelectedPromotion(promotion);
    setNewStatus(promotion.status);
    setIsUpdateModalOpen(true);
  };

  // Handle status update submission
  const handleUpdateSubmit = async () => {
    if (!selectedPromotion || !newStatus) {
      return;
    }

    const success = await updatePromotionStatus(
      selectedPromotion.id,
      selectedPromotion.category,
      newStatus
    );

    if (success) {
      setIsUpdateModalOpen(false);
      setSelectedPromotion(null);
      setNewStatus('');
    }
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchPromotions(
        statusFilter === 'all' ? null : statusFilter,
        categoryFilter === 'all' ? null : categoryFilter,
        10,
        pagination.currentPage * 10
      );
    }
  };

  const goToPrevPage = () => {
    if (pagination.currentPage > 1) {
      fetchPromotions(
        statusFilter === 'all' ? null : statusFilter,
        categoryFilter === 'all' ? null : categoryFilter,
        10,
        (pagination.currentPage - 2) * 10
      );
    }
  };

  // Status and category options
  const statusOptions = [
    'all', 'active', 'pending', 'expired', 'deleted', 'success', 'failed', 
    'cancelled', 'completed', 'incomplete', 'incomplete_expired', 'incomplete_cancelled'
  ];

  const categoryOptions = [
    'all', 'national', 'international', 'tv', 'radio', 'chart', 
    'digital', 'playlist', 'tiktok', 'youtube'
  ];

  console.log('Raw promotions data:', promotions);
  console.log('Filtered promotions:', filteredPromotions);
  console.log('Total promotions:', totalPromotions);

  const adminRoutes = {
    users: '/users',
    distribution: '/addistributions',
    beat: '/adbeat',
    'beat-posts': '/admin-beat-posts',
    'audio-posts': '/admin-audio-posts',
    promotion: '/adpromotion',
    wallet: '/admin-wallet',
    subscriptions: '/admin-subscriptions',
  };

  const handlePageChange = (pageId) => {
    const targetRoute = adminRoutes[pageId];
    if (targetRoute) {
      navigate(targetRoute);
    } else {
        console.log('Unknown page:', pageId);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                <Menu size={22} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Promotions</h1>
                <p className="text-sm text-gray-500">Manage promotions</p>
              </div>
            </div>
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              <Search size={22} />
            </button>
          </div>
          
          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="mb-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-base bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] transition-all duration-200"
                  placeholder="Search promotions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Mobile Filters */}
          <div className="flex items-center space-x-3">
            <Filter size={18} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] transition-all duration-200"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] transition-all duration-200"
            >
              <option value="all">All Categories</option>
              <option value="national">National</option>
              <option value="international">International</option>
              <option value="tv">TV</option>
              <option value="radio">Radio</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8 px-6 pt-6">
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
                    {statusOptions.filter(s => s !== 'all').map(status => (
                      <option key={status} value={status}>{status?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || status}</option>
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
            <div className="px-4 lg:px-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User size={24} className="text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-sm font-medium text-gray-700">Total Promotions</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{totalPromotions}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp size={24} className="text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-sm font-medium text-gray-700">Active Promotions</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{activePromotions}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Calendar size={24} className="text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-sm font-medium text-gray-700">Pending Promotions</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{pendingPromotions}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Error notification */}
            {error && (
              <div className="mx-4 lg:mx-6 mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle size={20} className="text-red-500" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                      <button
                        onClick={resetError}
                        className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Success notification */}
            {updateSuccess && (
              <div className="fixed top-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg z-50 animate-fade-in-out">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check size={20} className="text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Promotion status updated successfully!</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Main content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full bg-gray-50 shadow-sm rounded-lg overflow-hidden border border-gray-200 mx-4 lg:mx-6">
                {/* Desktop List */}
                <div className="hidden lg:block h-full overflow-auto">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <div className="flex justify-center items-center space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d7a63]" />
                        <span className="text-sm text-gray-600">
                          Loading promotions...
                        </span>
                      </div>
                    </div>
                  ) : filteredPromotions.length > 0 ? (
                    <>
                      {/* Header row */}
                      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 border-b border-gray-200 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="col-span-3">Campaign</div>
                        <div className="col-span-3">Customer</div>
                        <div className="col-span-3">Category & Dates</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                      </div>

                      {/* Rows */}
                      <div className="divide-y divide-gray-200 bg-white">
                        {filteredPromotions.map((promotion, index) => {
                          const status = promotion.status || 'pending';
                          const statusClasses =
                            status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-700';

                          const categoryLabel =
                            promotion.category_type ||
                            promotion.category ||
                            'Uncategorized';

                          const startDate = promotion.start_date || promotion.startDate;
                          const endDate = promotion.end_date || promotion.endDate;

                          const formatPromotionDate = (value) =>
                            value
                              ? new Date(value).toLocaleDateString('en-NG', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : null;

                          const startLabel = formatPromotionDate(startDate);
                          const endLabel = formatPromotionDate(endDate);

                          return (
                            <div
                              key={`${promotion.id}-${index}`}
                              className="px-6 py-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="grid grid-cols-12 gap-4 items-center">
                                {/* Campaign */}
                                <div className="col-span-3 flex items-start gap-3">
                                  <div className="h-9 w-9 rounded-full bg-[#2d7a63]/10 flex items-center justify-center">
                                    <User size={16} className="text-[#2d7a63]" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                      {promotion.title ||
                                        promotion.name ||
                                        'Untitled campaign'}
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-500 truncate">
                                      ID #{promotion.id || 'N/A'}
                                    </p>
                                  </div>
                                </div>

                                {/* Customer */}
                                <div className="col-span-3 text-xs text-gray-600 space-y-1">
                                  <p className="truncate">
                                    <span className="text-gray-500">Name: </span>
                                    <span className="font-medium text-gray-800">
                                      {promotion.customer_name ||
                                        promotion.user_name ||
                                        promotion.user?.name ||
                                        'Unknown customer'}
                                    </span>
                                  </p>
                                  {promotion.customer_email && (
                                    <p className="truncate">
                                      <span className="text-gray-500">Email: </span>
                                      <span className="font-medium text-gray-800">
                                        {promotion.customer_email}
                                      </span>
                                    </p>
                                  )}
                                </div>

                                {/* Category & dates */}
                                <div className="col-span-3 text-xs text-gray-600 space-y-1.5">
                                  <div>
                                    <span className="text-gray-500">Category: </span>
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-800">
                                      {categoryLabel}
                                    </span>
                                  </div>
                                  {(startLabel || endLabel) && (
                                    <p className="text-[11px] text-gray-500">
                                      {startLabel && `From ${startLabel}`}
                                      {startLabel && endLabel && ' · '}
                                      {endLabel && `To ${endLabel}`}
                                    </p>
                                  )}
                                </div>

                                {/* Status */}
                                <div className="col-span-2 text-xs text-gray-600 space-y-1">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusClasses}`}
                                  >
                                    {status.replace(/_/g, ' ')}
                                  </span>
                                  {promotion.budget && (
                                    <p className="text-[11px] text-gray-500">
                                      Budget:{' '}
                                      <span className="font-medium text-gray-800">
                                        ₦
                                        {Number(promotion.budget).toLocaleString()}
                                      </span>
                                    </p>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex justify-end gap-2">
                                  <button
                                    onClick={() => handleViewPromotion(promotion)}
                                    className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                  >
                                    <Eye size={14} className="mr-1" />
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleUpdateClick(promotion)}
                                    className="inline-flex items-center rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                                  >
                                    <Edit size={14} className="mr-1" />
                                    Edit
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center text-sm text-gray-500">
                      {searchTerm
                        ? 'No promotions found matching your search'
                        : 'No promotions found'}
                    </div>
                  )}
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden h-full overflow-auto">
                  {isLoading ? (
                    <div className="p-6 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d7a63]"></div>
                        <span className="ml-3 text-gray-600">Loading promotions...</span>
                      </div>
                    </div>
                  ) : filteredPromotions.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredPromotions.map((promotion, index) => (
                        <div 
                          key={`${promotion.id}-${index}`} 
                          className="p-4 transition duration-150"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center">
                                <User size={24} className="text-[#2d7a63]" />
                              </div>
                              <div className="ml-3">
                                <div className="text-base font-semibold text-black">{promotion.title || promotion.name}</div>
                                <div className="text-sm text-black font-medium">ID: {promotion.id}</div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                              ${promotion.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : promotion.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'}`}
                            >
                              {promotion.status}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="text-sm text-black font-medium">
                              <span className="font-medium">Customer:</span> {promotion.customer_name || promotion.user_name || promotion.user?.name || 'NO CUSTOMER'}
                            </div>
                            <div className="text-sm text-black font-medium">
                              <span className="font-medium">Category:</span> {promotion.category_type || promotion.category || 'NO CATEGORY'}
                            </div>
                            <div className="text-sm text-black font-medium">
                              <span className="font-medium">Email:</span> {promotion.customer_email || promotion.user_email || promotion.user?.email || 'NO EMAIL'}
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleViewPromotion(promotion)}
                              className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-[#2d7a63] text-sm font-medium rounded-lg text-[#2d7a63] bg-white hover:bg-[#245a4f] hover:text-white transition duration-150 shadow-sm"
                            >
                              <Eye size={16} className="mr-2" /> 
                              View Details
                            </button>
                            <button
                              onClick={() => handleUpdateClick(promotion)}
                              className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-600 hover:text-white transition duration-150 shadow-sm"
                            >
                              <Edit size={16} className="mr-2" /> 
                              Update Status
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-sm text-gray-500">
                      {searchTerm ? 'No promotions found matching your search' : 'No promotions found'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Pagination controls */}
            {promotions.length > 0 && !searchTerm && (
              <div className="px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white">
                <div className="text-sm text-gray-700 mb-4 sm:mb-0 text-center sm:text-left">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span> (Total:{' '}
                  <span className="font-medium">{pagination.total}</span> promotions)
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={goToPrevPage}
                    disabled={pagination.currentPage === 1}
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg 
                      ${pagination.currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'}`}
                  >
                    <ChevronLeft size={18} className="mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <button
                    onClick={goToNextPage}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg 
                      ${pagination.currentPage === pagination.totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'}`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={18} className="ml-1" />
                  </button>
                </div>
              </div>
            )}
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
                  <User size={40} className="text-[#2d7a63]" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{selectedPromotion.title}</h3>
                <p className="mt-1 text-sm text-gray-500">by {selectedPromotion.customer_name}</p>
                <span className={`mt-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  selectedPromotion.status === 'active' ? 'bg-green-100 text-green-800' :
                  selectedPromotion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedPromotion.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedPromotion.status?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion ID</h4>
                  <p className="mt-1 text-sm text-black font-medium">{selectedPromotion.id}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</h4>
                  <p className="mt-1 text-sm text-black font-medium">{selectedPromotion.category?.replace(/\b\w/g, c => c.toUpperCase()) || 'N/A'}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</h4>
                  <p className="mt-1 text-sm text-black font-medium">{selectedPromotion.customer_name}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</h4>
                  <p className="mt-1 text-sm text-black font-medium">{selectedPromotion.customer_email}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</h4>
                  <p className="mt-1 text-sm text-black font-medium">${selectedPromotion.budget}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</h4>
                  <p className="mt-1 text-sm text-black font-medium">{new Date(selectedPromotion.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</h4>
                  <p className="mt-1 text-sm text-black font-medium">{new Date(selectedPromotion.start_date).toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</h4>
                  <p className="mt-1 text-sm text-black font-medium">{new Date(selectedPromotion.end_date).toLocaleString()}</p>
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
      {isUpdateModalOpen && selectedPromotion && (
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
                    <User size={20} className="text-[#2d7a63]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{selectedPromotion.title}</p>
                    <p className="text-sm text-gray-500">by {selectedPromotion.customer_name}</p>
                    <p className="text-xs text-gray-400">Promotion ID: {selectedPromotion.id}</p>
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
                      <option key={status} value={status}>{status?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedPromotion.category} // Use selectedPromotion.category for the new category
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      setSelectedPromotion(prev => prev ? { ...prev, category: newCategory } : null);
                    }}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] transition duration-150 ease-in-out"
                  >
                    {categoryOptions.filter(c => c !== 'all').map(category => (
                      <option key={category} value={category}>{category?.replace(/\b\w/g, c => c.toUpperCase()) || category}</option>
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