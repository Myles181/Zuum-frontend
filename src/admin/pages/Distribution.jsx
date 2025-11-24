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
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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

  // Handle view request details
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
    
    // Mark as read when viewed
    if (!request.read) {
      handleToggleRead(request.id, false);
    }
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
    withdrawalRequest: '/withdrawalRequest',
    promotion: '/adpromotion',
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
            
            {/* Main content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mx-4 lg:mx-6">
            {/* Requests Grid */}
            <div className="h-full overflow-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2d7a63]"></div>
                    <p className="text-sm text-gray-600">Loading distribution requests...</p>
                  </div>
                </div>
              ) : filteredRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRequests.map((request) => {
                    const primaryLabel = request.caption || request.artistName || 'Unnamed submission';
                    const submissionDate = request.created_at || request.submittedAt;
                    const releaseDate = request.releaseDate;
                    const socialLinks = getSocialLinks(request.social_links);
                    const coverImage = request.cover_photo;

                    return (
                      <div
                        key={request.id}
                        className={`rounded-3xl border shadow-sm overflow-hidden transition-all duration-300 ${
                          request.read
                            ? 'border-gray-100 hover:shadow-lg'
                            : 'border-blue-200 shadow-blue-100 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        <div className="relative h-48 bg-gray-100">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={`${primaryLabel} cover art`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Music className="w-12 h-12" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 shadow">
                              <DollarSign className="w-3 h-3" />
                              {formatCurrency(request.amount)}
                            </span>
                            {request.paid && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow">
                                <Check className="w-3 h-3" />
                                Paid
                              </span>
                            )}
                          </div>
                          <span
                            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow ${
                              request.read ? 'bg-white/80 text-gray-800' : 'bg-blue-600/90 text-white'
                            }`}
                          >
                            {request.read ? 'Read' : 'Awaiting review'}
                          </span>
                        </div>

                        <div className="p-6 space-y-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Artist</p>
                              <p className="text-xl font-semibold text-gray-900 mt-1">{primaryLabel}</p>
                              <p className="text-sm text-gray-500">
                                Request #{request.id} · {formatDate(submissionDate)}
                              </p>
                            </div>
                            <button
                              onClick={() => handleViewRequest(request)}
                              className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-[#2d7a63] hover:text-[#2d7a63] transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Brief
                            </button>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {request.description || 'No project description provided.'}
                            </p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                                <p className="text-xs uppercase text-gray-400 tracking-wider">Distribution</p>
                                <p className="font-semibold text-gray-900 mt-1">{request.distributionType || 'Digital release'}</p>
                              </div>
                              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                                <p className="text-xs uppercase text-gray-400 tracking-wider">Release target</p>
                                <p className="font-semibold text-gray-900 mt-1">{formatDate(releaseDate)}</p>
                              </div>
                            </div>
                          </div>

                          {request.audio_upload && (
                            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                <span className="inline-flex items-center gap-2 font-medium text-gray-700">
                                  <PlayCircle className="w-4 h-4 text-[#2d7a63]" />
                                  Preview audio
                                </span>
                                <a
                                  href={request.audio_upload}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2d7a63] hover:text-[#245a4f]"
                                >
                                  Open
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                              <audio controls className="w-full rounded-xl">
                                <source src={request.audio_upload} />
                                Your browser does not support audio playback.
                              </audio>
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                              Platform placements
                            </p>
                            {socialLinks.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {socialLinks.map((platform) => (
                                  <a
                                    key={platform.key}
                                    href={platform.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`inline-flex items-center gap-1 rounded-full ${platform.bg} ${platform.color} px-3 py-1 text-xs font-semibold transition hover:opacity-80`}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {platform.label}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400">No platform links provided.</p>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <button
                              onClick={() => handleViewRequest(request)}
                              className="flex-1 inline-flex items-center justify-center rounded-2xl border border-[#2d7a63] px-4 py-3 text-sm font-semibold text-[#2d7a63] hover:bg-[#2d7a63] hover:text-white transition"
                            >
                              <Eye size={16} className="mr-2" />
                              View Full Brief
                            </button>
                            <button
                              onClick={() => handleToggleRead(request.id, request.read)}
                              className={`flex-1 inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                request.read
                                  ? 'border border-blue-200 text-blue-600 hover:bg-blue-50'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {request.read ? (
                                <>
                                  <Mail size={16} className="mr-2" />
                                  Mark Unread
                                </>
                              ) : (
                                <>
                                  <MailOpen size={16} className="mr-2" />
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
              ) : (
                <div className="p-6 text-center text-sm text-gray-500">
                  {searchTerm ? 'No requests found matching your search' : 'No distribution requests found'}
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
      
      {/* View Request Modal */}
      {isViewModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100 animate-slide-up">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-[#2d7a63] to-[#3d8b73] text-white">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Distribution Request Details</h2>
                  <p className="text-sm text-white text-opacity-80">Request #{selectedRequest.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#2d7a63] p-2 rounded-full transition-all duration-200 hover:bg-white hover:bg-opacity-20"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-8 space-y-8 max-h-[calc(95vh-200px)] overflow-y-auto">
              {/* Cover Photo & Audio Preview */}
              {(selectedRequest.cover_photo || selectedRequest.audio_upload) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedRequest.cover_photo && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cover Photo</h4>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={selectedRequest.cover_photo} 
                          alt="Cover" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {selectedRequest.audio_upload && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Audio Preview</h4>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <PlayCircle className="w-8 h-8 text-[#2d7a63] flex-shrink-0" />
                        <audio controls className="flex-1">
                          <source src={selectedRequest.audio_upload} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                      <a 
                        href={selectedRequest.audio_upload} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm text-[#2d7a63] hover:text-[#245a4f]"
                      >
                        <ExternalLink size={14} />
                        Open audio file
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Main Details Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Request ID</h4>
                  <p className="text-lg font-semibold text-gray-900">#{selectedRequest.id}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Status</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      !selectedRequest.read 
                        ? "bg-blue-100 text-blue-800 border border-blue-200" 
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}>
                      {selectedRequest.read ? '✓ Read' : '● Unread'}
                    </span>
                    {selectedRequest.paid && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Paid
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Caption / Title</h4>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequest.caption || 'Not specified'}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Genre</h4>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequest.genre || 'Not specified'}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Amount</h4>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedRequest.amount)}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Profile ID</h4>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequest.profile_id || 'N/A'}</p>
                </div>
              </div>
              
              {/* Description Section */}
              {selectedRequest.description && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Description</h4>
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{selectedRequest.description}</p>
                  </div>
                </div>
              )}
              
              {/* Social Links Section */}
              {selectedRequest.social_links && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Social Media Links</h4>
                  {(() => {
                    const socialLinks = getSocialLinks(selectedRequest.social_links);
                    return socialLinks.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {socialLinks.map((platform) => (
                          <a
                            key={platform.key}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 ${platform.bg}`}
                          >
                            <div className={`flex-1 ${platform.color}`}>
                              <p className="font-semibold text-sm">{platform.label}</p>
                              <p className="text-xs text-gray-600 truncate">{platform.url}</p>
                            </div>
                            <ExternalLink size={16} className={`${platform.color} flex-shrink-0`} />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No social links provided.</p>
                    );
                  })()}
                </div>
              )}
              
              {/* Submission Info */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Created At</h4>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedRequest.created_at 
                        ? new Date(selectedRequest.created_at).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Status</h4>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedRequest.paid ? (
                        <span className="text-emerald-600">✓ Paid</span>
                      ) : (
                        <span className="text-amber-600">Pending Payment</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Last updated: {selectedRequest.submittedAt ? new Date(selectedRequest.submittedAt).toLocaleDateString() : 'Not available'}
                </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleToggleRead(selectedRequest.id, selectedRequest.read)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedRequest.read
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300"
                      : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                  }`}
                >
                  {selectedRequest.read ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-6 py-2 bg-[#2d7a63] text-white rounded-lg font-medium hover:bg-[#245a4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d7a63] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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