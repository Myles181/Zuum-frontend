import React, { useState, useRef } from 'react';
import Navbar from '../components/profile/NavBar';
import BottomNav from '../components/homepage/BottomNav';
import { Link } from 'react-router-dom';

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
  const scrollContainerRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  console.log(profile);
  

 

  // Dark mode styles with modern gradient
  const darkModeStyles = {
    '--color-bg-primary': '#0f0f0f',
    '--color-bg-secondary': '#1a1a1a',
    '--color-bg-gradient': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    '--color-card-bg': 'rgba(255, 255, 255, 0.05)',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#a0a0a0',
    '--color-accent-primary': '#2D8C72',
    '--color-accent-secondary': '#34A085',
    '--color-gradient-primary': 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)',
    '--color-gradient-secondary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--color-gradient-tertiary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    '--color-border': 'rgba(255, 255, 255, 0.1)'
  };

  // Modern balance data with growth indicators
  const balances = [
    { 
      currency: 'NGN', 
      amount: profile?.balance , 
      symbol: '₦',
      change: '+2.3%',
      changeType: 'positive',
      gradient: 'var(--color-gradient-primary)'
    },
    // { 
    //   currency: 'BTC', 
    //   amount: 0.0234, 
    //   symbol: '₿',
    //   change: '+5.7%',
    //   changeType: 'positive',
    //   gradient: 'var(--color-gradient-secondary)'
    // },
    { 
      currency: 'USDT', 
      amount: profile?.usdt_balance, 
      symbol: '$',
      change: '+0.1%',
      changeType: 'positive',
      gradient: 'var(--color-gradient-tertiary)'
    }
  ];

  // Enhanced fake transaction data
  const defaultTransactions = [
    { 
      id: 1, 
      type: 'purchase', 
      amount: 4990, 
      to: 'ProducerX', 
      date: '2023-05-15', 
      status: 'completed',
      icon: '🎵',
      category: 'Music'
    },
    { 
      id: 2, 
      type: 'deposit', 
      amount: 50000, 
      from: 'Bank Transfer', 
      date: '2023-05-10', 
      status: 'completed',
      icon: '🏦',
      category: 'Banking'
    },
    { 
      id: 3, 
      type: 'transfer', 
      amount: 10000, 
      to: 'ArtistY', 
      date: '2023-05-08', 
      status: 'completed',
      icon: '👤',
      category: 'Transfer'
    },
    { 
      id: 4, 
      type: 'withdrawal', 
      amount: 20000, 
      to: 'Bank Account', 
      date: '2023-05-05', 
      status: 'pending',
      icon: '💳',
      category: 'Banking'
    },
    { 
      id: 5, 
      type: 'purchase', 
      amount: 7500, 
      to: 'BeatStore', 
      date: '2023-05-03', 
      status: 'completed',
      icon: '🛒',
      category: 'Store'
    }
  ];

  const transactions = recentTransactions.length > 0 ? recentTransactions : defaultTransactions;

  // const handleScroll = (direction) => {
  //   const container = scrollContainerRef.current;
  //   if (!container) return;

  //   const scrollAmount = 320;
  //   const newIndex = direction === 'next' 
  //     ? Math.min(currentBalanceIndex + 1, balances.length - 1)
  //     : Math.max(currentBalanceIndex - 1, 0);

  //   setCurrentBalanceIndex(newIndex);
  //   container.scrollTo({
  //     left: newIndex * scrollAmount,
  //     behavior: 'smooth'
  //   });
  // };


  const scrollToCard = (index) => {
  if (scrollContainerRef.current) {
    const cardWidth = 320; // w-80 = 320px
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
    const cardWidth = 320; // w-80 = 320px
    const newIndex = Math.round(scrollLeft / cardWidth);
    setCurrentBalanceIndex(newIndex);
  }
};

  const currentBalance = balances[currentBalanceIndex] || balances[0];

  // Safe number formatting
  const formatAmount = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0.00';
    return amount.toLocaleString();
  };

  const getTransactionIcon = (type) => {
    const icons = {
      deposit: '⬇️',
      withdrawal: '⬆️',
      transfer: '🔄',
      purchase: '🛒'
    };
    return icons[type] || '💸';
  };

  return (
    <div style={darkModeStyles}>
      <Navbar name="Wallet" toggleSidebar={toggleSidebar} />

      <div 
        className="flex-1 p-4 max-w-md mx-auto min-h-screen"
        style={{ 
          background: 'var(--color-bg-gradient)',
          backgroundColor: 'var(--color-bg-primary)'
        }}
      >
        {/* Modern Balance Header */}
       

        {/* Modern Balance Carousel */}
        <div className="mb-8 mt-13">
  <div className="flex justify-between items-center mb-4">
    <h3 
      className="text-lg font-semibold"
      style={{ color: 'var(--color-text-primary)' }}
    >
      Wallets
    </h3>
    <div className="flex space-x-1">
      {balances.map((_, index) => (
        <button
          key={index}
          onClick={() => {
            setCurrentBalanceIndex(index);
            scrollToCard(index);
          }}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === currentBalanceIndex 
              ? 'bg-green-400 scale-125' 
              : 'bg-gray-600'
          }`}
        />
      ))}
    </div>
  </div>

  {/* Fixed Carousel with proper scrolling */}
  <div 
    ref={scrollContainerRef}
    className="flex overflow-x-auto scroll-smooth space-x-4 pb-4 snap-x snap-mandatory"
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
        className={`flex-shrink-0 w-80 p-6 rounded-3xl transition-all duration-500 transform cursor-pointer snap-center ${
          index === currentBalanceIndex 
            ? 'scale-100 shadow-2xl' 
            : 'scale-95 opacity-90'
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
        <div className="flex justify-between items-start mb-6">
          <div>
            <div 
              className="text-sm font-medium opacity-90 mb-1"
              style={{ color: 'white' }}
            >
              {balanceItem.currency} Balance
            </div>
            <div 
              className="text-2xl font-bold mb-2"
              style={{ color: 'white' }}
            >
              {balanceItem.symbol}{formatAmount(balanceItem.amount)}
            </div>
          </div>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            {balanceItem.currency.charAt(0)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div 
            className="text-sm opacity-90"
            style={{ color: 'white' }}
          >
            {balanceItem.change} today
          </div>
          <div 
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            Active
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

{/* Fixed Button Layout - 4 equal columns */}
<div className="grid grid-cols-3 gap-3 mb-8">
  <Link to='/dashboard/deposit' className="block">
    <button
      className="group flex flex-col items-center p-3 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 w-full h-full"
      style={{ 
        backgroundColor: 'var(--color-card-bg)',
        border: '1px solid var(--color-border)'
      }}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110"
        style={{ background: 'var(--color-gradient-primary)' }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <span 
        className="text-xs font-medium"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Deposit
      </span>
    </button>
  </Link>

  <button
    // onClick={}
    className="group flex flex-col items-center p-3 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 w-full"
    style={{ 
      backgroundColor: 'var(--color-card-bg)',
      border: '1px solid var(--color-border)'
    }}
  >
    <div 
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110"
      style={{ background: 'var(--color-gradient-secondary)' }}
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    </div>
    <span 
      className="text-xs font-medium"
      style={{ color: 'var(--color-text-primary)' }}
    >
      Send
    </span>
  </button>

  <button
    
    className="group flex flex-col items-center p-3 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 w-full"
    style={{ 
      backgroundColor: 'var(--color-card-bg)',
      border: '1px solid var(--color-border)'
    }}
  >
    <div 
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110"
      style={{ background: 'var(--color-gradient-tertiary)' }}
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    </div>
    <span 
      className="text-xs font-medium"
      style={{ color: 'var(--color-text-primary)' }}
    >
      Withdraw
    </span>
  </button>

  {/* Add a fourth button to complete the grid - Exchange/More */}

</div>

        {/* Modern Transaction History */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-4">
            <h3 
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Recent Activity
            </h3>
            <button
              onClick={() => setActiveTab('history')}
              className="text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer group"
                style={{ 
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundColor: 'rgba(45, 140, 114, 0.1)',
                      border: '1px solid rgba(45, 140, 114, 0.2)'
                    }}
                  >
                    {transaction.icon || getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div 
                        className="font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {transaction.to || transaction.from}
                      </div>
                      <div 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          backgroundColor: transaction.status === 'completed' 
                            ? 'rgba(34, 197, 94, 0.1)' 
                            : 'rgba(251, 191, 36, 0.1)',
                          color: transaction.status === 'completed' 
                            ? '#22c55e' 
                            : '#fbbf24',
                          border: `1px solid ${transaction.status === 'completed' 
                            ? 'rgba(34, 197, 94, 0.2)' 
                            : 'rgba(251, 191, 36, 0.2)'}`
                        }}
                      >
                        {transaction.status}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="text-sm capitalize"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {transaction.type}
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        •
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {transaction.date}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    className={`font-semibold text-lg ${
                      transaction.type === 'deposit' ? 'text-green-400' : 'text-white'
                    }`}
                  >
                    {transaction.type === 'deposit' ? '+' : '-'}₦{transaction.amount?.toLocaleString() || '0'}
                  </div>
                  <div 
                    className="text-xs capitalize mt-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {transaction.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MobileDashboard;