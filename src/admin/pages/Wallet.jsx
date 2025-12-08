import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
  Search,
  X,
  Loader2,
  History,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useWithdrawals } from '../hooks/useWithdrawals';
import { useDeposits } from '../hooks/useDeposits';
import { useTransactionHistory } from '../hooks/useTransactionHistory';

const AdminWalletPage = () => {
  const navigate = useNavigate();
  const { withdrawals } = useWithdrawals();
  
  // Deposits hook integration (for pending count)
  const {
    deposits: cryptoDeposits,
    fetchDeposits,
  } = useDeposits();

  // Transaction history hook integration
  const {
    transactions: transactionHistory,
    summary: transactionSummary,
    isLoading: historyLoading,
    error: historyError,
    pagination: historyPagination,
    fetchTransactionHistory,
    resetError: resetHistoryError,
  } = useTransactionHistory();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Transaction history filters
  const [historyTypeFilter, setHistoryTypeFilter] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('');
  const [historyCurrencyFilter, setHistoryCurrencyFilter] = useState('');
  const [historyOffset, setHistoryOffset] = useState(0);
  const [showHistoryFilters, setShowHistoryFilters] = useState(false);

  // Placeholder transfers – replace with real hook/API when available
  const transfers = [
    {
      id: 1,
      user: 'User 24',
      amount: 15000,
      status: 'pending',
      created_at: new Date().toISOString(),
      from: 'Wallet',
      to: 'User 42',
    },
    {
      id: 2,
      user: 'User 18',
      amount: 8200,
      status: 'pending',
      created_at: new Date().toISOString(),
      from: 'Wallet',
      to: 'User 30',
    },
  ];

  const totalPendingWithdrawals = useMemo(
    () =>
      Array.isArray(withdrawals)
        ? withdrawals.filter((w) => w.status === 'pending').length
        : 0,
    [withdrawals],
  );

  const totalPendingTransfers = useMemo(
    () => transfers.filter((t) => t.status === 'pending').length,
    [transfers],
  );

  const totalPendingDeposits = useMemo(
    () =>
      Array.isArray(cryptoDeposits)
        ? cryptoDeposits.filter((d) => d.status === 'PENDING' || d.status === 'pending').length
        : 0,
    [cryptoDeposits],
  );

  const totalBalance = 0; // UI-only placeholder for now

  // Handler for clicking on stat cards to filter transaction history
  const handleStatCardClick = (type, status) => {
    setHistoryTypeFilter(type);
    setHistoryStatusFilter(status);
    setHistoryOffset(0);
    setShowHistoryFilters(true);
  };

  // Fetch deposits on component mount for pending count
  useEffect(() => {
    fetchDeposits({});
  }, []);

  // Fetch transaction history on mount and when filters change
  useEffect(() => {
    const filters = {
      limit: 50,
      offset: historyOffset,
    };
    if (historyTypeFilter) filters.type = historyTypeFilter;
    if (historyStatusFilter) filters.status = historyStatusFilter;
    if (historyCurrencyFilter) filters.currency = historyCurrencyFilter;
    
    fetchTransactionHistory(filters);
  }, [historyTypeFilter, historyStatusFilter, historyCurrencyFilter, historyOffset]);

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

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar
        currentPage="wallet"
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
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                <Wallet size={22} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Wallet overview</h1>
                <p className="text-xs text-slate-500">
                  Monitor deposits, withdrawals and transfers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="pb-8">
            {/* Desktop header */}
            <div className="hidden lg:block mb-6 px-8 pt-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold text-slate-900 flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Wallet className="w-5 h-5" />
                    </span>
                    Wallet
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    High-level view of user funds, withdrawals and internal movements.
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
                    placeholder="Search by user, bank, reference or ID"
                    className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="px-4 lg:px-8 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Total transactions */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <History className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                        Total transactions
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">
                        {transactionSummary?.total_transactions || '0'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Successful amount */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                        Successful amount
                      </p>
                      <p className="mt-1 text-xl font-semibold text-slate-900">
                        {transactionSummary?.total_successful_amount?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pending deposits */}
                <button
                  type="button"
                  onClick={() => handleStatCardClick('deposit', 'pending')}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-left hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <ArrowDownRight className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                        Pending deposits
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">
                        {totalPendingDeposits}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Pending withdrawals */}
                <button
                  type="button"
                  onClick={() => handleStatCardClick('withdrawal', 'pending')}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-left hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                        Pending withdrawals
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">
                        {totalPendingWithdrawals}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Pending transfers */}
                <button
                  type="button"
                  onClick={() => handleStatCardClick('transfer', 'pending')}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-left hover:border-sky-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                      <ArrowLeftRight className="w-5 h-5 text-sky-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                        Pending transfers
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">
                        {totalPendingTransfers}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Transaction History Section */}
            <div className="px-4 lg:px-8 mb-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <History className="w-5 h-5 text-indigo-600" />
                    </div>
                  <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Transaction History
                    </h2>
                    <p className="text-xs text-slate-500">
                        Complete history of all user transactions ({historyPagination.total} total)
                    </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowHistoryFilters(!showHistoryFilters)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                        showHistoryFilters
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                    <button
                      type="button"
                      onClick={() => fetchTransactionHistory({ limit: 50, offset: historyOffset })}
                      disabled={historyLoading}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${historyLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                {showHistoryFilters && (
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-end gap-4">
                    <div className="min-w-[140px]">
                      <label className="text-xs font-medium text-slate-600 block mb-1.5">Type</label>
                      <select
                        value={historyTypeFilter}
                        onChange={(e) => { setHistoryTypeFilter(e.target.value); setHistoryOffset(0); }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                      >
                        <option value="">All Types</option>
                        <option value="bank_deposit">Bank Deposit</option>
                        <option value="usdt_deposit">USDT Deposit</option>
                        <option value="deposit">Deposit</option>
                        <option value="withdrawal">Withdrawal</option>
                        <option value="subscription">Subscription</option>
                        <option value="transfer">Transfer</option>
                      </select>
                  </div>
                    <div className="min-w-[140px]">
                      <label className="text-xs font-medium text-slate-600 block mb-1.5">Status</label>
                      <select
                        value={historyStatusFilter}
                        onChange={(e) => { setHistoryStatusFilter(e.target.value); setHistoryOffset(0); }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                      >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="successful">Successful</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                      </select>
                              </div>
                    <div className="min-w-[140px]">
                      <label className="text-xs font-medium text-slate-600 block mb-1.5">Currency</label>
                      <select
                        value={historyCurrencyFilter}
                        onChange={(e) => { setHistoryCurrencyFilter(e.target.value); setHistoryOffset(0); }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                      >
                        <option value="">All Currencies</option>
                        <option value="NGN">NGN</option>
                        <option value="USDT">USDT</option>
                      </select>
                  </div>
                    <button
                      type="button"
                      onClick={() => {
                        setHistoryTypeFilter('');
                        setHistoryStatusFilter('');
                        setHistoryCurrencyFilter('');
                        setHistoryOffset(0);
                      }}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-white transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                )}

                {/* Error message */}
                {historyError && (
                  <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    {historyError}
                    <button onClick={resetHistoryError} className="ml-auto text-red-600 hover:text-red-800">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Table header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-3">User</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-1 text-right">ID</div>
                </div>

                {/* Table body */}
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                  {historyLoading ? (
                    <div className="px-4 py-8 flex items-center justify-center gap-2 text-sm text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading transaction history...
                    </div>
                  ) : transactionHistory.length > 0 ? (
                    transactionHistory.map((tx) => {
                      const dateLabel = tx.created_at
                        ? new Date(tx.created_at).toLocaleString('en-NG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'N/A';

                      const statusClass =
                        tx.status === 'successful' || tx.status === 'success'
                          ? 'bg-emerald-100 text-emerald-700'
                          : tx.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700';

                      const typeLabel = tx.type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';

                      return (
                        <div
                          key={tx.id}
                          className="px-4 md:px-6 py-3 hover:bg-slate-50/80 transition-colors"
                        >
                          <div className="md:grid md:grid-cols-12 md:items-center gap-4">
                            {/* User */}
                            <div className="md:col-span-3">
                              <p className="text-sm font-medium text-slate-900">
                                {tx.user?.name || `User #${tx.user_id}`}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500 md:hidden">
                                {tx.amount} {tx.currency} • {typeLabel}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {tx.user?.email || ''}
                              </p>
                            </div>

                            {/* Type */}
                            <div className="md:col-span-2 mt-1 md:mt-0">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700">
                                {typeLabel}
                              </span>
                            </div>

                            {/* Amount */}
                            <div className="md:col-span-2 mt-2 md:mt-0">
                              <p className="text-sm font-semibold text-slate-900">
                                {tx.currency === 'NGN' ? '₦' : '$'}{Number(tx.amount).toLocaleString()}
                              </p>
                              <p className="text-xs text-slate-400">{tx.currency}</p>
                            </div>

                            {/* Status */}
                            <div className="md:col-span-2 mt-2 md:mt-0">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusClass}`}
                              >
                                {tx.status}
                              </span>
                            </div>

                            {/* Date */}
                            <div className="md:col-span-2 mt-2 md:mt-0 text-xs text-slate-500">
                              {dateLabel}
                            </div>

                            {/* Reference */}
                            <div className="md:col-span-1 mt-2 md:mt-0 text-right text-xs text-slate-500">
                              #{tx.id}
                            </div>
                          </div>
                          {tx.notes && (
                            <p className="mt-1 text-xs text-slate-400 italic truncate">
                              {tx.notes}
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      No transactions found.
                    </div>
                  )}
      </div>

                {/* Pagination */}
                {historyPagination.total > 0 && (
                  <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm">
                    <p className="text-slate-500">
                      Showing {historyOffset + 1} - {Math.min(historyOffset + historyPagination.limit, historyPagination.total)} of {historyPagination.total}
                </p>
                    <div className="flex items-center gap-2">
              <button
                type="button"
                        onClick={() => setHistoryOffset(Math.max(0, historyOffset - historyPagination.limit))}
                        disabled={historyOffset === 0 || historyLoading}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                        <ChevronLeft className="w-4 h-4" />
              </button>
                      <span className="text-slate-600 text-xs">
                        Page {Math.floor(historyOffset / historyPagination.limit) + 1} of {historyPagination.pages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setHistoryOffset(historyOffset + historyPagination.limit)}
                        disabled={historyOffset + historyPagination.limit >= historyPagination.total || historyLoading}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWalletPage;
