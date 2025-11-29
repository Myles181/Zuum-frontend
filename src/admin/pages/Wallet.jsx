import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
  Search,
  X,
  Check,
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useWithdrawals } from '../hooks/useWithdrawals';

const AdminWalletPage = () => {
  const navigate = useNavigate();
  const { withdrawals, isLoading, error } = useWithdrawals();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all | deposit | withdrawal | transfer
  const [selectedTransaction, setSelectedTransaction] = useState(null);

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

  const totalBalance = 0; // UI-only placeholder for now

  // Flatten all movements into a single transaction list
  const allTransactions = useMemo(() => {
    const withdrawalTx = Array.isArray(withdrawals)
      ? withdrawals.map((w) => ({
          id: w.id,
          type: 'withdrawal',
          amount: w.amount || 0,
          status: w.status || 'pending',
          created_at: w.created_at,
          primary: w.account_name || 'Withdrawal',
          secondary: `${w.bank_name || 'Bank'} · ${w.account_number || ''}`,
          raw: w,
        }))
      : [];

    const transferTx = transfers.map((t) => ({
      id: t.id,
      type: 'transfer',
      amount: t.amount || 0,
      status: t.status || 'pending',
      created_at: t.created_at,
      primary: t.user || 'Transfer',
      secondary: `To: ${t.to}`,
      raw: t,
    }));

    // Placeholder: deposits could be added here when the API is available
    const depositTx = [];

    return [...withdrawalTx, ...transferTx, ...depositTx];
  }, [withdrawals, transfers]);

  const filteredTransactions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allTransactions.filter((tx) => {
      const matchesType =
        filterType === 'all' ? true : tx.type === filterType;

      const s = term;
      const matchesSearch =
        !s ||
        tx.primary.toLowerCase().includes(s) ||
        tx.secondary.toLowerCase().includes(s) ||
        String(tx.id).includes(s) ||
        String(tx.amount).includes(s);

      return matchesType && matchesSearch;
    });
  }, [allTransactions, filterType, searchTerm]);

  const openModal = (tx) => {
    setSelectedTransaction(tx);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
  };

  const handleApprove = () => {
    if (!selectedTransaction) return;
    console.log('Approve', selectedTransaction.type, selectedTransaction.raw);
    closeModal();
  };

  const handleDecline = () => {
    if (!selectedTransaction) return;
    console.log('Decline', selectedTransaction.type, selectedTransaction.raw);
    closeModal();
  };

  const adminRoutes = {
    users: '/users',
    distribution: '/addistributions',
    beat: '/adbeat',
    promotion: '/adpromotion',
    wallet: '/admin-wallet',
  };

  const handlePageChange = (pageId) => {
    const targetRoute = adminRoutes[pageId];
    if (targetRoute) {
      navigate(targetRoute);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        currentPage="wallet"
        onPageChange={handlePageChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                <Wallet size={22} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Wallet</h1>
                <p className="text-sm text-gray-500">
                  Overview of balances & cash movements
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Desktop header */}
            <div className="hidden lg:block mb-6 px-6 pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Wallet className="w-7 h-7 text-[#2D8C72]" />
                    Wallet
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Monitor balances, withdrawals and transfer requests.
                  </p>
                </div>

                <div className="relative w-full md:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by user, bank or ID"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                  />
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="px-4 lg:px-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Total Balance
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        ₦{totalBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                      <ArrowDownRight className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Pending withdrawals
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {totalPendingWithdrawals}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center">
                      <ArrowLeftRight className="w-5 h-5 text-sky-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Pending transfers
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {totalPendingTransfers}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions list */}
            <div className="flex-1 overflow-auto px-4 lg:px-6 pb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      Transactions
                    </h2>
                    <p className="text-xs text-gray-500">
                      Deposits, withdrawals and transfer requests
                    </p>
                  </div>
                  <div className="inline-flex rounded-full bg-gray-100 p-1 text-xs font-medium text-gray-600">
                    <button
                      type="button"
                      onClick={() => setFilterType('all')}
                      className={`px-3 py-1 rounded-full ${
                        filterType === 'all'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('deposit')}
                      className={`px-3 py-1 rounded-full ${
                        filterType === 'deposit'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      Deposits
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('withdrawal')}
                      className={`px-3 py-1 rounded-full ${
                        filterType === 'withdrawal'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      Withdrawals
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('transfer')}
                      className={`px-3 py-1 rounded-full ${
                        filterType === 'transfer'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      Transfers
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {isLoading && (
                    <div className="px-4 py-6 text-sm text-gray-500">
                      Loading transactions...
                    </div>
                  )}

                  {!isLoading &&
                    filteredTransactions.map((tx) => (
                      <button
                        key={`${tx.type}-${tx.id}`}
                        type="button"
                        onClick={() => openModal(tx)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {tx.primary}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tx.secondary} · #{tx.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ₦{tx.amount.toLocaleString()}
                          </p>
                          <p className="text-xs font-medium text-gray-500 capitalize">
                            {tx.type}
                          </p>
                        </div>
                      </button>
                    ))}

                  {!isLoading && filteredTransactions.length === 0 && (
                    <div className="px-4 py-6 text-sm text-gray-500">
                      No transactions found.
                    </div>
                  )}

                  {error && (
                    <div className="px-4 py-3 text-xs text-red-600 bg-red-50 border-t border-red-100">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {selectedTransaction.type === 'transfer'
                    ? 'Transfer request'
                    : selectedTransaction.type === 'withdrawal'
                    ? 'Withdrawal request'
                    : 'Deposit'}
                </p>
                <h3 className="text-lg font-semibold text-gray-900">
                  ID #{selectedTransaction.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-4 space-y-3 text-sm">
              {selectedTransaction.type === 'transfer' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">User</span>
                    <span className="font-medium text-gray-900">
                      {selectedTransaction.raw.user}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">To</span>
                    <span className="font-medium text-gray-900">
                      {selectedTransaction.raw.to}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-semibold text-gray-900">
                      ₦{selectedTransaction.amount.toLocaleString()}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account name</span>
                    <span className="font-medium text-gray-900">
                      {selectedTransaction.raw.account_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank</span>
                    <span className="font-medium text-gray-900">
                      {selectedTransaction.raw.bank_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account number</span>
                    <span className="font-medium text-gray-900">
                      {selectedTransaction.raw.account_number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-semibold text-gray-900">
                      ₦{(selectedTransaction.amount || 0).toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleDecline}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-4 py-2 rounded-lg bg-[#2d7a63] text-sm font-semibold text-white hover:bg-[#245a4f] inline-flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Credit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWalletPage;



