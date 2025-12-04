import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Search, Plus, X, Check } from 'lucide-react';
import AdminSidebar from '../components/Sidebar';

// NOTE: Replace placeholder data with real hooks/API when backend is ready
const initialCryptoDeposits = [
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
];

const initialWalletAddresses = [
  {
    id: 1,
    label: 'Primary USDT TRC20',
    address: 'TAbc1234...xyz',
    network: 'TRON (USDT)',
    active: true,
    created_at: new Date().toISOString(),
  },
];

const AdminCryptoWalletPage = () => {
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptoStatusFilter, setCryptoStatusFilter] = useState('all'); // all | pending | successful | failed
  const [cryptoDeposits, setCryptoDeposits] = useState(initialCryptoDeposits);
  const [walletAddresses, setWalletAddresses] = useState(initialWalletAddresses);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    network: 'TRON (USDT)',
  });
  const [selectedDeposit, setSelectedDeposit] = useState(null);

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

  const filteredDeposits = cryptoDeposits.filter((d) => {
    const statusMatch =
      cryptoStatusFilter === 'all' ? true : d.status === cryptoStatusFilter;
    const term = searchTerm.toLowerCase();
    const searchMatch =
      !term ||
      d.user.toLowerCase().includes(term) ||
      (d.txHash || '').toLowerCase().includes(term) ||
      String(d.id).includes(term);
    return statusMatch && searchMatch;
  });

  const openDepositModal = (deposit) => {
    setSelectedDeposit(deposit);
  };

  const closeDepositModal = () => {
    setSelectedDeposit(null);
  };

  const handleApproveDeposit = () => {
    if (!selectedDeposit || selectedDeposit.status !== 'pending') return;
    // TODO: Replace with real API call to mark crypto deposit as successful
    setCryptoDeposits((prev) =>
      prev.map((d) =>
        d.id === selectedDeposit.id ? { ...d, status: 'successful' } : d,
      ),
    );
    closeDepositModal();
  };

  const handleDeclineDeposit = () => {
    if (!selectedDeposit || selectedDeposit.status !== 'pending') return;
    // TODO: Replace with real API call to mark crypto deposit as failed
    setCryptoDeposits((prev) =>
      prev.map((d) =>
        d.id === selectedDeposit.id ? { ...d, status: 'failed' } : d,
      ),
    );
    closeDepositModal();
  };

  const openAddressModal = () => {
    setNewAddress({
      label: '',
      address: '',
      network: 'TRON (USDT)',
    });
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.address) return;

    // TODO: Replace with real API call to save wallet address
    setWalletAddresses((prev) => [
      {
        id: prev.length + 1,
        ...newAddress,
        active: true,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    setShowAddressModal(false);
  };

  const toggleAddressActive = (id) => {
    // TODO: Replace with real API call to toggle active flag
    setWalletAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id ? { ...addr, active: !addr.active } : addr,
      ),
    );
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
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 hover:bg-emerald-700 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add address
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {walletAddresses.length === 0 && (
                    <div className="px-4 py-6 text-sm text-slate-500">
                      No wallet addresses configured yet.
                    </div>
                  )}

                  {walletAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {addr.label}
                        </p>
                        <p className="text-xs font-mono text-slate-600 break-all">
                          {addr.address}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {addr.network} •{' '}
                          {new Date(
                            addr.created_at,
                          ).toLocaleDateString('en-NG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            addr.active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {addr.active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleAddressActive(addr.id)}
                          className="text-xs font-medium text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1 hover:bg-slate-50"
                        >
                          {addr.active ? 'Disable' : 'Enable'}
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
                  <div className="inline-flex rounded-full bg-slate-100 p-1 text-[11px] font-medium text-slate-600">
                    {['all', 'pending', 'successful', 'failed'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCryptoStatusFilter(s)}
                        className={`px-3 py-1 rounded-full ${
                          cryptoStatusFilter === s
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600'
                        }`}
                      >
                        {s === 'all'
                          ? 'All'
                          : s.charAt(0).toUpperCase() + s.slice(1)}
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
                  {filteredDeposits.length === 0 && (
                    <div className="px-4 py-6 text-sm text-slate-500">
                      No crypto deposits found for this filter.
                    </div>
                  )}

                  {filteredDeposits.map((d) => {
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
                      d.status === 'successful'
                        ? 'bg-emerald-50 text-emerald-700'
                        : d.status === 'failed'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700';

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
                              {d.user}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 md:hidden">
                              {d.amount || 0} USDT •{' '}
                              {d.network || 'TRON (USDT)'}
                            </p>
                          </div>

                          {/* Transaction */}
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
                          <div className="md:col-span-2 mt-2 md:mt-0 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusClasses}`}
                            >
                              {d.status || 'pending'}
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
                onClick={closeDepositModal}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">User</span>
                <span className="font-medium text-slate-900">
                  {selectedDeposit.user}
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
                  {selectedDeposit.network || 'TRON (USDT)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction hash</span>
                <span className="font-mono text-[11px] text-slate-800 truncate max-w-[200px]">
                  {selectedDeposit.txHash || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-medium text-slate-900">
                  {selectedDeposit.status}
                </span>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-slate-200 flex justify-end gap-2 bg-slate-50/60">
              <button
                type="button"
                onClick={handleDeclineDeposit}
                disabled={selectedDeposit.status !== 'pending'}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as failed
              </button>
              <button
                type="button"
                onClick={handleApproveDeposit}
                disabled={selectedDeposit.status !== 'pending'}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 inline-flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                Mark as successful
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
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="px-4 py-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Label
                </label>
                <input
                  type="text"
                  value={newAddress.label}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      label: e.target.value,
                    }))
                  }
                  placeholder="e.g. Primary USDT TRC20"
                  className="w-full rounded-lg border text-black border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70"
                />
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
                  placeholder="Paste your USDT TRC20 address here"
                  className="w-full rounded-lg border  text-black border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Network
                </label>
                <select
                  value={newAddress.network}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      network: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border text-black border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 bg-white"
                >
                  <option value="TRON (USDT)">TRON (USDT)</option>
                  <option value="Ethereum (USDT)">Ethereum (USDT)</option>
                  <option value="BSC (USDT)">BSC (USDT)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm"
                >
                  Save address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCryptoWalletPage;


