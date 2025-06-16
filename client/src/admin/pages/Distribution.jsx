import { useState, useEffect } from 'react';
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
  TrendingUp
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';

const DistributionRequestsPage = () => {
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [requestToMarkRead, setRequestToMarkRead] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markReadSuccess, setMarkReadSuccess] = useState(false);

  // Mock pagination data
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 3,
    total: 25,
    perPage: 10
  });

  // Mock data - replace with actual API calls
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
    },
    {
      id: 4,
      artistName: "Acoustic Soul",
      email: "acoustic.soul@email.com",
      songTitle: "Gentle Waves",
      distributionType: "Digital",
      platforms: ["Apple Music", "Spotify", "Amazon Music"],
      message: "Acoustic guitarist looking to share my instrumental pieces with the world.",
      read: true,
      submittedAt: "2025-06-12T14:10:00Z",
      genre: "Acoustic",
      releaseDate: "2025-07-20",
      contactPhone: "+1111111111"
    },
    {
      id: 5,
      artistName: "Rock Thunder",
      email: "rock.thunder@email.com",
      songTitle: "Lightning Strike",
      distributionType: "Physical + Digital",
      platforms: ["All Platforms", "Vinyl", "Cassette"],
      message: "Rock band seeking wide distribution for our debut album. We want to reach both digital and physical markets.",
      read: false,
      submittedAt: "2025-06-11T11:30:00Z",
      genre: "Rock",
      releaseDate: "2025-09-01",
      contactPhone: "+2222222222"
    }
  ];

  // Simulate API loading
  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRequests(mockRequests);
      setIsLoading(false);
    };
    loadRequests();
  }, [currentPage]);

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

  // Handle toggle read status
  const handleToggleRead = async (requestId, currentReadStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, read: !currentReadStatus } : req
      ));
      
      setMarkReadSuccess(true);
      setTimeout(() => setMarkReadSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update read status');
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
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  // Filter requests based on search term
  const filteredRequests = requests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request.artistName?.toLowerCase().includes(searchLower) ||
      request.email?.toLowerCase().includes(searchLower) ||
      request.songTitle?.toLowerCase().includes(searchLower) ||
      request.genre?.toLowerCase().includes(searchLower) ||
      request.id?.toString().includes(searchLower)
    );
  });

  const handlePageChange = (pageId) => {
    console.log('Navigate to:', pageId);
    // Here you would implement navigation logic
  };

  const resetError = () => {
    setError(null);
  };

  const unreadCount = requests.filter(req => !req.read).length;
  const readCount = requests.filter(req => req.read).length;

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
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
            {/* Header section */}
            <div className="mb-8">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Unread Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <MailOpen className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Read Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{readCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#2d7a63] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <Music className="w-5 h-5 text-[#2d7a63]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
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
              <div className="fixed top-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-lg z-50 animate-fade-in-out">
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
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
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
              
              {/* Pagination controls */}
              {requests.length > 0 && !searchTerm && (
                <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                    Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                    <span className="font-medium">{pagination.totalPages}</span> (Total:{' '}
                    <span className="font-medium">{pagination.total}</span> requests)
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
      
      {/* View Request Modal */}
      {isViewModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Distribution Request Details</h2>
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
                  <User className="h-10 w-10 text-[#2d7a63]" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{selectedRequest.artistName}</h3>
                <p className="mt-1 text-sm text-gray-500">{selectedRequest.email}</p>
                <p className={`mt-1 text-sm ${!selectedRequest.read ? "text-blue-600" : "text-green-600"}`}>
                  {selectedRequest.read ? 'Read' : 'Unread'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Song Title</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.songTitle}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.id}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.genre}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Distribution Type</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.distributionType}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Phone</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.contactPhone}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Release Date</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedRequest.releaseDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Platforms</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedRequest.platforms.map((platform, index) => (
                    <span key={index} className="px-2 py-1 text-xs font-medium bg-[#2d7a63] bg-opacity-10 text-[#2d7a63] rounded-full">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Message</h4>
                <div className="mt-2 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-900">{selectedRequest.message}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</h4>
                <p className="mt-1 text-sm text-gray-900">{new Date(selectedRequest.submittedAt).toLocaleString()}</p>
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