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
  const [activeDepositTab, setActiveDepositTab] = useState('naira'); // naira | crypto
  const [cryptoStatusFilter, setCryptoStatusFilter] = useState('all'); // all | pending | successful | failed
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

  // Placeholder Naira & Crypto deposits – replace with real hook/API when available
  const nairaDeposits = [
    {
      id: 101,
      user: 'User 1',
      amount: 50000,
      status: 'successful',
      created_at: new Date().toISOString(),
      reference: 'BANK-REF-001',
      channel: 'Bank transfer',
    },
  ];

  const [cryptoDeposits, setCryptoDeposits] = useState([
    {
      id: 201,
      user: 'User 2',
      amount: 100,
      status: 'pending', // pending | successful | failed
      created_at: new Date().toISOString(),
      txHash: '0x1234...abcd',
      network: 'TRON (USDT)',
    },
    {
      id: 202,
      user: 'User 3',
      amount: 50,
      status: 'successful',
      created_at: new Date().toISOString(),
      txHash: '0x5678...efgh',
      network: 'TRON (USDT)',
    },
  ]);

  // Flatten all movements into a single transaction list (withdrawals, transfers, deposits summary)
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

    // Aggregate deposits for the generic transactions list if needed
    const depositTx = [
      ...nairaDeposits.map((d) => ({
        id: d.id,
        type: 'deposit',
        amount: d.amount || 0,
        status: d.status || 'pending',
        created_at: d.created_at,
        primary: d.user || 'Naira deposit',
        secondary: `${d.channel || 'Naira'} · ${d.reference || ''}`,
        raw: d,
      })),
      ...cryptoDeposits.map((d) => ({
        id: d.id,
        type: 'deposit',
        amount: d.amount || 0,
        status: d.status || 'pending',
        created_at: d.created_at,
        primary: d.user || 'Crypto deposit',
        secondary: `${d.network || 'USDT'} · ${d.txHash || ''}`,
        raw: d,
      })),
    ];

    return [...withdrawalTx, ...transferTx, ...depositTx];
  }, [withdrawals, transfers, nairaDeposits, cryptoDeposits]);

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

    // For crypto deposits, allow changing status from pending to successful
    if (
      selectedTransaction.type === 'deposit' &&
      selectedTransaction.raw?.network &&
      selectedTransaction.status === 'pending'
    ) {
      // TODO: Replace with real API call to update crypto deposit status
      setCryptoDeposits((prev) =>
        prev.map((d) =>
          d.id === selectedTransaction.raw.id
            ? { ...d, status: 'successful' }
            : d,
        ),
      );
    }

    console.log('Approve', selectedTransaction.type, selectedTransaction.raw);
    closeModal();
  };

  const handleDecline = () => {
    if (!selectedTransaction) return;

    // For crypto deposits, allow changing status from pending to failed
    if (
      selectedTransaction.type === 'deposit' &&
      selectedTransaction.raw?.network &&
      selectedTransaction.status === 'pending'
    ) {
      // TODO: Replace with real API call to update crypto deposit status
      setCryptoDeposits((prev) =>
        prev.map((d) =>
          d.id === selectedTransaction.raw.id ? { ...d, status: 'failed' } : d,
        ),
      );
    }

    console.log('Decline', selectedTransaction.type, selectedTransaction.raw);
    closeModal();
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total balance */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                        Total balance (all users)
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">
                        ₦{totalBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pending withdrawals */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <ArrowDownRight className="w-5 h-5 text-amber-500" />
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
                </div>

                {/* Pending transfers */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
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
                </div>
              </div>
            </div>

            {/* Deposits section */}
            <div className="px-4 lg:px-8 mb-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header + tabs */}
                <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Deposits
                    </h2>
                    <p className="text-xs text-slate-500">
                      Naira and Crypto/USDT top-ups across all users.
                    </p>
                  </div>
                  <div className="inline-flex rounded-full bg-slate-100 p-1 text-[11px] font-medium text-slate-600">
                    <button
                      type="button"
                      onClick={() => setActiveDepositTab('naira')}
                      className={`px-3 py-1 rounded-full ${
                        activeDepositTab === 'naira'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      Naira
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDepositTab('crypto')}
                      className={`px-3 py-1 rounded-full ${
                        activeDepositTab === 'crypto'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      Crypto / USDT
                    </button>
                  </div>
                </div>

                {/* Crypto status filter */}
                {activeDepositTab === 'crypto' && (
                  <div className="px-4 py-2 border-b border-slate-100 flex flex-wrap gap-2 text-[11px]">
                    <span className="text-slate-500 font-medium mr-1">
                      Status:
                    </span>
                    {['all', 'pending', 'successful', 'failed'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCryptoStatusFilter(s)}
                        className={`px-2.5 py-1 rounded-full border text-xs ${
                          cryptoStatusFilter === s
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {s === 'all'
                          ? 'All'
                          : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Deposits table header (desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-4">User</div>
                  <div className="col-span-3">Details</div>
                  <div className="col-span-2">
                    {activeDepositTab === 'naira' ? 'Channel' : 'Network'}
                  </div>
                  <div className="col-span-2 text-right">
                    {activeDepositTab === 'naira' ? 'Amount (₦)' : 'Amount (USDT)'}
                  </div>
                  <div className="col-span-1 text-right">Status</div>
                </div>

                {/* Deposits table body */}
                <div className="divide-y divide-slate-100">
                  {activeDepositTab === 'naira' &&
                    (nairaDeposits.length > 0 ? (
                      nairaDeposits.map((d) => {
                        const dateLabel = d.created_at
                          ? new Date(d.created_at).toLocaleString('en-NG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'N/A';

                        return (
                          <div
                            key={d.id}
                            className="px-4 md:px-6 py-3 hover:bg-slate-50/80 transition-colors"
                          >
                            <div className="md:grid md:grid-cols-12 md:items-center gap-4">
                              {/* User */}
                              <div className="md:col-span-4">
                                <p className="text-sm font-medium text-slate-900">
                                  {d.user}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500 md:hidden">
                                  ₦{(d.amount || 0).toLocaleString()} •{' '}
                                  {d.channel || 'Naira'}
                                </p>
                              </div>

                              {/* Details */}
                              <div className="md:col-span-3 mt-1 md:mt-0">
                                <p className="text-xs text-slate-500">
                                  Ref: {d.reference || 'N/A'}
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-400">
                                  {dateLabel}
                                </p>
                              </div>

                              {/* Channel */}
                              <div className="md:col-span-2 mt-2 md:mt-0 text-xs text-slate-600">
                                {d.channel || 'Bank transfer'}
                              </div>

                              {/* Amount */}
                              <div className="md:col-span-2 mt-2 md:mt-0 text-right">
                                <p className="text-sm font-semibold text-slate-900">
                                  ₦{(d.amount || 0).toLocaleString()}
                                </p>
                              </div>

                              {/* Status */}
                              <div className="md:col-span-1 mt-2 md:mt-0 text-right">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                    d.status === 'successful'
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : d.status === 'failed'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-amber-100 text-amber-700'
                                  }`}
                                >
                                  {d.status || 'pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-6 text-sm text-slate-500">
                        No Naira deposits found.
                      </div>
                    ))}

                  {activeDepositTab === 'crypto' &&
                    (cryptoDeposits.filter((d) =>
                      cryptoStatusFilter === 'all'
                        ? true
                        : d.status === cryptoStatusFilter,
                    ).length > 0 ? (
                      cryptoDeposits
                        .filter((d) =>
                          cryptoStatusFilter === 'all'
                            ? true
                            : d.status === cryptoStatusFilter,
                        )
                        .map((d) => {
                          const dateLabel = d.created_at
                            ? new Date(d.created_at).toLocaleString('en-NG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A';

                          return (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() =>
                                openModal({
                                  id: d.id,
                                  type: 'deposit',
                                  amount: d.amount,
                                  status: d.status,
                                  created_at: d.created_at,
                                  primary: d.user,
                                  secondary: `${d.network || 'USDT'} · ${
                                    d.txHash || ''
                                  }`,
                                  raw: d,
                                })
                              }
                            className="w-full text-left px-4 md:px-6 py-3 hover:bg-slate-50/80 transition-colors"
                            >
                              <div className="md:grid md:grid-cols-12 md:items-center gap-4">
                                {/* User */}
                                <div className="md:col-span-4">
                                  <p className="text-sm font-medium text-slate-900">
                                    {d.user}
                                  </p>
                                  <p className="mt-0.5 text-xs text-slate-500 md:hidden">
                                    {d.amount || 0} USDT •{' '}
                                    {d.network || 'USDT'}
                                  </p>
                                </div>

                                {/* Details */}
                                <div className="md:col-span-3 mt-1 md:mt-0">
                                  <p className="text-xs text-slate-500 truncate">
                                    Tx: {d.txHash || 'N/A'}
                                  </p>
                                  <p className="mt-0.5 text-[11px] text-slate-400">
                                    {dateLabel}
                                  </p>
                                </div>

                                {/* Network */}
                                <div className="md:col-span-2 mt-2 md:mt-0 text-xs text-slate-600">
                                  {d.network || 'TRON (USDT)'}
                                </div>

                                {/* Amount */}
                                <div className="md:col-span-2 mt-2 md:mt-0 text-right">
                                  <p className="text-sm font-semibold text-slate-900">
                                    {d.amount || 0} USDT
                                  </p>
                                </div>

                                {/* Status */}
                                <div className="md:col-span-1 mt-2 md:mt-0 text-right">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                      d.status === 'successful'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : d.status === 'failed'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}
                                  >
                                    {d.status || 'pending'}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })
                    ) : (
                      <div className="px-4 py-6 text-sm text-slate-500">
                        No crypto deposits found for this status.
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Transactions list - professional table-style layout */}
            <div className="flex-1 overflow-auto px-4 lg:px-8 pb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header + filters */}
                <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Transactions
                    </h2>
                    <p className="text-xs text-slate-500">
                      All wallet movements – deposits, withdrawals and transfers.
                    </p>
                  </div>
                  <div className="inline-flex rounded-full bg-slate-100 p-1 text-[11px] font-medium text-slate-600">
                    <button
                      type="button"
                      onClick={() => setFilterType('all')}
                      className={`px-3 py-1 rounded-full ${
                        filterType === 'all'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('deposit')}
                      className={`px-3 py-1 rounded-full ${
                        filterType === 'deposit'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      Deposits
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('withdrawal')}
                      className={`px-3 py-1 rounded-full ${
                        filterType === 'withdrawal'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      Withdrawals
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('transfer')}
                      className={`px-3 py-1 rounded-full ${
                        filterType === 'transfer'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      Transfers
                    </button>
                  </div>
                </div>

                {/* Table header (desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-4">Account / User</div>
                  <div className="col-span-3">Details</div>
                  <div className="col-span-2">Type & Status</div>
                  <div className="col-span-2 text-right">Amount</div>
                  <div className="col-span-1 text-right">ID</div>
                </div>

                {/* Table body */}
                <div className="divide-y divide-slate-100">
                  {isLoading && (
                    <div className="px-4 py-6 text-sm text-slate-500">
                      Loading transactions...
                    </div>
                  )}

                  {!isLoading &&
                    filteredTransactions.map((tx) => {
                      const dateLabel = tx.created_at
                        ? new Date(tx.created_at).toLocaleDateString('en-NG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A';

                      const typeLabel =
                        tx.type === 'withdrawal'
                          ? 'Withdrawal'
                          : tx.type === 'transfer'
                          ? 'Transfer'
                          : 'Deposit';

                      const statusBadgeClasses =
                        tx.status === 'pending'
                              ? 'bg-amber-50 text-amber-700'
                          : tx.status === 'approved' || tx.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-700';

                      return (
                        <button
                          key={`${tx.type}-${tx.id}`}
                          type="button"
                          onClick={() => openModal(tx)}
                          className="w-full text-left px-4 md:px-6 py-3 hover:bg-slate-50/80 transition-colors"
                        >
                          <div className="md:grid md:grid-cols-12 md:items-center gap-4">
                            {/* Account / User */}
                            <div className="md:col-span-4">
                              <p className="text-sm font-medium text-slate-900">
                                {tx.primary}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500 md:hidden">
                                ₦{tx.amount.toLocaleString()} • {typeLabel}
                              </p>
                            </div>

                            {/* Details */}
                            <div className="md:col-span-3 mt-1 md:mt-0">
                              <p className="text-xs text-slate-500">
                                {tx.secondary}
                              </p>
                              <p className="mt-0.5 text-[11px] text-slate-400">
                                {dateLabel}
                              </p>
                            </div>

                            {/* Type & status */}
                            <div className="md:col-span-2 mt-2 md:mt-0 flex items-center gap-2 text-xs text-slate-600">
                              <span className="capitalize">{typeLabel}</span>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadgeClasses}`}
                              >
                                {tx.status || 'pending'}
                              </span>
                            </div>

                            {/* Amount */}
                            <div className="md:col-span-2 mt-2 md:mt-0 text-right">
                              <p className="text-sm font-semibold text-slate-900">
                                ₦{tx.amount.toLocaleString()}
                              </p>
                            </div>

                            {/* ID */}
                            <div className="md:col-span-1 mt-2 md:mt-0 text-right text-xs text-slate-500">
                              #{tx.id}
                            </div>
                          </div>
                        </button>
                      );
                    })}

                  {!isLoading && filteredTransactions.length === 0 && (
                    <div className="px-4 py-6 text-sm text-slate-500">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  {selectedTransaction.type === 'transfer'
                    ? 'Transfer request'
                    : selectedTransaction.type === 'withdrawal'
                    ? 'Withdrawal request'
                    : 'Deposit'}
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  ID #{selectedTransaction.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-4 space-y-3 text-sm">
              {selectedTransaction.type === 'transfer' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">User</span>
                    <span className="font-medium text-slate-900">
                      {selectedTransaction.raw.user}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">To</span>
                    <span className="font-medium text-slate-900">
                      {selectedTransaction.raw.to}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount</span>
                    <span className="font-semibold text-slate-900">
                      ₦{selectedTransaction.amount.toLocaleString()}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account name</span>
                    <span className="font-medium text-slate-900">
                      {selectedTransaction.raw.account_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank</span>
                    <span className="font-medium text-slate-900">
                      {selectedTransaction.raw.bank_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account number</span>
                    <span className="font-medium text-slate-900">
                      {selectedTransaction.raw.account_number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount</span>
                    <span className="font-semibold text-slate-900">
                      ₦{(selectedTransaction.amount || 0).toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-200 flex justify-end gap-2 bg-slate-50/60">
              <button
                type="button"
                onClick={handleDecline}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-white"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 inline-flex items-center gap-1 shadow-sm"
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



