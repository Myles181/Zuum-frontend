import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Send, 
  CreditCard, 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Repeat,
  ShoppingCart,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import Navbar from '../components/profile/NavBar';
import BottomNav from '../components/homepage/BottomNav';
import { Link } from 'react-router-dom';
import { useUserTransactions } from "../../Hooks/Dashbored/userTransactions";
import { useGetUserWithdrawalRequests } from "../../Hooks/Dashbored/useGetUserWithdrawalRequests";

const MobileDashboard = ({ 
  balance = 50000.00, 
  recentTransactions = [], 
  onSend, 
  onWithdraw, 
  setActiveTab,
  profile
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentBalanceIndex, setCurrentBalanceIndex] = useState(0);
  const [NoOfData, setNoOfData] = useState(5);
  const [withdrawalsNoOfData, setWithdrawalsNoOfData] = useState(5);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const scrollContainerRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Use the actual hooks
  const { data, loading, error, refetch } = useUserTransactions();
  const { withdrawals, withdrawalAPIloading, withdrawalAPIerror, fetchWithdrawals } = useGetUserWithdrawalRequests();

  // Log data for debugging
  if (withdrawalAPIloading) {
    console.log("Withdrawal data loading...");
  } else {
    console.log("Withdrawals:", withdrawals);
  }

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
    '--color-gradient-secondary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--color-gradient-tertiary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    '--color-border': 'rgba(255, 255, 255, 0.08)'
  };

  const balances = [
    { 
      currency: 'NGN', 
      amount: profile?.balance || 0, 
      symbol: '₦',
      change: '+2.3%',
      changeType: 'positive',
      gradient: 'var(--color-gradient-primary)'
    },
    { 
      currency: 'USDT', 
      amount: profile?.usdt_balance || 0, 
      symbol: '$',
      change: '+0.1%',
      changeType: 'positive',
      gradient: 'var(--color-gradient-tertiary)'
    }
  ];

  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = 320;
      const scrollPosition = index * cardWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 320;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentBalanceIndex(newIndex);
    }
  };

  const formatAmount = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0.00';
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getTransactionIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'deposit': return <ArrowDownLeft className="w-5 h-5" />;
      case 'withdrawal': return <ArrowUpRight className="w-5 h-5" />;
      case 'transfer': return <Repeat className="w-5 h-5" />;
      case 'purchase': return <ShoppingCart className="w-5 h-5" />;
      default: return <Repeat className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
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
    switch(status?.toLowerCase()) {
      case 'successful':
      case 'success':
      case 'sent':
      case 'completed':
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

  return (
    <div style={darkModeStyles}>
      <Navbar name="Wallet" toggleSidebar={toggleSidebar} />

      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-4 backdrop-blur-xl" style={{ backgroundColor: 'rgba(10, 10, 10, 0.8)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            My Wallet
          </h1>
          <button 
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="p-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ backgroundColor: 'var(--color-card-bg)' }}
          >
            {balanceVisible ? (
              <Eye className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            ) : (
              <EyeOff className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            )}
          </button>
        </div>
      </div>

      <div 
        className="flex-1 p-4 max-w-md mx-auto pb-24"
        style={{ 
          background: 'var(--color-bg-gradient)',
          backgroundColor: 'var(--color-bg-primary)',
          minHeight: '100vh'
        }}
      >
        {/* Balance Carousel */}
        <div className="mb-6 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 
              className="text-base font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Your Balances
            </h3>
            <div className="flex space-x-2">
              {balances.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentBalanceIndex(index);
                    scrollToCard(index);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentBalanceIndex 
                      ? 'w-6 h-2' 
                      : 'w-2 h-2'
                  }`}
                  style={{
                    backgroundColor: index === currentBalanceIndex 
                      ? 'var(--color-accent-primary)' 
                      : 'var(--color-border)'
                  }}
                />
              ))}
            </div>
          </div>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth space-x-4 pb-2 snap-x snap-mandatory"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            onScroll={handleScroll}
          >
            {balances.map((balanceItem, index) => (
              <div
                key={balanceItem.currency}
                className={`flex-shrink-0 w-80 p-6 rounded-3xl transition-all duration-500 snap-center ${
                  index === currentBalanceIndex 
                    ? 'shadow-2xl' 
                    : 'opacity-80'
                }`}
                style={{ 
                  background: balanceItem.gradient,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => {
                  setCurrentBalanceIndex(index);
                  scrollToCard(index);
                }}
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-xs font-medium opacity-80 mb-2 text-white tracking-wide uppercase">
                      {balanceItem.currency} Balance
                    </div>
                    <div className="text-4xl font-bold mb-3 text-white tracking-tight">
                      {balanceVisible ? (
                        `${balanceItem.symbol}${formatAmount(balanceItem.amount)}`
                      ) : (
                        '••••••'
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-white opacity-80" />
                      <span className="text-sm text-white opacity-90">
                        {balanceItem.change} today
                      </span>
                    </div>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    {balanceItem.currency.charAt(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Link to='/dashboard/deposit' className="block">
            <button
              className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 w-full"
              style={{ 
                backgroundColor: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-card-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-card-bg)'}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
                style={{ background: 'var(--color-gradient-primary)' }}
              >
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Deposit
              </span>
            </button>
          </Link>

          <Link to='/dashboard/transfer' className="block">
            <button
              className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 w-full"
              style={{ 
                backgroundColor: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-card-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-card-bg)'}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
                style={{ background: 'var(--color-gradient-secondary)' }}
              >
                <Send className="w-6 h-6 text-white" />
              </div>
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Send
              </span>
            </button>
          </Link>

          <Link to='/dashboard/withdraw' className="block">
            <button
              className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 w-full"
              style={{ 
                backgroundColor: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-card-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-card-bg)'}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
                style={{ background: 'var(--color-gradient-tertiary)' }}
              >
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Withdraw
              </span>
            </button>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 
              className="text-base font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Recent Activity
            </h3>
            {data && data.length > 5 && (
              <button
                onClick={() => setNoOfData(prev => prev === 5 ? data.length : 5)}
                className="text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ color: 'var(--color-accent-primary)' }}
              >
                {NoOfData === 5 ? "View All" : "Show Less"}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
                Loading transactions...
              </div>
            ) : error ? (
              <div 
                className="text-center py-12 rounded-2xl"
                style={{ 
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  color: '#ef4444'
                }}
              >
                Error loading transactions. Please try again.
              </div>
            ) : Array.isArray(data) && data.length > 0 ? (
              data.slice(0, NoOfData).map((transaction) => {
                const statusColors = getStatusColor(transaction.status);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    style={{ 
                      backgroundColor: 'var(--color-card-bg)',
                      border: '1px solid var(--color-border)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-card-bg)'}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
                        style={{ 
                          backgroundColor: transaction.type?.toLowerCase() === 'deposit' 
                            ? 'rgba(34, 197, 94, 0.1)' 
                            : 'rgba(239, 68, 68, 0.1)',
                          color: transaction.type?.toLowerCase() === 'deposit' 
                            ? '#22c55e' 
                            : '#ef4444'
                        }}
                      >
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <div 
                            className="font-medium truncate"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {transaction.to || transaction.from || 'Unknown'}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span 
                            className="text-xs capitalize"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {transaction.type || 'transaction'}
                          </span>
                          <span style={{ color: 'var(--color-text-secondary)' }}>•</span>
                          <span 
                            className="text-xs"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {transaction.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div 
                        className="font-semibold mb-1"
                        style={{ 
                          color: transaction.type?.toLowerCase() === 'deposit' ? '#22c55e' : '#ef4444'
                        }}
                      >
                        {transaction.type?.toLowerCase() === 'deposit' ? '+' : '-'}₦{transaction.amount?.toLocaleString() || '0'}
                      </div>
                      <div className="flex items-center justify-end space-x-1">
                        {getStatusIcon(transaction.status)}
                        <span 
                          className="text-xs capitalize"
                          style={{ color: statusColors.color }}
                        >
                          {transaction.status || 'pending'}
                        </span>
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
                No transactions found
              </div>
            )}
          </div>
        </div>

        {/* Withdrawal Requests */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 
              className="text-base font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Withdrawal Requests
            </h3>
            {withdrawals && withdrawals.length > 5 && (
              <button
                onClick={() => setWithdrawalsNoOfData(prev => prev === 5 ? withdrawals.length : 5)}
                className="text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ color: 'var(--color-accent-primary)' }}
              >
                {withdrawalsNoOfData === 5 ? "View All" : "Show Less"}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {withdrawalAPIloading ? (
              <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
                Loading withdrawals...
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
                Error loading withdrawals. Please try again.
              </div>
            ) : Array.isArray(withdrawals) && withdrawals.length > 0 ? (
              withdrawals.slice(0, withdrawalsNoOfData).map((withdrawal) => {
                const statusColors = getStatusColor(withdrawal.status);
                return (
                  <div
                    key={withdrawal.id}
                    className="p-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    style={{ 
                      backgroundColor: 'var(--color-card-bg)',
                      border: '1px solid var(--color-border)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-card-bg)'}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span 
                            className="font-medium"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {withdrawal.account_name}
                          </span>
                          <div
                            className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs"
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
                            className="text-xs"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {withdrawal.reason}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-3">
                        <div 
                          className="font-semibold text-lg mb-1"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          ₦{withdrawal.amount}
                        </div>
                        <div 
                          className="text-xs"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {new Date(withdrawal.updated_at).toLocaleDateString()}
                        </div>
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
                No withdrawal requests found
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MobileDashboard;