import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Search, Plus, X, Check, Loader2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useWallet } from '../hooks/useWallet';
import { useDeposits } from '../hooks/useDeposits';

// Chain options for the dropdown
const CHAIN_OPTIONS = [
  { value: 'TRON', label: 'TRON (USDT)' },
  { value: 'ETH', label: 'Ethereum (USDT)' },
  { value: 'BSC', label: 'BSC (USDT)' },
];

// Helper to get display label from chain
const getChainLabel = (chain) => {
  const option = CHAIN_OPTIONS.find((opt) => opt.value === chain);
  return option ? option.label : chain;
};

const AdminCryptoWalletPage = () => {
  const navigate = useNavigate();

  // Wallet hook integration
  const {
    wallets,
    isLoading: walletsLoading,
    error: walletsError,
    success: walletsSuccess,
    addWallet,
    updateWallet,
    deleteWallet,
    resetError,
    resetSuccess,
  } = useWallet();

  // Deposits hook integration
  const {
    deposits,
    pagination,
    isLoading: depositsLoading,
    error: depositsError,
    success: depositsSuccess,
    fetchDeposits,
    approveDeposit,
    rejectDeposit,
    resetError: resetDepositsError,
    resetSuccess: resetDepositsSuccess,
  } = useDeposits();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptoStatusFilter, setCryptoStatusFilter] = useState('all'); // all | PENDING | APPROVED | REJECTED | COMPLETED | FAILED
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: '',
    chain: 'TRON',
  });
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // Track which wallet action is loading
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // Track which wallet to delete
  const [approvalTxId, setApprovalTxId] = useState(''); // Transaction ID for approval

  // Fetch deposits on component mount and when filter changes
  useEffect(() => {
    const filters = {};
    if (cryptoStatusFilter !== 'all') {
      filters.status = cryptoStatusFilter;
    }
    fetchDeposits(filters);
  }, [cryptoStatusFilter]);

  // Auto-clear success/error messages for wallets
  useEffect(() => {
    if (walletsSuccess) {
      const timer = setTimeout(() => resetSuccess(), 3000);
      return () => clearTimeout(timer);
    }
  }, [walletsSuccess, resetSuccess]);

  useEffect(() => {
    if (walletsError) {
      const timer = setTimeout(() => resetError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [walletsError, resetError]);

  // Auto-clear success/error messages for deposits
  useEffect(() => {
    if (depositsSuccess) {
      const timer = setTimeout(() => resetDepositsSuccess(), 3000);
      return () => clearTimeout(timer);
    }
  }, [depositsSuccess, resetDepositsSuccess]);

  useEffect(() => {
    if (depositsError) {
      const timer = setTimeout(() => resetDepositsError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [depositsError, resetDepositsError]);

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

  const filteredDeposits = deposits.filter((d) => {
    const term = searchTerm.toLowerCase();
    const userName = d.user?.name || d.user?.email || '';
    const searchMatch =
      !term ||
      userName.toLowerCase().includes(term) ||
      (d.tx_id || '').toLowerCase().includes(term) ||
      (d.source_wallet_address || '').toLowerCase().includes(term) ||
      (d.dest_wallet_address || '').toLowerCase().includes(term) ||
      String(d.id).includes(term);
    return searchMatch;
  });

  const openDepositModal = (deposit) => {
    setSelectedDeposit(deposit);
  };

  const closeDepositModal = () => {
    setSelectedDeposit(null);
  };

  const handleApproveDeposit = async () => {
    if (!selectedDeposit || selectedDeposit.status !== 'PENDING') return;
    if (!approvalTxId.trim()) {
      alert('Please enter a transaction ID to approve this deposit.');
      return;
    }
    
    setActionLoading('approve');
    const success = await approveDeposit(selectedDeposit.id, approvalTxId.trim());
    setActionLoading(null);
    
    if (success) {
      setApprovalTxId('');
    closeDepositModal();
    }
  };

  const handleDeclineDeposit = async () => {
    if (!selectedDeposit || selectedDeposit.status !== 'PENDING') return;
    
    const reason = prompt('Enter rejection reason (optional):') || '';
    
    setActionLoading('reject');
    const success = await rejectDeposit(selectedDeposit.id, reason);
    setActionLoading(null);
    
    if (success) {
    closeDepositModal();
    }
  };

  const openAddressModal = () => {
    setNewAddress({
      address: '',
      chain: 'TRON',
    });
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.address || !newAddress.chain) return;

    setActionLoading('add');
    const success = await addWallet(newAddress.address, newAddress.chain, true);
    setActionLoading(null);

    if (success) {
      setShowAddressModal(false);
    }
  };

  const toggleAddressActive = async (wallet) => {
    setActionLoading(wallet.id);
    await updateWallet(wallet.id, { active: !wallet.active });
    setActionLoading(null);
  };

  const handleDeleteWallet = async (walletId) => {
    setActionLoading(walletId);
    await deleteWallet(walletId);
    setActionLoading(null);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar
        currentPage="cryptoWallet"
        onPageChange={handlePageChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 bg-slate-50 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Mobile header */}
        <div className="lg:hidden bg-white/90 backdrop-blur-sm shadow-sm border-b border-slate-200 px-4 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
              >
                <Wallet size={22} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Crypto wallet
                </h1>
                <p className="text-xs text-slate-500">
                  USDT deposits & wallet addresses
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Desktop header */}
            <div className="hidden lg:block mb-6 px-8 pt-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold text-slate-900 flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Wallet className="w-5 h-5" />
                    </span>
                    Crypto wallet
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Review USDT deposits and manage your on-chain wallet
                    addresses.
                  </p>
                </div>

                <div className="relative w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by user, tx hash or ID"
                    className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Success/Error notifications */}
            {(walletsSuccess || walletsError || depositsSuccess || depositsError) && (
              <div className="px-4 lg:px-8 mb-4 space-y-2">
                {(walletsSuccess || depositsSuccess) && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    {walletsSuccess || depositsSuccess}
                  </div>
                )}
                {(walletsError || depositsError) && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {walletsError || depositsError}
                  </div>
                )}
              </div>
            )}

            {/* Top row: wallet address management */}
            <div className="px-4 lg:px-8 mb-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Wallet addresses
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage the USDT addresses users should send to.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openAddressModal}
                    disabled={walletsLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 hover:bg-emerald-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add address
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {walletsLoading && wallets.length === 0 && (
                    <div className="px-4 py-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading wallets...
                    </div>
                  )}

                  {!walletsLoading && wallets.length === 0 && (
                    <div className="px-4 py-6 text-sm text-slate-500">
                      No wallet addresses configured yet.
                    </div>
                  )}

                  {wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {getChainLabel(wallet.chain)}
                        </p>
                        <p className="text-xs font-mono text-slate-600 break-all">
                          {wallet.address}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {wallet.chain}
                          {wallet.created_at && (
                            <>
                              {' '}•{' '}
                              {new Date(wallet.created_at).toLocaleDateString('en-NG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            wallet.active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {wallet.active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleAddressActive(wallet)}
                          disabled={actionLoading === wallet.id}
                          className="text-xs font-medium text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                        >
                          {actionLoading === wallet.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : null}
                          {wallet.active ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(wallet.id)}
                          disabled={actionLoading === wallet.id}
                          className="text-xs font-medium text-red-600 border border-red-200 rounded-lg px-2.5 py-1 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Crypto deposits table */}
            <div className="flex-1 overflow-auto px-4 lg:px-8 pb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header + status filter */}
                <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Crypto / USDT deposits
                    </h2>
                    <p className="text-xs text-slate-500">
                      Approve or reject on-chain payments after confirming on
                      your gateway.
                    </p>
                  </div>
                  <div className="inline-flex rounded-full bg-slate-100 p-1 text-[11px] font-medium text-slate-600 flex-wrap">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'PENDING', label: 'Pending' },
                      { value: 'APPROVED', label: 'Approved' },
                      { value: 'REJECTED', label: 'Rejected' },
                      { value: 'COMPLETED', label: 'Completed' },
                      { value: 'FAILED', label: 'Failed' },
                    ].map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setCryptoStatusFilter(s.value)}
                        className={`px-3 py-1 rounded-full ${
                          cryptoStatusFilter === s.value
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table header (desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-3">User</div>
                  <div className="col-span-3">Transaction</div>
                  <div className="col-span-2">Network</div>
                  <div className="col-span-2 text-right">Amount (USDT)</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>

                {/* Table body */}
                <div className="divide-y divide-slate-100">
                  {depositsLoading && (
                    <div className="px-4 py-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading deposits...
                    </div>
                  )}

                  {!depositsLoading && filteredDeposits.length === 0 && (
                    <div className="px-4 py-6 text-sm text-slate-500">
                      No crypto deposits found for this filter.
                    </div>
                  )}

                  {!depositsLoading && filteredDeposits.map((d) => {
                    const dateLabel = d.created_at
                      ? new Date(d.created_at).toLocaleString('en-NG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A';

                    const statusClasses =
                      d.status === 'APPROVED' || d.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : d.status === 'REJECTED' || d.status === 'FAILED'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700';

                    const userName = d.user?.name || d.user?.email || `User #${d.user_id}`;
                    const chainLabel = getChainLabel(d.chain) || d.chain || 'Unknown';

                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => openDepositModal(d)}
                        className="w-full text-left px-4 md:px-6 py-3 hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="md:grid md:grid-cols-12 md:items-center gap-4">
                          {/* User */}
                          <div className="md:col-span-3">
                            <p className="text-sm font-medium text-slate-900">
                              {userName}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 md:hidden">
                              {d.amount || 0} USDT • {chainLabel}
                            </p>
                          </div>

                          {/* Transaction */}
                          <div className="md:col-span-3 mt-1 md:mt-0">
                            <p className="text-xs text-slate-500 truncate">
                              Tx: {d.tx_id || 'Pending'}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400">
                              {dateLabel}
                            </p>
                          </div>

                          {/* Network */}
                          <div className="md:col-span-2 mt-2 md:mt-0 text-xs text-slate-600">
                            {chainLabel}
                          </div>

                          {/* Amount */}
                          <div className="md:col-span-2 mt-2 md:mt-0 text-right">
                            <p className="text-sm font-semibold text-slate-900">
                              {d.amount || 0} USDT
                            </p>
                          </div>

                          {/* Status */}
                          <div className="md:col-span-2 mt-2 md:mt-0 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusClasses}`}
                            >
                              {d.status || 'PENDING'}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit detail modal */}
      {selectedDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Crypto deposit
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  ID #{selectedDeposit.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setApprovalTxId('');
                  closeDepositModal();
                }}
                disabled={actionLoading}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">User</span>
                <span className="font-medium text-slate-900">
                  {selectedDeposit.user?.name || selectedDeposit.user?.email || `User #${selectedDeposit.user_id}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount</span>
                <span className="font-semibold text-slate-900">
                  {selectedDeposit.amount} USDT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Network</span>
                <span className="font-medium text-slate-900">
                  {getChainLabel(selectedDeposit.chain) || selectedDeposit.chain}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-500">Source wallet</span>
                <span className="font-mono text-[11px] text-slate-800 truncate max-w-[200px] text-right">
                  {selectedDeposit.source_wallet_address || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-500">Dest wallet</span>
                <span className="font-mono text-[11px] text-slate-800 truncate max-w-[200px] text-right">
                  {selectedDeposit.dest_wallet_address || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono text-[11px] text-slate-800 truncate max-w-[200px]">
                  {selectedDeposit.tx_id || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className={`font-medium ${
                  selectedDeposit.status === 'APPROVED' || selectedDeposit.status === 'COMPLETED'
                    ? 'text-emerald-600'
                    : selectedDeposit.status === 'REJECTED' || selectedDeposit.status === 'FAILED'
                    ? 'text-red-600'
                    : 'text-amber-600'
                }`}>
                  {selectedDeposit.status}
                </span>
              </div>
              {selectedDeposit.reason && (
                <div className="flex justify-between items-start">
                  <span className="text-slate-500">Reason</span>
                  <span className="font-medium text-slate-900 text-right max-w-[200px]">
                    {selectedDeposit.reason}
                  </span>
                </div>
              )}

              {/* Transaction ID input for approval */}
              {selectedDeposit.status === 'PENDING' && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Transaction ID (required for approval)
                  </label>
                  <input
                    type="text"
                    value={approvalTxId}
                    onChange={(e) => setApprovalTxId(e.target.value)}
                    placeholder="0x1234567890abcdef..."
                    disabled={actionLoading}
                    className="w-full rounded-lg border text-black border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 disabled:opacity-50"
                  />
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-200 flex justify-end gap-2 bg-slate-50/60">
              <button
                type="button"
                onClick={handleDeclineDeposit}
                disabled={selectedDeposit.status !== 'PENDING' || actionLoading}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
              >
                {actionLoading === 'reject' && <Loader2 className="w-4 h-4 animate-spin" />}
                Reject
              </button>
              <button
                type="button"
                onClick={handleApproveDeposit}
                disabled={selectedDeposit.status !== 'PENDING' || !approvalTxId.trim() || actionLoading}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 inline-flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'approve' && <Loader2 className="w-4 h-4 animate-spin" />}
                <Check className="w-4 h-4" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add wallet address modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                Add wallet address
              </h3>
              <button
                type="button"
                onClick={closeAddressModal}
                disabled={actionLoading === 'add'}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="px-4 py-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Blockchain Network
                </label>
                <select
                  value={newAddress.chain}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      chain: e.target.value,
                    }))
                  }
                  disabled={actionLoading === 'add'}
                  className="w-full rounded-lg border text-black border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 bg-white disabled:opacity-50"
                >
                  {CHAIN_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Wallet address
                </label>
                <textarea
                  rows={3}
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Paste your wallet address here"
                  disabled={actionLoading === 'add'}
                  className="w-full rounded-lg border text-black border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 resize-none disabled:opacity-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  disabled={actionLoading === 'add'}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'add' || !newAddress.address}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {actionLoading === 'add' && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Save address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="px-4 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Delete wallet
                  </h3>
                  <p className="text-sm text-slate-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Are you sure you want to delete this wallet address? Users will no longer be able to send funds to this address.
              </p>
            </div>
            <div className="px-4 py-3 border-t border-slate-200 flex justify-end gap-2 bg-slate-50/60">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                disabled={actionLoading === showDeleteConfirm}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteWallet(showDeleteConfirm)}
                disabled={actionLoading === showDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700 inline-flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === showDeleteConfirm && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCryptoWalletPage;


