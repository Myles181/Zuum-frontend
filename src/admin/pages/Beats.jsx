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
  MailX,
  FileText,
  Download,
  Menu,
  Filter
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useBeatPurchases } from '../hooks/useBeatPurchases';

const AdminBeatPurchasesPage = () => {
  const navigate = useNavigate();
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [emailFilter, setEmailFilter] = useState('all'); // 'all', 'sent', 'pending'
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  // Upload form states
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sendEmail, setSendEmail] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Use the real API hook
  const {
    purchases,
    isLoading,
    error,
    pagination,
    uploadSuccess,
    fetchPurchases,
    updatePurchaseLicense,
    resetError
  } = useBeatPurchases();

  // Calculate stats from real data
  const totalPurchases = Array.isArray(purchases) ? purchases.length : 0;
  const pendingLicenses = Array.isArray(purchases) ? purchases.filter(p => !p.license_uploaded).length : 0;
  const emailsSent = Array.isArray(purchases) ? purchases.filter(p => p.send_email).length : 0;
  const deliveredPurchases = Array.isArray(purchases) ? purchases.filter(p => p.delivered).length : 0;

  // Handle view purchase details
  const handleViewPurchase = (purchase) => {
    setSelectedPurchase(purchase);
    // You can implement a view modal here
    console.log('View purchase:', purchase);
  };

  // Handle upload click
  const handleUploadClick = (purchase) => {
    setSelectedPurchase(purchase);
    setIsUploadModalOpen(true);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      // setError(null); // This line was removed from the new_code, so it's removed here.
    } else {
      // setError('Please select a PDF file'); // This line was removed from the new_code, so it's removed here.
      setSelectedFile(null);
    }
  };

  // Handle upload submission
  const handleUploadSubmit = async () => {
    if (!selectedFile || !selectedPurchase) {
      // setError('Please select a file and purchase'); // This line was removed from the new_code, so it's removed here.
      return;
    }

    setUploadLoading(true);
    const success = await updatePurchaseLicense(
      selectedPurchase.id,
      selectedFile,
      sendEmail
    );

    if (success) {
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setSelectedPurchase(null);
    }

    setUploadLoading(false);
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchPurchases(pagination.currentPage + 1, 10, emailFilter === 'all' ? null : emailFilter === 'sent');
    }
  };

  const goToPrevPage = () => {
    if (pagination.currentPage > 1) {
      fetchPurchases(pagination.currentPage - 1, 10, emailFilter === 'all' ? null : emailFilter === 'sent');
    }
  };

  // Filter purchases based on search term and email filter
  const filteredPurchases = Array.isArray(purchases) ? purchases.filter(purchase => {
    const matchesSearch = searchTerm === '' || 
      purchase.beat_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.artist_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.id?.toString().includes(searchTerm);
    
    const matchesEmailFilter = emailFilter === 'all' || 
      (emailFilter === 'sent' && purchase.send_email) ||
      (emailFilter === 'pending' && !purchase.send_email);
    
    return matchesSearch && matchesEmailFilter;
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
        currentPage="beat"
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
                <h1 className="text-xl font-bold text-gray-900">Beat Purchases</h1>
                <p className="text-sm text-gray-500">Manage beat purchases</p>
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
                  placeholder="Search purchases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Mobile Filter */}
          <div className="flex items-center space-x-3">
            <Filter size={18} className="text-gray-500" />
            <select
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] transition-all duration-200"
            >
              <option value="all">All Purchases</option>
              <option value="sent">Email Sent</option>
              <option value="pending">Email Pending</option>
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
                  <h1 className="text-3xl font-bold text-gray-900">Beat Purchase Management</h1>
                  <p className="mt-2 text-gray-600">Manage beat purchase licenses and email notifications</p>
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
                      placeholder="Search purchases..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <select
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] transition duration-150 ease-in-out"
                  >
                    <option value="all">All Purchases</option>
                    <option value="sent">Email Sent</option>
                    <option value="pending">Email Pending</option>
                  </select>
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
                        <User className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Purchases</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{totalPurchases}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Licenses</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{pendingLicenses}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-sm font-medium text-gray-600">Delivered</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{deliveredPurchases}</p>
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
            {uploadSuccess && (
              <div className="fixed top-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg z-50 animate-fade-in-out">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">License uploaded successfully!</p>
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
                          Purchase ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Beat Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Artist
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Customer
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
                              <span className="ml-3 text-gray-600">Loading purchases...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredPurchases.length > 0 ? (
                        filteredPurchases.map((purchase) => (
                          <tr 
                            key={purchase.id} 
                            className="hover:bg-gray-50 transition duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {purchase.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-[#2d7a63]" />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{purchase.beat_title}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                              {purchase.artist_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                              {purchase.customer_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${purchase.license_uploaded 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'}`}
                              >
                                {purchase.license_status || (purchase.license_uploaded ? 'Licensed' : 'Pending')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleViewPurchase(purchase)}
                                className="inline-flex items-center text-[#2d7a63] hover:text-[#245a4f] mr-4 transition duration-150"
                              >
                                <Eye size={16} className="mr-1" /> 
                                <span className="hidden sm:inline">View</span>
                              </button>
                              {!purchase.license_uploaded && (
                                <button
                                  onClick={() => handleUploadClick(purchase)}
                                  className="inline-flex items-center text-blue-600 hover:text-blue-900 transition duration-150"
                                >
                                  <Download size={16} className="mr-1" /> 
                                  <span className="hidden sm:inline">Upload</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                            {searchTerm ? 'No purchases found matching your search' : 'No purchases found'}
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
                        <span className="ml-3 text-gray-600">Loading purchases...</span>
                      </div>
                    </div>
                  ) : filteredPurchases.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredPurchases.map((purchase) => (
                        <div 
                          key={purchase.id} 
                          className="p-4 transition duration-150"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-[#2d7a63]" />
                              </div>
                              <div className="ml-3">
                                <div className="text-base font-semibold text-gray-900">{purchase.beat_title}</div>
                                <div className="text-sm text-gray-500">ID: {purchase.id}</div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                              ${purchase.license_uploaded 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'}`}
                            >
                              {purchase.license_status || (purchase.license_uploaded ? 'Licensed' : 'Pending')}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Artist:</span> {purchase.artist_name}
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Customer:</span> {purchase.customer_name}
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Email:</span> {purchase.customer_email}
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Amount:</span> ${purchase.purchase_amount}
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Status:</span> {purchase.status}
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleViewPurchase(purchase)}
                              className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-[#2d7a63] text-sm font-medium rounded-lg text-[#2d7a63] bg-white hover:bg-[#245a4f] hover:text-white transition duration-150 shadow-sm"
                            >
                              <Eye size={16} className="mr-2" /> 
                              View Details
                            </button>
                            {!purchase.license_uploaded && (
                              <button
                                onClick={() => handleUploadClick(purchase)}
                                className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-600 hover:text-white transition duration-150 shadow-sm"
                              >
                                <Download size={16} className="mr-2" /> 
                                Upload License
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-sm text-gray-500">
                      {searchTerm ? 'No purchases found matching your search' : 'No purchases found'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Pagination controls */}
            {purchases.length > 0 && !searchTerm && (
              <div className="px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white">
                <div className="text-sm text-gray-700 mb-4 sm:mb-0 text-center sm:text-left">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span> (Total:{' '}
                  <span className="font-medium">{pagination.total}</span> purchases)
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
      
      {/* View Purchase Modal */}
      {selectedPurchase && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Purchase Details</h2>
              <button 
                onClick={() => setSelectedPurchase(null)}
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
                <h3 className="mt-4 text-lg font-medium text-gray-900">{selectedPurchase.beat_title}</h3>
                <p className="mt-1 text-sm text-gray-500">by {selectedPurchase.artist_name}</p>
                <div className="mt-2 flex items-center">
                  {selectedPurchase.send_email ? (
                    <>
                      <Mail className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Email Sent</span>
                    </>
                  ) : (
                    <>
                      <MailX className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-yellow-600">Email Pending</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase ID</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedPurchase.id}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">License Type</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedPurchase.license_type}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedPurchase.customer_name}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedPurchase.customer_email}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Amount</h4>
                  <p className="mt-1 text-sm text-gray-900">${selectedPurchase.purchase_amount}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedPurchase.purchase_date).toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">License Status</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPurchase.license_uploaded ? 'Uploaded' : 'Not Uploaded'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</h4>
                  <span className={`mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${selectedPurchase.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {selectedPurchase.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedPurchase(null)}
                className="px-4 py-2 bg-[#2d7a63] text-white rounded-md hover:bg-[#245a4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d7a63] transition duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload License Modal */}
      {isUploadModalOpen && selectedPurchase && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Upload License</h2>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d7a63] p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-[#2d7a63]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{selectedPurchase.beat_title}</p>
                    <p className="text-sm text-gray-500">by {selectedPurchase.artist_name}</p>
                    <p className="text-xs text-gray-400">Purchase ID: {selectedPurchase.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License File (PDF)
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#2d7a63] file:text-white hover:file:bg-[#245a4f] focus:outline-none focus:ring-2 focus:ring-[#2d7a63] transition duration-150"
                    />
                  </div>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">Selected: {selectedFile.name}</p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="h-4 w-4 text-[#2d7a63] focus:ring-[#2d7a63] border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Send license to customer
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d7a63] transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={!selectedFile || uploadLoading}
                className={`px-4 py-2 bg-[#2d7a63] text-white rounded-md hover:bg-[#245a4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d7a63] transition duration-150 ${
                  (!selectedFile || uploadLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploadLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </span>
                ) : (
                  'Upload License'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBeatPurchasesPage;