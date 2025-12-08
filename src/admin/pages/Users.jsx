import { useState, useEffect, useMemo } from 'react';
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
  Filter,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Wallet,
  Shield,
  CheckCircle2,
  XCircle,
  UserCircle,
  Building2
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useAdmins } from '../hooks/useUsers';
import { useUserById } from '../hooks/useUserById';

const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200];

const AdminUsersPage = () => {
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  
  // Selection / modal states
  const [selectedUser, setSelectedUser] = useState(null);
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
    deactivationSuccess,
    deactivateUser,
    resetError 
  } = useAdmins();

  // Use hook to fetch detailed user data by ID
  const { 
    user: detailedUser, 
    isLoading: isLoadingUserDetails, 
    error: userDetailsError,
    fetchUserById,
    resetError: resetUserDetailsError
  } = useUserById();

  console.log(detailedUser);

  const filteredUsers = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return users.filter(user => {
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
  }, [users, searchTerm, statusFilter]);

  const totalUsers = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize) || 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = totalUsers === 0 ? 0 : (safeCurrentPage - 1) * pageSize;
  const endIndexExclusive = startIndex + pageSize;
  const startEntry = totalUsers === 0 ? 0 : startIndex + 1;
  const endEntry = totalUsers === 0 ? 0 : Math.min(endIndexExclusive, totalUsers);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndexExclusive);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Handle view user details
  const handleViewUser = async (user) => {
    setSelectedUser(user);
    // Fetch detailed user data from API
    if (user?.id) {
      await fetchUserById(user.id);
    }
  };

  // Use detailed user data if available, otherwise fall back to selectedUser from list
  const displayUser = detailedUser || selectedUser;

  
  

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
    if (safeCurrentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (safeCurrentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const handlePageSizeChange = (event) => {
    const newSize = Number(event.target.value);
    if (!Number.isNaN(newSize)) {
      setPageSize(newSize);
      setCurrentPage(1);
    }
  };
  
  const adminRoutes = {
    users: '/users',
    distribution: '/addistributions',
    beat: '/adbeat',
    'beat-posts': '/admin-beat-posts',
    'audio-posts': '/admin-audio-posts',
    promotion: '/adpromotion',
    wallet: '/admin-wallet',
    cryptoWallet: '/admin-wallet-crypto',
    subscriptions: '/admin-subscriptions',
    settings: '/admin-settings',
    'zuum-news': '/admin-zuum-news',
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
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-base bg-white placeholder-gray-500  text-black focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] transition-all duration-200"
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

            {/* Stats Cards - Only show when no user is selected */}
            {!selectedUser && (
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
            )}
            
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
                {/* Desktop: list OR details */}
                {!selectedUser ? (
                <div className="hidden lg:block h-full overflow-auto">
                      {isLoading ? (
                      <div className="p-8 text-center">
                        <div className="flex justify-center items-center space-x-3">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d7a63]"></div>
                          <span className="text-sm text-gray-600">Loading users...</span>
                        </div>
                            </div>
                      ) : filteredUsers.length > 0 ? (
                      <>
                        {/* Table header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                          <div className="col-span-4">User</div>
                          <div className="col-span-3">Contact</div>
                          <div className="col-span-3">Status & Meta</div>
                          <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {/* Table body */}
                        <div className="divide-y divide-gray-100">
                          {paginatedUsers.map((user) => {
                            const isDeactivated = user.deactivated;
                            const statusClasses = isDeactivated
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800';

                            const subscriptionActive =
                              user.subscription_status === 'active' ||
                              user.subscription_status === '5' ||
                              user.subscription_plan_id;

                            return (
                              <div
                            key={user.id} 
                                className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                                  isDeactivated ? 'bg-red-50/40' : ''
                                }`}
                              >
                                <div className="grid grid-cols-12 gap-4 items-center">
                                  {/* User column */}
                                  <div className="col-span-4 flex items-start gap-3">
                                    <div className="h-9 w-9 rounded-full bg-[#2d7a63]/10 flex items-center justify-center overflow-hidden">
                                      {user.image ? (
                                        <img
                                          src={user.image}
                                          alt={user.username || user.email}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <User className="h-4 w-4 text-[#2d7a63]" />
                                      )}
                                </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user.username || user.email || `User #${user.id}`}
                                      </p>
                                      <p className="mt-0.5 text-xs text-gray-500 truncate">
                                        ID #{user.id}
                                      </p>
                                </div>
                              </div>

                                  {/* Contact column */}
                                  <div className="col-span-3 text-xs text-gray-600 space-y-1">
                                    <p className="truncate">
                                      <span className="text-gray-500">Email: </span>
                                      <span className="font-medium text-gray-800">
                                        {user.email || 'Not set'}
                                      </span>
                                    </p>
                                    <p className="truncate">
                                      <span className="text-gray-500">Name: </span>
                                      <span className="font-medium text-gray-800">
                                        {user.firstname || user.lastname
                                          ? `${user.firstname || ''} ${user.lastname || ''}`.trim()
                                          : 'Not provided'}
                                      </span>
                                    </p>
                                  </div>

                                  {/* Status & meta */}
                                  <div className="col-span-3 text-xs text-gray-600 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusClasses}`}
                                      >
                                        {isDeactivated ? 'Deactivated' : 'Active'}
                                      </span>
                                      {user.email_verified && (
                                        <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-[11px] font-medium">
                                          <Shield className="w-3 h-3 mr-1" />
                                          Verified
                                        </span>
                                      )}
                                      {subscriptionActive && (
                                        <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 px-2.5 py-0.5 text-[11px] font-medium">
                                          <CreditCard className="w-3 h-3 mr-1" />
                                          Subscribed
                              </span>
                                      )}
                                    </div>
                                    {user.created_at && (
                                      <p className="text-[11px] text-gray-500">
                                        Joined{' '}
                                        {new Date(user.created_at).toLocaleDateString('en-NG', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                        })}
                                      </p>
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div className="col-span-2 flex justify-end gap-2">
                              <button
                                onClick={() => handleViewUser(user)}
                                      className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                              >
                                      <Eye size={14} className="mr-1" />
                                      View
                              </button>
                                    {!isDeactivated && (
                                <button
                                  onClick={() => handleDeactivateClick(user)}
                                        className="inline-flex items-center rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                >
                                        <X size={14} className="mr-1" />
                                        Deactivate
                                </button>
                              )}
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
                          ? 'No users found matching your search'
                          : 'No users found'}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden lg:flex h-full flex-col overflow-auto">
                    {isLoadingUserDetails ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d7a63] mx-auto mb-4"></div>
                          <p className="text-sm text-gray-600">Loading user details...</p>
                        </div>
                      </div>
                    ) : userDetailsError ? (
                      <div className="p-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-700 mb-2">{userDetailsError}</p>
                          <button
                            onClick={() => {
                              resetUserDetailsError();
                              if (selectedUser?.id) {
                                fetchUserById(selectedUser.id);
                              }
                            }}
                            className="text-xs text-red-700 hover:underline"
                          >
                            Try again
                          </button>
                        </div>
                      </div>
                    ) : displayUser ? (
                      <>
                        {/* Modern Header Section */}
                        <div className="bg-gradient-to-r from-[#2D8C72] to-[#34A085] p-6 text-white">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(null);
                              resetUserDetailsError();
                            }}
                            className="mb-4 inline-flex items-center text-sm text-white/90 hover:text-white transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to user list
                          </button>
                          
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                                {displayUser.image ? (
                                  <img 
                                    src={displayUser.image} 
                                    alt={displayUser.username}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <UserCircle className="w-10 h-10 text-white" />
                                )}
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold mb-1">
                                  {displayUser.username || displayUser.email || 'User'}
                                </h2>
                                <p className="text-white/80 text-sm mb-3">
                                  {displayUser.firstname} {displayUser.lastname}
                                </p>
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    displayUser.deactivated
                                      ? 'bg-red-500/20 text-red-100'
                                      : 'bg-green-500/20 text-green-100'
                                  }`}>
                                    {displayUser.deactivated ? (
                                      <XCircle className="w-3 h-3" />
                                    ) : (
                                      <CheckCircle2 className="w-3 h-3" />
                                    )}
                                    {displayUser.deactivated ? 'Deactivated' : 'Active'}
                                  </span>
                                  {displayUser.email_verified && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-100">
                                      <Shield className="w-3 h-3" />
                                      Verified
                                    </span>
                                  )}
                                  {displayUser.subscription_status && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-100">
                                      <CreditCard className="w-3 h-3" />
                                      {displayUser.subscription_status === 'active' || displayUser.subscription_status === '5' ? 'Subscribed' : 'Subscription'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => navigate(`/admin-analytics/${displayUser.id}`)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#2D8C72] bg-white hover:bg-gray-50 transition-colors shadow-lg"
                            >
                              <TrendingUp className="w-4 h-4" />
                              Analytics
                            </button>
                          </div>
                        </div>

                        <div className="p-6 space-y-6 bg-gray-50">
                          {/* Financial Overview Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <Wallet className="w-5 h-5 text-green-600" />
                                </div>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              </div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Balance
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                ₦{(displayUser.balance ?? 0).toLocaleString()}
                              </p>
                            </div>
                            
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <TrendingDown className="w-5 h-5 text-blue-600" />
                                </div>
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              </div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Withdrawals
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                ₦{(displayUser.total_withdrawals ?? 0).toLocaleString()}
                              </p>
                            </div>
                            
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              </div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Deposits
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                ₦{(displayUser.total_deposits ?? 0).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* User Information Section */}
                          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <UserCircle className="w-4 h-4" />
                                User Information
                              </h3>
                            </div>
                            <div className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                      Email Address
                                    </p>
                                    <p className="text-sm text-gray-900 break-all font-medium">
                                      {displayUser.email}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                      User ID
                                    </p>
                                    <p className="text-sm text-gray-900 font-medium">
                                      {displayUser.id}
                                      {displayUser.user_id && displayUser.user_id !== displayUser.id && (
                                        <span className="text-gray-500 ml-2 text-xs">(Profile: {displayUser.user_id})</span>
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <UserCircle className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                      Full Name
                                    </p>
                                    <p className="text-sm text-gray-900 font-medium">
                                      {displayUser.firstname}{' '}
                                      {displayUser.middlename || ''}{' '}
                                      {displayUser.lastname}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                      Identity
                                    </p>
                                    <p className="text-sm text-gray-900 font-medium capitalize">
                                      {displayUser.identity || 'Not specified'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                      Phone Number
                                    </p>
                                    <p className="text-sm text-gray-900 font-medium">
                                      {displayUser.phonenumber || 'Not provided'}
                                    </p>
                                  </div>
                                </div>

                                {displayUser.label_name && displayUser.label_name !== 'NULL' && (
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Building2 className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                        Label Name
                                      </p>
                                      <p className="text-sm text-gray-900 font-medium">
                                        {displayUser.label_name}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                      Account Created
                                    </p>
                                    <p className="text-sm text-gray-900 font-medium">
                                      {displayUser.created_at
                                        ? new Date(displayUser.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })
                                        : 'Unknown'}
                                    </p>
                                  </div>
                                </div>

                                {displayUser.usdt_balance !== undefined && (
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <CreditCard className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                        USDT Balance
                                      </p>
                                      <p className="text-sm text-gray-900 font-medium">
                                        {displayUser.usdt_balance?.toLocaleString() || '0'} USDT
                                      </p>
                                    </div>
                                  </div>
                                )}
                </div>

                              {/* Bio Section */}
                              {displayUser.bio && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Bio
                                  </p>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {displayUser.bio}
                                  </p>
                                </div>
                              )}

                              {/* Social Stats */}
                              <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                                  Social Statistics
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 mb-1">Followers</p>
                                    <p className="text-lg font-bold text-gray-900">
                                      {displayUser.followers ?? 0}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 mb-1">Following</p>
                                    <p className="text-lg font-bold text-gray-900">
                                      {displayUser.following ?? 0}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                )}

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
                      {paginatedUsers.map((user) => (
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
              <div className="px-4 lg:px-6 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-t border-gray-200 bg-white">
                <div className="text-sm text-gray-700 text-center lg:text-left">
                  Showing <span className="font-medium">{startEntry}</span> - <span className="font-medium">{endEntry}</span> of{' '}
                  <span className="font-medium">{totalUsers}</span> users &middot; Page{' '}
                  <span className="font-medium">{safeCurrentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Rows per page
                  </label>
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="w-full sm:w-auto rounded-lg text-black border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a63]"
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
                    disabled={safeCurrentPage === 1}
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg 
                      ${safeCurrentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'}`}
                  >
                    <ChevronLeft size={18} className="mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <button
                    onClick={goToNextPage}
                    disabled={safeCurrentPage === totalPages}
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg 
                      ${safeCurrentPage === totalPages 
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