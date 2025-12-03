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
  Mail,
  MailOpen,
  Calendar,
  Music,
  TrendingUp,
  Menu,
  PlayCircle,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useDistributionRequests } from '../hooks/useDistributionRequests';

const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200];

const SOCIAL_PLATFORMS = [
  { key: 'spotify', label: 'Spotify', color: 'text-green-700', bg: 'bg-green-50' },
  { key: 'apple_music', label: 'Apple Music', color: 'text-pink-700', bg: 'bg-pink-50' },
  { key: 'audio_mark', label: 'Audiomack', color: 'text-amber-700', bg: 'bg-amber-50' },
  { key: 'boomplay', label: 'Boomplay', color: 'text-blue-700', bg: 'bg-blue-50' }
];

function formatCurrency(value) {
  if (value === undefined || value === null) {
    return 'Not specified';
  }
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(value) {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getSocialLinks(links) {
  if (!links || typeof links !== 'object') return [];
  return SOCIAL_PLATFORMS
    .filter(platform => links[platform.key])
    .map(platform => ({
      ...platform,
      url: links[platform.key]
    }));
}

const DistributionRequestsPage = () => {
  const navigate = useNavigate();
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  
  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [requestToMarkRead, setRequestToMarkRead] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Use the real API hook
  const {
    requests,
    isLoading,
    error,
    pagination,
    markReadSuccess,
    fetchRequests,
    markRequestAsRead,
    resetError
  } = useDistributionRequests();

  console.log(requests);

  // Calculate stats from real data
  const unreadCount = Array.isArray(requests) ? requests.filter(req => !req.read).length : 0;
  const readCount = Array.isArray(requests) ? requests.filter(req => req.read).length : 0;
  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  const effectivePageSize = pagination?.pageSize || pageSize || DEFAULT_PAGE_SIZE;
  const totalRequests = pagination?.total ?? (Array.isArray(requests) ? requests.length : 0);
  const startEntry = totalRequests === 0 ? 0 : (currentPage - 1) * effectivePageSize + 1;
  const endEntry = totalRequests === 0 ? 0 : Math.min(currentPage * effectivePageSize, totalRequests);

  // Handle view request details - navigate to details page
  const handleViewRequest = (request) => {
    navigate(`/admin/distribution/${request.id}`);
  };

  // Handle confirmation modal for marking as read
  const handleMarkReadClick = (request) => {
    setRequestToMarkRead(request);
    setIsConfirmModalOpen(true);
  };

  // Handle toggle read status using real API
  const handleToggleRead = async (requestId, currentReadStatus) => {
    const success = await markRequestAsRead(requestId, !currentReadStatus);
    if (success) {
      // Success is handled by the hook
    }
  };

  // Handle mark as read confirmation
  const handleMarkReadConfirm = async () => {
    if (!requestToMarkRead) return;
    await handleToggleRead(requestToMarkRead.id, requestToMarkRead.read);
    setIsConfirmModalOpen(false);
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      fetchRequests(null, currentPage + 1, effectivePageSize);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      fetchRequests(null, currentPage - 1, effectivePageSize);
    }
  };

  const handlePageSizeChange = (event) => {
    const newSize = Number(event.target.value);
    if (!Number.isNaN(newSize)) {
      setPageSize(newSize);
      fetchRequests(null, 1, newSize);
    }
  };

  useEffect(() => {
    if (pagination?.pageSize && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
  }, [pagination.pageSize, pageSize]);
  
  // Filter requests based on search term
  const filteredRequests = Array.isArray(requests) ? requests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request.artistName?.toLowerCase().includes(searchLower) ||
      request.email?.toLowerCase().includes(searchLower) ||
      request.songTitle?.toLowerCase().includes(searchLower) ||
      request.genre?.toLowerCase().includes(searchLower) ||
      request.id?.toString().includes(searchLower)
    );
  }) : [];

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        currentPage="distribution"
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
                <h1 className="text-xl font-bold text-gray-900">Distribution Requests</h1>
                <p className="text-sm text-gray-500">Manage distribution requests</p>
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
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8 px-6 pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900">Distribution Requests</h1>
                  <p className="mt-2 text-gray-600">Manage and review artist distribution requests</p>
                </div>
                
                {/* Search bar */}
                <div className="relative w-full md:w-64 lg:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="px-4 lg:px-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-sm font-medium text-gray-600">Unread Requests</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{unreadCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <MailOpen className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-sm font-medium text-gray-600">Read Requests</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{readCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#2d7a63] bg-opacity-10 rounded-lg flex items-center justify-center">
                        <Music className="w-5 h-5 lg:w-6 lg:h-6 text-[#2d7a63]" />
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Requests</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{pagination.total}</p>
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
                    <AlertCircle className="h-5 w-5 text-red-500" />
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
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Success notification */}
            {markReadSuccess && (
              <div className="fixed top-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg z-50 animate-fade-in-out">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Request status updated successfully!</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Main content - professional list/table layout for requests */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mx-4 lg:mx-6">
                <div className="h-full overflow-auto">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2d7a63]"></div>
                        <p className="text-sm text-gray-600">
                          Loading distribution requests...
                        </p>
                      </div>
                    </div>
                  ) : filteredRequests.length > 0 ? (
                    <>
                      {/* Table header (desktop) */}
                      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-4">Artist / Project</div>
                        <div className="col-span-3">Release & Financials</div>
                        <div className="col-span-3">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>

                      {/* Table body */}
                      <div className="divide-y divide-gray-100">
                        {filteredRequests.map((request) => {
                          const primaryLabel =
                            request.caption || request.artistName || 'Unnamed submission';
                          const submissionDate =
                            request.created_at || request.submittedAt;
                          const releaseDate = request.releaseDate;
                          const socialLinks = getSocialLinks(request.social_links);
                          const coverImage = request.cover_photo;
                          const amountLabel = formatCurrency(request.amount);

                          const readBadgeClasses = request.read
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-blue-100 text-blue-700';

                          return (
                            <div
                              key={request.id}
                              className="px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => handleViewRequest(request)}
                            >
                              <div className="md:grid md:grid-cols-12 md:items-center gap-4">
                                {/* Artist / project */}
                                <div className="md:col-span-4 flex items-start gap-3">
                                  <div className="hidden md:flex h-11 w-11 rounded-lg bg-gray-100 overflow-hidden items-center justify-center">
                                    {coverImage ? (
                                      <img
                                        src={coverImage}
                                        alt={`${primaryLabel} cover art`}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <Music className="w-5 h-5 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                      {primaryLabel}
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                      Request #{request.id} ·{' '}
                                      {formatDate(submissionDate)}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500 md:hidden line-clamp-2">
                                      {request.description ||
                                        'No project description provided.'}
                                    </p>
                                  </div>
                                </div>

                                {/* Release & financials */}
                                <div className="md:col-span-3 mt-3 md:mt-0 text-xs text-gray-600 space-y-1.5">
                                  <div className="flex justify-between md:block">
                                    <span className="text-gray-500">
                                      Release target
                                    </span>
                                    <span className="font-medium text-gray-900 md:block">
                                      {formatDate(releaseDate)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between md:block">
                                    <span className="text-gray-500">
                                      Distribution
                                    </span>
                                    <span className="font-medium text-gray-900 md:block">
                                      {request.distributionType || 'Digital release'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between md:block">
                                    <span className="text-gray-500">Amount</span>
                                    <span className="font-medium text-gray-900 md:block">
                                      {amountLabel}
                                    </span>
                                  </div>
                                </div>

                                {/* Status & platforms */}
                                <div className="md:col-span-3 mt-3 md:mt-0 space-y-2">
                                  <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ${readBadgeClasses}`}
                                    >
                                      {request.read ? 'Read' : 'Awaiting review'}
                                    </span>
                                    {request.paid && (
                                      <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-[11px] font-medium">
                                        <Check className="w-3 h-3 mr-1" />
                                        Paid
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {socialLinks.length > 0 ? (
                                      socialLinks.slice(0, 3).map((platform) => (
                                        <span
                                          key={platform.key}
                                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${platform.bg} ${platform.color}`}
                                        >
                                          {platform.label}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[11px] text-gray-400">
                                        No platform links
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="md:col-span-2 mt-3 md:mt-0 flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewRequest(request);
                                    }}
                                    className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                  >
                                    <Eye className="w-3.5 h-3.5 mr-1" />
                                    View
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleRead(request.id, request.read);
                                    }}
                                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium ${
                                      request.read
                                        ? 'border border-blue-200 text-blue-600 bg-white hover:bg-blue-50'
                                        : 'border border-blue-600 text-white bg-blue-600 hover:bg-blue-700'
                                    }`}
                                  >
                                    {request.read ? (
                                      <>
                                        <Mail className="w-3.5 h-3.5 mr-1" />
                                        Mark Unread
                                      </>
                                    ) : (
                                      <>
                                        <MailOpen className="w-3.5 h-3.5 mr-1" />
                                        Mark Read
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center text-sm text-gray-500">
                      {searchTerm
                        ? 'No requests found matching your search'
                        : 'No distribution requests found'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Pagination controls */}
            {totalRequests > 0 && !searchTerm && (
              <div className="px-4 lg:px-6 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-t border-gray-200 bg-white">
                <div className="text-sm text-gray-700 text-center lg:text-left">
                  Showing <span className="font-medium">{startEntry}</span> - <span className="font-medium">{endEntry}</span> of{' '}
                  <span className="font-medium">{totalRequests}</span> requests · Page{' '}
                  <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Rows per page
                  </label>
                  <select
                    value={effectivePageSize}
                    onChange={handlePageSizeChange}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a63]"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2 justify-center lg:justify-end">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg 
                      ${currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'}`}
                  >
                    <ChevronLeft size={18} className="mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg 
                      ${currentPage === totalPages 
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
      {/* Confirmation Modal */}
      {isConfirmModalOpen && requestToMarkRead && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Confirm Status Change</h2>
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d7a63] p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  Are you sure you want to mark the request from <span className="font-semibold">{requestToMarkRead.artistName}</span> as {requestToMarkRead.read ? 'unread' : 'read'}?
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d7a63] transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkReadConfirm}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                {requestToMarkRead.read ? 'Mark Unread' : 'Mark Read'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributionRequestsPage;