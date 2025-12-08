import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Repeat,
  ShoppingCart,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Star,
  Coins
} from 'lucide-react';
import Navbar from '../components/profile/NavBar';
import BottomNav from '../components/homepage/BottomNav';
import { useTransactions } from '../hooks/useTransactions';
import { useGetUserWithdrawalRequests } from '../../Hooks/Dashbored/useGetUserWithdrawalRequests';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'transactions';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch data using the new payment transactions hook
  const { 
    transactions, 
    balances,
    isLoading: transactionsLoading, 
    error: transactionsError, 
    fetchTransactions: refetchTransactions,
    getStats
  } = useTransactions();
  const { withdrawals, withdrawalAPIloading, withdrawalAPIerror, fetchWithdrawals } = useGetUserWithdrawalRequests();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Dark mode styles
  const darkModeStyles = {
    '--color-bg-primary': '#0a0a0a',
    '--color-bg-secondary': '#141414',
    '--color-bg-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #141414 100%)',
    '--color-card-bg': 'rgba(255, 255, 255, 0.03)',
    '--color-card-hover': 'rgba(255, 255, 255, 0.06)',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#888888',
    '--color-accent-primary': '#2D8C72',
    '--color-accent-secondary': '#34A085',
    '--color-gradient-primary': 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)',
    '--color-border': 'rgba(255, 255, 255, 0.08)'
  };

  const getTransactionIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'deposit':
      case 'bank_deposit':
      case 'crypto_deposit':
        return <ArrowDownLeft className="w-5 h-5" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5" />;
      case 'transfer':
        return <Repeat className="w-5 h-5" />;
      case 'purchase':
        return <ShoppingCart className="w-5 h-5" />;
      case 'subscription':
        return <Star className="w-5 h-5" />;
      case 'promotion_audio':
      case 'promotion':
        return <TrendingUp className="w-5 h-5" />;
      case 'usdt':
      case 'crypto':
        return <Coins className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'successful':
      case 'success':
      case 'sent':
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'successful':
      case 'success':
      case 'sent':
      case 'completed':
      case 'approved':
        return {
          bg: 'rgba(34, 197, 94, 0.1)',
          color: '#22c55e',
          border: 'rgba(34, 197, 94, 0.2)'
        };
      case 'pending':
        return {
          bg: 'rgba(251, 191, 36, 0.1)',
          color: '#fbbf24',
          border: 'rgba(251, 191, 36, 0.2)'
        };
      case 'rejected':
      case 'failed':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: 'rgba(239, 68, 68, 0.2)'
        };
      default:
        return {
          bg: 'rgba(156, 163, 175, 0.1)',
          color: '#9ca3af',
          border: 'rgba(156, 163, 175, 0.2)'
        };
    }
  };

  const getTypeColor = (type) => {
    const isIncoming = ['deposit', 'bank_deposit', 'crypto_deposit', 'credit'].includes(type?.toLowerCase());
    return isIncoming ? '#22c55e' : '#ef4444';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0.00';
    return amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Filter transactions
  const filteredTransactions = (transactions || []).filter((t) => {
    const matchesSearch = searchTerm === '' ||
      t.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id?.toString().includes(searchTerm);
    const matchesType = filterType === 'all' || t.type?.toLowerCase() === filterType;
    const matchesStatus = filterStatus === 'all' ||
      t.status?.toLowerCase() === filterStatus ||
      (filterStatus === 'success' && t.status?.toLowerCase() === 'successful') ||
      (filterStatus === 'successful' && t.status?.toLowerCase() === 'success');
    return matchesSearch && matchesType && matchesStatus;
  });

  // Filter withdrawals
  const filteredWithdrawals = (withdrawals || []).filter((w) => {
    const matchesSearch = searchTerm === '' ||
      w.account_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.bank_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.account_number?.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' ||
      w.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get unique transaction types
  const transactionTypes = ['all', ...new Set((transactions || []).map(t => t.type?.toLowerCase()).filter(Boolean))];

  // Calculate stats using the hook's getStats or calculate locally
  const hookStats = getStats ? getStats() : {};
  const stats = {
    totalDeposits: hookStats.totalDeposits || (transactions || [])
      .filter(t => ['deposit', 'bank_deposit', 'crypto_deposit', 'credit'].includes(t.type?.toLowerCase()))
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
    totalWithdrawals: hookStats.totalWithdrawals || (transactions || [])
      .filter(t => ['withdrawal', 'debit'].includes(t.type?.toLowerCase()))
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
    totalTransactions: (transactions || []).length,
    pendingWithdrawals: (withdrawals || []).filter(w => w.status?.toLowerCase() === 'pending').length
  };

  return (
    <div style={darkModeStyles}>
      <Navbar name="Transactions" toggleSidebar={toggleSidebar} />

      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-4 backdrop-blur-xl"
        style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ backgroundColor: 'var(--color-card-bg)' }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--color-text-primary)' }} />
            </button>
            <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Transaction History
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: 'var(--color-text-secondary)' }}
            />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>

          {/* Tabs */}
          <div
            className="flex rounded-xl p-1"
            style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}
          >
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'transactions' ? 'shadow-lg' : ''
              }`}
              style={{
                backgroundColor: activeTab === 'transactions' ? 'var(--color-accent-primary)' : 'transparent',
                color: activeTab === 'transactions' ? '#fff' : 'var(--color-text-secondary)'
              }}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'withdrawals' ? 'shadow-lg' : ''
              }`}
              style={{
                backgroundColor: activeTab === 'withdrawals' ? 'var(--color-accent-primary)' : 'transparent',
                color: activeTab === 'withdrawals' ? '#fff' : 'var(--color-text-secondary)'
              }}
            >
              Withdrawals
              {stats.pendingWithdrawals > 0 && (
                <span
                  className="ml-2 px-2 py-0.5 text-xs rounded-full"
                  style={{ backgroundColor: '#fbbf24', color: '#000' }}
                >
                  {stats.pendingWithdrawals}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 p-4 max-w-md mx-auto pb-24"
        style={{
          background: 'var(--color-bg-gradient)',
          backgroundColor: 'var(--color-bg-primary)',
          minHeight: '100vh'
        }}
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div
            className="p-4 rounded-2xl"
            style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" style={{ color: '#22c55e' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total Deposits</span>
            </div>
            <p className="text-lg font-bold" style={{ color: '#22c55e' }}>
              ₦{formatAmount(stats.totalDeposits)}
            </p>
          </div>
          <div
            className="p-4 rounded-2xl"
            style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4" style={{ color: '#ef4444' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total Withdrawals</span>
            </div>
            <p className="text-lg font-bold" style={{ color: '#ef4444' }}>
              ₦{formatAmount(stats.totalWithdrawals)}
            </p>
          </div>
        </div>

        {/* Filters */}
        {activeTab === 'transactions' && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {transactionTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300"
                style={{
                  backgroundColor: filterType === type ? 'var(--color-accent-primary)' : 'var(--color-card-bg)',
                  color: filterType === type ? '#fff' : 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                {type === 'all' ? 'All' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        )}

        {/* Status Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {['all', 'successful', 'pending', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300"
              style={{
                backgroundColor: filterStatus === status ? 'var(--color-accent-primary)' : 'var(--color-card-bg)',
                color: filterStatus === status ? '#fff' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)'
              }}
            >
              {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => activeTab === 'transactions' ? refetchTransactions() : fetchWithdrawals()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              color: 'var(--color-accent-primary)',
              border: '1px solid var(--color-border)'
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Transactions List */}
        {activeTab === 'transactions' && (
          <div className="space-y-2">
            {transactionsLoading ? (
              <div
                className="flex flex-col items-center justify-center py-12 rounded-2xl"
                style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}
              >
                <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: 'var(--color-accent-primary)' }} />
                <p style={{ color: 'var(--color-text-secondary)' }}>Loading transactions...</p>
              </div>
            ) : transactionsError ? (
              <div
                className="text-center py-12 rounded-2xl"
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  color: '#ef4444'
                }}
              >
                <AlertCircle className="w-8 h-8 mx-auto mb-3" />
                <p>Error loading transactions</p>
                <button
                  onClick={refetchTransactions}
                  className="mt-3 px-4 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: 'var(--color-accent-primary)', color: '#fff' }}
                >
                  Try Again
                </button>
              </div>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => {
                const statusColors = getStatusColor(transaction.status);
                const isIncoming = ['deposit', 'bank_deposit', 'crypto_deposit', 'credit'].includes(transaction.type?.toLowerCase());
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-2xl transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--color-card-bg)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: isIncoming ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: isIncoming ? '#22c55e' : '#ef4444'
                        }}
                      >
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="font-medium capitalize truncate"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {transaction.type?.replace('_', ' ') || 'Transaction'}
                          </span>
                          <div
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                            style={{
                              backgroundColor: statusColors.bg,
                              color: statusColors.color,
                              border: `1px solid ${statusColors.border}`
                            }}
                          >
                            {getStatusIcon(transaction.status)}
                            <span className="capitalize">{transaction.status}</span>
                          </div>
                        </div>
                        <p
                          className="text-xs"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <p
                        className="font-semibold"
                        style={{ color: isIncoming ? '#22c55e' : '#ef4444' }}
                      >
                        {isIncoming ? '+' : '-'}₦{formatAmount(transaction.amount)}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        ID: {transaction.id}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className="text-center py-12 rounded-2xl"
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No transactions found</p>
                {(filterType !== 'all' || filterStatus !== 'all' || searchTerm) && (
                  <button
                    onClick={() => {
                      setFilterType('all');
                      setFilterStatus('all');
                      setSearchTerm('');
                    }}
                    className="mt-3 text-sm"
                    style={{ color: 'var(--color-accent-primary)' }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Withdrawals List */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-2">
            {withdrawalAPIloading ? (
              <div
                className="flex flex-col items-center justify-center py-12 rounded-2xl"
                style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}
              >
                <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: 'var(--color-accent-primary)' }} />
                <p style={{ color: 'var(--color-text-secondary)' }}>Loading withdrawals...</p>
              </div>
            ) : withdrawalAPIerror ? (
              <div
                className="text-center py-12 rounded-2xl"
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  color: '#ef4444'
                }}
              >
                <AlertCircle className="w-8 h-8 mx-auto mb-3" />
                <p>Error loading withdrawals</p>
                <button
                  onClick={fetchWithdrawals}
                  className="mt-3 px-4 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: 'var(--color-accent-primary)', color: '#fff' }}
                >
                  Try Again
                </button>
              </div>
            ) : filteredWithdrawals.length > 0 ? (
              filteredWithdrawals.map((withdrawal) => {
                const statusColors = getStatusColor(withdrawal.status);
                return (
                  <div
                    key={withdrawal.id}
                    className="p-4 rounded-2xl transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--color-card-bg)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="font-medium"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {withdrawal.account_name}
                          </span>
                          <div
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                            style={{
                              backgroundColor: statusColors.bg,
                              color: statusColors.color,
                              border: `1px solid ${statusColors.border}`
                            }}
                          >
                            {getStatusIcon(withdrawal.status)}
                            <span className="capitalize">{withdrawal.status}</span>
                          </div>
                        </div>
                        <div
                          className="text-sm mb-1"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {withdrawal.bank_name} • {withdrawal.account_number}
                        </div>
                        {withdrawal.reason && (
                          <div
                            className="text-xs mt-2 p-2 rounded-lg"
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444'
                            }}
                          >
                            Reason: {withdrawal.reason}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-3">
                        <p
                          className="font-semibold text-lg"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          ₦{formatAmount(withdrawal.amount)}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {formatDate(withdrawal.updated_at || withdrawal.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className="text-center py-12 rounded-2xl"
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No withdrawal requests found</p>
                {(filterStatus !== 'all' || searchTerm) && (
                  <button
                    onClick={() => {
                      setFilterStatus('all');
                      setSearchTerm('');
                    }}
                    className="mt-3 text-sm"
                    style={{ color: 'var(--color-accent-primary)' }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default TransactionHistory;
