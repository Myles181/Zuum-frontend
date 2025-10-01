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
  Menu,
  Filter
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useAdmins } from '../hooks/useUsers';


// Mock hook for demonstration - replace with your actual hook


const AdminUsersPage = () => {
  const navigate = useNavigate();
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'deactivated'
  
  // Use our custom hook for API operations
  const { 
    users, 
    isLoading, 
    error, 
    pagination, 
    deactivationSuccess,
    fetchUsers,
    deactivateUser,
    resetError 
  } = useAdmins();

  // Fetch users on page change
  useEffect(() => {
    if (currentPage > 1) {
      fetchUsers(currentPage);
    }
  }, [currentPage]); // Only depend on currentPage, not fetchUsers

  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  
  

  // Handle confirmation modal for deactivation
  const handleDeactivateClick = (user) => {
    setUserToDeactivate(user);
    setIsConfirmModalOpen(true);
  };

  // Handle user deactivation
  const handleDeactivateConfirm = async () => {
    if (!userToDeactivate) return;
    const success = await deactivateUser(userToDeactivate.id);
    if (success) {
      setIsConfirmModalOpen(false);
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
  
  // Filter users based on search term and status filter
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.firstname?.toLowerCase().includes(searchLower) ||
      user.lastname?.toLowerCase().includes(searchLower) ||
      user.id?.toString().includes(searchLower)
    );
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && !user.deactivated) ||
      (statusFilter === 'deactivated' && user.deactivated);
    
    return matchesSearch && matchesStatus;
  });

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
        currentPage="users"
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
                <h1 className="text-xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">Manage user accounts</p>
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
                  placeholder="Search users..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] transition-all duration-200"
            >
              <option value="all">All Users</option>
              <option value="active">Active Only</option>
              <option value="deactivated">Deactivated Only</option>
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
                  <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                  <p className="mt-2 text-gray-600">Manage and monitor user accounts across the platform</p>
                </div>
                
                {/* Desktop Search bar */}
                <div className="relative w-full md:w-64 lg:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] sm:text-sm transition duration-150"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="px-4 lg:px-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">
                        {users.filter(u => !u.deactivated).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-sm font-medium text-gray-600">Deactivated</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">
                        {users.filter(u => u.deactivated).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#2d7a63] bg-opacity-10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{users.length}</p>
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
            {deactivationSuccess && (
              <div className="fixed top-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg z-50 animate-fade-in-out">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">User deactivated successfully!</p>
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
                          User ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Name
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
                              <span className="ml-3 text-gray-600">Loading users...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr 
                            key={user.id} 
                            className={`hover:bg-gray-50 transition duration-150 ${user.deactivated ? "bg-red-50" : ""}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                              {user.firstname} {user.lastname}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${user.deactivated 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'}`}
                              >
                                {user.deactivated ? 'Deactivated' : 'Active'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleViewUser(user)}
                                className="inline-flex items-center text-[#2d7a63] hover:text-[#245a4f] mr-4 transition duration-150"
                              >
                                <Eye size={16} className="mr-1" /> 
                                <span className="hidden sm:inline">View</span>
                              </button>
                              {!user.deactivated && (
                                <button
                                  onClick={() => handleDeactivateClick(user)}
                                  className="inline-flex items-center text-red-600 hover:text-red-900 transition duration-150"
                                >
                                  <X size={16} className="mr-1" /> 
                                  <span className="hidden sm:inline">Deactivate</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                            {searchTerm ? 'No users found matching your search' : 'No users found'}
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
                        <span className="ml-3 text-gray-600">Loading users...</span>
                      </div>
                    </div>
                  ) : filteredUsers.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <div 
                          key={user.id} 
                          className={`p-4 ${user.deactivated ? "bg-red-50" : ""} transition duration-150`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-[#2d7a63]" />
                              </div>
                              <div className="ml-3">
                                <div className="text-base font-semibold text-gray-900">{user.username}</div>
                                <div className="text-sm text-gray-500">ID: {user.id}</div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                              ${user.deactivated 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'}`}
                            >
                              {user.deactivated ? 'Deactivated' : 'Active'}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Email:</span> {user.email}
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Name:</span> {user.firstname} {user.lastname}
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-[#2d7a63] text-sm font-medium rounded-lg text-[#2d7a63] bg-white hover:bg-[#245a4f] hover:text-white transition duration-150 shadow-sm"
                            >
                              <Eye size={16} className="mr-2" /> 
                              View Details
                            </button>
                            {!user.deactivated && (
                              <button
                                onClick={() => handleDeactivateClick(user)}
                                className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-red-600 text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-600 hover:text-white transition duration-150 shadow-sm"
                              >
                                <X size={16} className="mr-2" /> 
                                Deactivate
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-sm text-gray-500">
                      {searchTerm ? 'No users found matching your search' : 'No users found'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Pagination controls */}
            {users.length > 0 && !searchTerm && (
              <div className="px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white">
                <div className="text-sm text-gray-700 mb-4 sm:mb-0 text-center sm:text-left">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span> (Total:{' '}
                  <span className="font-medium">{pagination.total}</span> users)
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
      
      {/* View User Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">User Details</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d7a63] p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
              <div className="flex flex-col items-center mb-4 lg:mb-6">
                <div className="h-16 w-16 lg:h-20 lg:w-20 bg-[#2d7a63] bg-opacity-10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 lg:h-10 lg:w-10 text-[#2d7a63]" />
                </div>
                <h3 className="mt-3 lg:mt-4 text-base lg:text-lg font-medium text-gray-900">{selectedUser.username}</h3>
                <p className={`mt-1 text-xs lg:text-sm ${selectedUser.deactivated ? "text-red-600" : "text-green-600"}`}>
                  {selectedUser.deactivated ? 'Deactivated' : 'Active'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 lg:gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all">{selectedUser.email}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.id}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedUser.firstname} {selectedUser.middlename ? selectedUser.middlename : ''} {selectedUser.lastname}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Identity</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.identity || 'Not specified'}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.phonenumber || 'Not provided'}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Created</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 lg:p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 bg-[#2d7a63] text-white rounded-md hover:bg-[#245a4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d7a63] transition duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {isConfirmModalOpen && userToDeactivate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">Confirm Deactivation</h2>
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d7a63] p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 lg:p-6">
              <div className="flex items-start mb-4 lg:mb-6">
                <div className="h-8 w-8 lg:h-10 lg:w-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-4 w-4 lg:h-5 w-5 text-red-600" />
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  Are you sure you want to deactivate <span className="font-semibold">{userToDeactivate.username}</span>? 
                  This will prevent them from accessing the system.
                </p>
              </div>
            </div>
            
            <div className="p-4 lg:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d7a63] transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateConfirm}
                className="w-full sm:w-auto px-4 bg-red-600 border border-transparent rounded-md text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;