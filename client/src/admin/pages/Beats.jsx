import { useState, useEffect } from 'react';
import { 
  Music, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Search,
  AlertCircle,
  Upload,
  Mail,
  MailX,
  FileText,
  Download
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';

// Mock hook for demonstration - replace with your actual hook
const useBeatPurchases = () => {
  const [purchases, setPurchases] = useState([
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
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 3
  });

  const fetchPurchases = async (page = 1, sendEmailFilter = null) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filtered = purchases;
      if (sendEmailFilter !== null) {
        filtered = purchases.filter(p => p.send_email === sendEmailFilter);
      }
      setIsLoading(false);
    }, 1000);
  };

  const updatePurchaseLicense = async (purchaseId, licenseFile, sendEmail) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPurchases(prev => prev.map(p => 
        p.id === purchaseId 
          ? { ...p, license_uploaded: true, send_email: sendEmail, status: sendEmail ? 'completed' : 'pending' }
          : p
      ));
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Failed to upload license');
      setIsLoading(false);
      return false;
    }
  };

  const resetError = () => setError(null);

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

const AdminBeatPurchasesPage = () => {
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [purchaseToUpdate, setPurchaseToUpdate] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [emailFilter, setEmailFilter] = useState('all'); // 'all', 'sent', 'pending'
  
  // Upload form states
  const [selectedFile, setSelectedFile] = useState(null);
  const [sendEmailFlag, setSendEmailFlag] = useState(true);
  
  // Use our custom hook for API operations
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

  // Fetch purchases on page change or filter change
  useEffect(() => {
    const sendEmailFilter = emailFilter === 'all' ? null : emailFilter === 'sent';
    fetchPurchases(currentPage, sendEmailFilter);
  }, [currentPage, emailFilter]);

  // Handle view purchase details
  const handleViewPurchase = (purchase) => {
    setSelectedPurchase(purchase);
    setIsViewModalOpen(true);
  };

  // Handle upload modal
  const handleUploadClick = (purchase) => {
    setPurchaseToUpdate(purchase);
    setIsUploadModalOpen(true);
    setSelectedFile(null);
    setSendEmailFlag(true);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
      event.target.value = '';
    }
  };

  // Handle license upload
  const handleUploadSubmit = async () => {
    if (!selectedFile || !purchaseToUpdate) return;
    
    const success = await updatePurchaseLicense(
      purchaseToUpdate.id, 
      selectedFile, 
      sendEmailFlag
    );
    
    if (success) {
      setIsUploadModalOpen(false);
      setSelectedFile(null);
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
  
  // Filter purchases based on search term and email filter
  const filteredPurchases = purchases.filter(purchase => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      purchase.id?.toLowerCase().includes(searchLower) ||
      purchase.beat_title?.toLowerCase().includes(searchLower) ||
      purchase.artist_name?.toLowerCase().includes(searchLower) ||
      purchase.customer_name?.toLowerCase().includes(searchLower) ||
      purchase.customer_email?.toLowerCase().includes(searchLower)
    );
    
    const matchesEmailFilter = emailFilter === 'all' || 
      (emailFilter === 'sent' && purchase.send_email) ||
      (emailFilter === 'pending' && !purchase.send_email);
    
    return matchesSearch && matchesEmailFilter;
  });

   const handlePageChange = (pageId) => {
    console.log('Navigate to:', pageId);
    // Here you would implement navigation logic
  };

  // Stats calculations
  const totalPurchases = purchases.length;
  const pendingLicenses = purchases.filter(p => !p.license_uploaded).length;
  const emailsSent = purchases.filter(p => p.send_email).length;

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
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
            {/* Header section */}
            <div className="mb-8">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Music className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Purchases</p>
                    <p className="text-2xl font-bold text-gray-900">{totalPurchases}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Licenses</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingLicenses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                    <p className="text-2xl font-bold text-gray-900">{emailsSent}</p>
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
            {uploadSuccess && (
              <div className="fixed top-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-lg z-50 animate-fade-in-out">
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
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Beat & Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        License Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Status
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {purchase.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center">
                                <Music className="h-4 w-4 text-[#2d7a63]" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{purchase.beat_title}</div>
                                <div className="text-sm text-gray-500">by {purchase.artist_name}</div>
                                <div className="text-xs text-gray-400">{purchase.customer_name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {purchase.license_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                            ${purchase.purchase_amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {purchase.send_email ? (
                                <>
                                  <Mail className="h-4 w-4 text-green-500 mr-1" />
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Sent
                                  </span>
                                </>
                              ) : (
                                <>
                                  <MailX className="h-4 w-4 text-yellow-500 mr-1" />
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Pending
                                  </span>
                                </>
                              )}
                            </div>
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
                                <Upload size={16} className="mr-1" /> 
                                <span className="hidden sm:inline">Upload</span>
                              </button>
                            )}
                            {purchase.license_uploaded && (
                              <button
                                onClick={() => {/* Add download logic here */}}
                                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition duration-150"
                              >
                                <Download size={16} className="mr-1" /> 
                                <span className="hidden sm:inline">Download</span>
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
              
              {/* Pagination controls */}
              {purchases.length > 0 && !searchTerm && (
                <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                    Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                    <span className="font-medium">{pagination.totalPages}</span> (Total:{' '}
                    <span className="font-medium">{pagination.total}</span> purchases)
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
      
      {/* View Purchase Modal */}
      {isViewModalOpen && selectedPurchase && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Purchase Details</h2>
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
                  <Music className="h-10 w-10 text-[#2d7a63]" />
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
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-[#2d7a63] text-white rounded-md hover:bg-[#245a4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d7a63] transition duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload License Modal */}
      {isUploadModalOpen && purchaseToUpdate && (
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
                    <Music className="h-5 w-5 text-[#2d7a63]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{purchaseToUpdate.beat_title}</p>
                    <p className="text-sm text-gray-500">by {purchaseToUpdate.artist_name}</p>
                    <p className="text-xs text-gray-400">Purchase ID: {purchaseToUpdate.id}</p>
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
                    checked={sendEmailFlag}
                    onChange={(e) => setSendEmailFlag(e.target.checked)}
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
                disabled={!selectedFile || isLoading}
                className={`px-4 py-2 bg-[#2d7a63] text-white rounded-md hover:bg-[#245a4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d7a63] transition duration-150 ${
                  (!selectedFile || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
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