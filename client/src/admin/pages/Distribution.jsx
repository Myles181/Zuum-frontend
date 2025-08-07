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
  Menu
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useDistributionRequests } from '../hooks/useDistributionRequests';

const DistributionRequestsPage = () => {
  const navigate = useNavigate();
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
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

  // Calculate stats from real data
  const unreadCount = Array.isArray(requests) ? requests.filter(req => !req.read).length : 0;
  const readCount = Array.isArray(requests) ? requests.filter(req => req.read).length : 0;

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
    if (pagination.currentPage < pagination.totalPages) {
      fetchRequests(null, pagination.currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.currentPage > 1) {
      fetchRequests(null, pagination.currentPage - 1);
    }
  };
  
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

  const handlePageChange = (pageId) => {
    switch (pageId) {
      case 'users':
        navigate('/users');
        break;
      case 'distribution':
        navigate('/distribution');
        break;
      case 'beat':
        navigate('/beat');
        break;
      case 'promotion':
        navigate('/promotion');
        break;
      default:
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
                {/* Desktop Table */}
                <div className="hidden lg:block h-full overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Request ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Artist
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Song Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Genre
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
                              <span className="ml-3 text-gray-600">Loading requests...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                          <tr 
                            key={request.id} 
                            className={`hover:bg-gray-50 transition duration-150 ${!request.read ? "bg-blue-50" : ""}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {request.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-[#2d7a63]" />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{request.artistName}</div>
                                  <div className="text-sm text-gray-500">{request.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium hidden md:table-cell">
                              {request.songTitle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                {request.genre}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${!request.read 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'}`}
                              >
                                {request.read ? 'Read' : 'Unread'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleViewRequest(request)}
                                className="inline-flex items-center text-[#2d7a63] hover:text-[#245a4f] mr-4 transition duration-150"
                              >
                                <Eye size={16} className="mr-1" /> 
                                <span className="hidden sm:inline">View</span>
                              </button>
                              <button
                                onClick={() => handleToggleRead(request.id, request.read)}
                                className="inline-flex items-center text-blue-600 hover:text-blue-900 transition duration-150"
                              >
                                {request.read ? (
                                  <>
                                    <Mail size={16} className="mr-1" /> 
                                    <span className="hidden sm:inline">Mark Unread</span>
                                  </>
                                ) : (
                                  <>
                                    <MailOpen size={16} className="mr-1" /> 
                                    <span className="hidden sm:inline">Mark Read</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                            {searchTerm ? 'No requests found matching your search' : 'No distribution requests found'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden h-full overflow-auto">
                  {isLoading ? (
                    <div className="p-6 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d7a63]"></div>
                        <span className="ml-3 text-gray-600">Loading requests...</span>
                      </div>
                    </div>
                  ) : filteredRequests.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredRequests.map((request) => (
                        <div 
                          key={request.id} 
                          className={`p-4 ${!request.read ? "bg-blue-50" : ""} transition duration-150`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-[#2d7a63]" />
                              </div>
                              <div className="ml-3">
                                <div className="text-base font-semibold text-gray-900">{request.artistName}</div>
                                <div className="text-sm text-gray-500">ID: {request.id}</div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                              ${!request.read 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'}`}
                            >
                              {request.read ? 'Read' : 'Unread'}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Song:</span> {request.songTitle}
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Genre:</span> {request.genre}
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Email:</span> {request.email}
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleViewRequest(request)}
                              className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-[#2d7a63] text-sm font-medium rounded-lg text-[#2d7a63] bg-white hover:bg-[#245a4f] hover:text-white transition duration-150 shadow-sm"
                            >
                              <Eye size={16} className="mr-2" /> 
                              View Details
                            </button>
                            <button
                              onClick={() => handleToggleRead(request.id, request.read)}
                              className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-600 hover:text-white transition duration-150 shadow-sm"
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
                      ))}
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
            {requests.length > 0 && !searchTerm && (
              <div className="px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white">
                <div className="text-sm text-gray-700 mb-4 sm:mb-0 text-center sm:text-left">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span> (Total:{' '}
                  <span className="font-medium">{pagination.total}</span> requests)
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
              {/* Artist Info Section */}
              <div className="flex flex-col items-center mb-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                <div className="h-24 w-24 bg-gradient-to-br from-[#2d7a63] to-[#3d8b73] rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-12 w-12 text-white" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-gray-900">{selectedRequest.artistName}</h3>
                <p className="mt-2 text-sm text-gray-600">{selectedRequest.email}</p>
                <div className={`mt-3 px-4 py-2 rounded-full text-sm font-medium ${
                  !selectedRequest.read 
                    ? "bg-blue-100 text-blue-800 border border-blue-200" 
                    : "bg-green-100 text-green-800 border border-green-200"
                }`}>
                  {selectedRequest.read ? '✓ Read' : '● Unread'}
                </div>
              </div>
              
              {/* Main Details Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 modal-card-hover">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Song Title</h4>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequest.songTitle}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 modal-card-hover">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Request ID</h4>
                  <p className="text-lg font-semibold text-gray-900">#{selectedRequest.id}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 modal-card-hover">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Genre</h4>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequest.genre}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 modal-card-hover">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Distribution Type</h4>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequest.distributionType}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 modal-card-hover">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact Phone</h4>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequest.contactPhone}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 modal-card-hover">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Release Date</h4>
                  <p className="text-lg font-semibold text-gray-900">{new Date(selectedRequest.releaseDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Platforms Section */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm modal-card-hover">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Target Platforms</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedRequest.platforms.map((platform, index) => (
                    <span key={index} className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#2d7a63] to-[#3d8b73] text-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 platform-tag">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Message Section */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Artist Message</h4>
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                  <p className="text-gray-900 leading-relaxed">{selectedRequest.message}</p>
                </div>
              </div>
              
              {/* Submission Info */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Submitted At</h4>
                <p className="text-lg font-semibold text-gray-900">{new Date(selectedRequest.submittedAt).toLocaleString()}</p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Last updated: {new Date(selectedRequest.submittedAt).toLocaleDateString()}
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