import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Check,
  AlertCircle,
  Menu,
  User,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { useAdmins } from '../hooks/useUsers';

const AdminSubscriptionsPage = () => {
  const navigate = useNavigate();
  const {
    plans,
    isLoading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    updateUserSubscription,
    resetError,
  } = useSubscriptions();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUserSubscriptionModalOpen, setIsUserSubscriptionModalOpen] = useState(false);

  // User search state
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const userSearchRef = useRef(null);

  // Form states
  const [planForm, setPlanForm] = useState({
    name: '',
    frequency: 'monthly',
    amount: '',
    description: '',
  });

  const [userSubscriptionForm, setUserSubscriptionForm] = useState({
    userId: '',
    planId: '',
  });

  // Fetch users for search
  const { users, isLoading: isLoadingUsers } = useAdmins();

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
    }
  };

  const handleCreatePlan = async () => {
    const result = await createPlan({
      name: planForm.name,
      frequency: planForm.frequency,
      amount: parseFloat(planForm.amount),
      description: planForm.description,
    });

    if (result.success) {
      setIsCreateModalOpen(false);
      setPlanForm({ name: '', frequency: 'monthly', amount: '', description: '' });
      resetError();
    }
  };

  const handleEditPlan = async () => {
    if (!selectedPlan) return;

    const result = await updatePlan(selectedPlan.id, {
      name: planForm.name,
      frequency: planForm.frequency,
      amount: parseFloat(planForm.amount),
      description: planForm.description,
    });

    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedPlan(null);
      setPlanForm({ name: '', frequency: 'monthly', amount: '', description: '' });
      resetError();
    }
  };

  const handleDeletePlan = async () => {
    if (!selectedPlan) return;

    const result = await deletePlan(selectedPlan.id);

    if (result.success) {
      setIsDeleteModalOpen(false);
      setSelectedPlan(null);
      resetError();
    }
  };

  const handleUpdateUserSubscription = async () => {
    if (!selectedUser || !userSubscriptionForm.planId) return;

    const result = await updateUserSubscription(
      parseInt(selectedUser.id),
      parseInt(userSubscriptionForm.planId)
    );

    if (result.success) {
      setIsUserSubscriptionModalOpen(false);
      setUserSubscriptionForm({ userId: '', planId: '' });
      setSelectedUser(null);
      setUserSearchTerm('');
      setShowUserDropdown(false);
      resetError();
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const term = userSearchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.id?.toString().includes(term)
    );
  });

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUserSearchTerm(user.username || user.email || `User #${user.id}`);
    setShowUserDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userSearchRef.current && !userSearchRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const openEditModal = (plan) => {
    setSelectedPlan(plan);
    setPlanForm({
      name: plan.name || '',
      frequency: plan.frequency || 'monthly',
      amount: plan.amount?.toString() || '',
      description: plan.description || '',
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const filteredPlans = plans.filter((plan) => {
    const term = searchTerm.toLowerCase();
    return (
      plan.name?.toLowerCase().includes(term) ||
      plan.description?.toLowerCase().includes(term) ||
      plan.frequency?.toLowerCase().includes(term) ||
      plan.amount?.toString().includes(term) ||
      plan.id?.toString().includes(term)
    );
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        currentPage="subscriptions"
        onPageChange={handlePageChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
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
                <h1 className="text-xl font-bold text-gray-900">Subscriptions</h1>
                <p className="text-sm text-gray-500">Manage plans & user subscriptions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-6 px-6 pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-7 h-7 text-[#2D8C72]" />
                    Subscription Manager
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Create and manage subscription plans, assign plans to users
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search plans..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setPlanForm({ name: '', frequency: 'monthly', amount: '', description: '' });
                      setIsCreateModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2D8C72] text-white rounded-lg hover:bg-[#245a4f] transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Plan</span>
                  </button>

                  <button
                    onClick={() => setIsUserSubscriptionModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Assign Plan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Plans List - Professional table-style layout */}
            <div className="flex-1 overflow-auto px-4 lg:px-6 pb-6">
              {isLoading && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Loading subscription plans...</div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                  <button
                    onClick={resetError}
                    className="ml-auto text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {!isLoading && filteredPlans.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <CreditCard className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="text-lg font-medium">No subscription plans found</p>
                  <p className="text-sm mt-1">Create your first plan to get started</p>
                </div>
              )}

              {!isLoading && filteredPlans.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  {/* Table header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      Plan
                    </div>
                    <div className="col-span-2">Billing</div>
                    <div className="col-span-4">Description</div>
                    <div className="col-span-2 text-right">Plan ID</div>
                    <div className="col-span-1 text-right">Actions</div>
                  </div>

                  {/* Table body */}
                  <div className="divide-y divide-gray-200">
                    {filteredPlans.map((plan) => {
                      const formattedAmount = plan.amount
                        ? new Intl.NumberFormat('en-NG', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(plan.amount)
                        : '0';
                      const monthlyEquivalent =
                        plan.frequency === 'annual' && plan.amount
                          ? new Intl.NumberFormat('en-NG', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(Math.round(plan.amount / 12))
                          : null;

                      return (
                        <div
                          key={plan.id}
                          className="group px-4 md:px-6 py-4 md:grid md:grid-cols-12 md:items-center gap-4 hover:bg-gray-50 transition-colors"
                        >
                          {/* Plan name + frequency (mobile stacks) */}
                          <div className="md:col-span-3 flex items-start gap-3">
                            <div className="mt-1 hidden md:flex h-9 w-9 items-center justify-center rounded-lg bg-[#2D8C72]/10 text-[#2D8C72]">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {plan.name || 'Unnamed plan'}
                                </p>
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium uppercase text-gray-700">
                                  {plan.frequency || 'monthly'}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs text-gray-500 md:hidden">
                                ₦{formattedAmount}{' '}
                                <span className="text-[11px] text-gray-400">
                                  /{plan.frequency === 'annual' ? 'year' : 'month'}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Billing info */}
                          <div className="md:col-span-2 hidden md:flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">
                              ₦{formattedAmount}
                              <span className="text-xs font-normal text-gray-500">
                                /{plan.frequency === 'annual' ? 'year' : 'month'}
                              </span>
                            </span>
                            {monthlyEquivalent && (
                              <span className="text-xs text-gray-500">
                                ~₦{monthlyEquivalent} / month
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <div className="md:col-span-4 mt-2 md:mt-0">
                            {plan.description ? (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {plan.description}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-400 italic">
                                No description provided
                              </p>
                            )}
                          </div>

                          {/* Plan ID */}
                          <div className="md:col-span-2 mt-2 md:mt-0 flex md:justify-end">
                            <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                              ID #{plan.id}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="md:col-span-1 mt-3 md:mt-0 flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(plan)}
                              className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="w-3.5 h-3.5 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(plan)}
                              className="inline-flex items-center rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Delete
                            </button>
                          </div>

                          {/* Mobile billing row */}
                          <div className="mt-3 flex md:hidden justify-between text-xs text-gray-500">
                            <span>
                              Billing: ₦{formattedAmount}/
                              {plan.frequency === 'annual' ? 'year' : 'month'}
                            </span>
                            {monthlyEquivalent && (
                              <span>~₦{monthlyEquivalent}/mo</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Plan Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create New Plan</h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setPlanForm({ name: '', frequency: 'monthly', amount: '', description: '' });
                  resetError();
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  placeholder="e.g., Premium, Basic"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={planForm.frequency}
                  onChange={(e) => setPlanForm({ ...planForm, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={planForm.amount}
                  onChange={(e) => setPlanForm({ ...planForm, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  placeholder="Plan description..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setPlanForm({ name: '', frequency: 'monthly', amount: '', description: '' });
                    resetError();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlan}
                  className="flex-1 px-4 py-2 bg-[#2D8C72] text-white rounded-lg hover:bg-[#245a4f] transition-colors"
                >
                  Create Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {isEditModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Plan</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedPlan(null);
                  setPlanForm({ name: '', frequency: 'monthly', amount: '', description: '' });
                  resetError();
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={planForm.frequency}
                  onChange={(e) => setPlanForm({ ...planForm, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={planForm.amount}
                  onChange={(e) => setPlanForm({ ...planForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedPlan(null);
                    setPlanForm({ name: '', frequency: 'monthly', amount: '', description: '' });
                    resetError();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditPlan}
                  className="flex-1 px-4 py-2 bg-[#2D8C72] text-white rounded-lg hover:bg-[#245a4f] transition-colors"
                >
                  Update Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Plan Modal */}
      {isDeleteModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Delete Plan</h3>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedPlan(null);
                  resetError();
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the plan <strong>{selectedPlan.name}</strong>? This
                action cannot be undone.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedPlan(null);
                    resetError();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePlan}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update User Subscription Modal */}
      {isUserSubscriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Assign Plan to User</h3>
              <button
                onClick={() => {
                  setIsUserSubscriptionModalOpen(false);
                  setUserSubscriptionForm({ userId: '', planId: '' });
                  resetError();
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search User
                </label>
                <div className="relative" ref={userSearchRef}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={(e) => {
                      setUserSearchTerm(e.target.value);
                      setShowUserDropdown(true);
                      if (!e.target.value) {
                        setSelectedUser(null);
                      }
                    }}
                    onFocus={() => setShowUserDropdown(true)}
                    placeholder="Search by username, email, or ID"
                    className="w-full pl-10 pr-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                  />
                  
                  {/* User Dropdown */}
                  {showUserDropdown && userSearchTerm && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {isLoadingUsers ? (
                        <div className="p-3 text-sm text-gray-500">Loading users...</div>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.slice(0, 10).map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleUserSelect(user)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#2D8C72]/10 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-[#2D8C72]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.username || `User #${user.id}`}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                            <span className="text-xs text-gray-400">ID: {user.id}</span>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-500">No users found</div>
                      )}
                    </div>
                  )}

                  {/* Selected User Display */}
                  {selectedUser && (
                    <div className="mt-2 p-3 bg-[#2D8C72]/5 border border-[#2D8C72]/20 rounded-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2D8C72]/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#2D8C72]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {selectedUser.username || `User #${selectedUser.id}`}
                        </p>
                        <p className="text-xs text-gray-500">{selectedUser.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(null);
                          setUserSearchTerm('');
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Plan
                </label>
                <select
                  value={userSubscriptionForm.planId}
                  onChange={(e) =>
                    setUserSubscriptionForm({ ...userSubscriptionForm, planId: e.target.value })
                  }
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                >
                  <option value="">Select a plan</option>
                  {plans.map((plan) => {
                    const formattedAmount = plan.amount
                      ? new Intl.NumberFormat('en-NG', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(plan.amount)
                      : '0';
                    return (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - ₦{formattedAmount} ({plan.frequency})
                      </option>
                    );
                  })}
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsUserSubscriptionModalOpen(false);
                    setUserSubscriptionForm({ userId: '', planId: '' });
                    setSelectedUser(null);
                    setUserSearchTerm('');
                    setShowUserDropdown(false);
                    resetError();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUserSubscription}
                  disabled={!selectedUser || !userSubscriptionForm.planId}
                  className="flex-1 px-4 py-2 bg-[#2D8C72] text-white rounded-lg hover:bg-[#245a4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionsPage;


